const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/', async (req, res) => { // /api/user/
  try {
    const exUser = await db.User.findOne({
      where : {
        userId : req.body.userId
      }
    });

    if(exUser) {
      return res.status(403).send('이미 사용중인 아이디입니다. ');
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12) // salt는 10 ~ 13사이로
    const newUser = db.User.create({
      nickname : req.body.nickname,
      userId : req.body.userId,
      password : hashedPassword
    })
    console.log(newUser);
    return res.status(200).json(newUser);
  } catch(e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});
router.post('/', async (req, res, next) => { // POST /api/user 회원가입
  
});

router.get('/:id', (req, res) => { // 남의 정보 가져오는 것 ex) /api/user/123

});

router.post('/logout', (req, res) => { // /api/user/logout
  
});

router.post('/login', (req, res, next) => { // POST /api/user/login
  
});

router.get('/:id/follow', (req, res) => { // /api/user/:id/follow

});
router.post('/:id/follow', (req, res) => {

});

router.delete('/:id/follow', (req, res) => {

});

router.delete('/:id/follower', (req, res) => {

});

router.get('/:id/posts', (req, res) => {

});

module.exports = router;