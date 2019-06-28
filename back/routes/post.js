const express = require('express');
const db = require('../models');

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

router.post('/images', (req, res) => {

});

module.exports = router;