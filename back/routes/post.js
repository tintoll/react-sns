const express = require('express');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.post('/', async (req, res, next) => { // POST /api/post
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
    /*
    const User = await newPost.getUser();
    newPost.User = User;
    return res.json(newPost);
    */
    const fullPost = await db.Post.findOne({
      where : { id : newPost.id},
      include : [{
        model : db.User
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

module.exports = router;