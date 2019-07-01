const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middleware');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// multer 설정
const upload = multer({
  storage : multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      // 제로초.png  ext === .png, basename=== 제로초
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext);  
      done(null, basename+new Date().valueOf() + ext);
    }
  }),
  limits : { fileSize : 20*1024*1024},
});

// 멀터 적용 router
/*
  upload.array()
  upload.none()
  upload.field()
*/
router.post('/images', upload.array('image'),(req, res) => {
  console.log(req.files);
  return res.json(req.files.map( v => v.filename));
})

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => { // POST /api/post
  try {
    // 해시태그들을 파싱하여 가져온다. 
    const hashtags = req.body.content.match(/#[^\s]+/g);
    const newPost = await db.Post.create({
      content : req.body.content, // ex) 제로초 파이팅 #제로초 #파이팅 눌러주세요 
      UserId : req.user.id,
    });

    if(hashtags) {
      // findOrCreate : 조건에 맞는걸 찾아보고 없으면 생성 
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.findOrCreate({
        where : { name : tag.slice(1).toLowerCase()} // #글자 지우고 영문은 소문자로 저장
      })));

      console.log(result);
      await newPost.addHashtags(result.map( r => r[0]));
    }
    // 이미지 처리 
    if (req.body.image) { // 이미지 주소를 여러개 올리면 image: [주소1, 주소2]
      if(Array.isArray(req.body.image)) {
        const images = await Promise.all(req.body.image.map((image) => {
          return db.Image.create({ src: image});
        }));
        // 이미지 생성후 Post랑 연결시켜줌
        await newPost.addImages(images);
      } else { // 이미지를 하나만 올리면 image: 주소1
        const image = await db.Image.create({src : req.body.image});
        await newPost.addImage(image);
      }
    }


    /*
    const User = await newPost.getUser();
    newPost.User = User;
    return res.json(newPost);
    */
    const fullPost = await db.Post.findOne({
      where : { id : newPost.id},
      include : [{
        model : db.User
      },{
        model : db.Image
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id']
      }]
    })

    return res.json(fullPost);

  } catch(e) {
    next(e);
  }
});


router.get('/:id/comments', async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const comments = await db.Comment.findAll({
      where: {
        PostId: req.params.id,
      },
      order: [['createdAt', 'ASC']],
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    res.json(comments);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.post('/:id/comment', isLoggedIn, async (req, res, next) => { // POST /api/post/1000000/comment
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    const newComment = await db.Comment.create({
      PostId: post.id,
      UserId: req.user.id,
      content: req.body.content,
    });
    await post.addComment(newComment.id);
    const comment = await db.Comment.findOne({
      where: {
        id: newComment.id,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      }],
    });
    return res.json(comment);
  } catch (e) {
    console.error(e);
    return next(e);
  }
});


// 좋아요 
router.post('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where : { id : req.params.id}});
    if(!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.addLiker(req.user.id);
    res.json({userId : req.user.id});
  } catch (e) {
    console.error(e);
    next(e);
  }
});
// 좋아요 취소 
router.delete('/:id/like', isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({ where: { id: req.params.id } });
    if (!post) {
      return res.status(404).send('포스트가 존재하지 않습니다.');
    }
    await post.removeLiker(req.user.id);
    res.json({ userId: req.user.id });
  } catch (e) {
    console.error(e);
    next(e);
  }
});

module.exports = router;