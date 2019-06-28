const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');

const router = express.Router();

router.get('/', (req, res) => { // /api/user/
  if(!req.user) {
    return res.status(401).send('로그인이 필요합니다.');
  }

  const user = Object.assign({}, req.user.toJSON());
  delete user.password;

  return res.json(user);
});
router.post('/', async (req, res, next) => { // POST /api/user 회원가입
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
    return res.status(200).json(newUser);
  } catch(e) {
    console.error(e);
    // 에러 처리를 여기서
    return next(e);
  }
});

router.get('/:id', (req, res) => { // 남의 정보 가져오는 것 ex) /api/user/123
});

router.post('/logout', (req, res) => { // /api/user/logout
  req.logout();
  req.session.destroy();
  res.send('로그아웃 성공');
});
router.post('/login', (req, res, next) => { // POST /api/user/login
  // passport 전략을 실행한다.
  passport.authenticate('local', (err, user, info) => {
    // 서버에러 
    if(err) {
      console.log(err);
      next(err);
    }
    // 로직상 에러
    if(info) {
      return res.status(401).send(info.reason);
    }

    return req.login( user, async (loginError) => {
      
      try {
        if(loginError) {
          next(loginError);
        }
        const fullUser = await db.User.findOne({
          where : {
            id : user.id
          },
          // user객체에 post 정보 넣어주기 위해서 
          include : [{
            model : db.Post,
            as : 'Posts',
            attributes : ['id'], // id컬럼만 가지고 온다. 프론트에서 개수만 셀것이기 때문에 
          },{
            model : db.User,
            as : 'Followings',
            attributes : ['id'],
          },{
            model : db.User,
            as : 'Followers',
            attributes : ['id'], 
          }],
          attributes : ['id', 'nickname', 'userId']
        });

        return res.json(fullUser);

      } catch(e) {
        console.log(e);
        return next(loginError);
      }

      
    });
  })(req, res, next); // <-- 이부분 까먹지 말고 붙여줘야한다.
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