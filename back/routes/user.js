const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const db = require('../models');
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.get('/', isLoggedIn, (req, res) => { // /api/user/

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

router.get('/:id', async (req, res, next) => { // 남의 정보 가져오는 것 ex) /api/user/123
  try {
    const user = await db.User.findOne({
      where : {
        id : parseInt(req.params.id, 10)
      },
      include : [{
        model : db.Post,
        as : 'Posts',
        attributes : ['id']
      },{
        model : db.User,
        as : 'Followings',
        attributes : ['id']
      },{
        model : db.User,
        as : 'Followers',
        attributes : ['id']
      }],
      attributes : ['id', 'nickname']
    });

    // 정보를 다 보내주면 보안에 위험이 있어서 카운트만 보내줌.
    const jsonUser = user.toJSON();
    jsonUser.Posts = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.Followings = jsonUser.Followings ? jsonUser.Followings.length : 0;
    jsonUser.Followers = jsonUser.Followers ? jsonUser.Followers.length : 0;
    res.json(jsonUser);


  } catch(e) {
    console.error(e);
    next(e);
  }

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


router.get('/:id/posts', async (req, res, next) => {

  try {
    const posts = await db.Post.findAll({
      where: {
        UserId: parseInt(req.params.id, 10),
        RetweetId: null,
      },
      include: [{
        model: db.User,
        attributes: ['id', 'nickname'],
      },{
          model: db.Image,
      }, {
        model: db.User,
        through: 'Like',
        as: 'Likers',
        attributes: ['id']
      }],
    });
    res.json(posts);
  } catch (e) {
    console.error(e);
    next(e);
  }

});


router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {

    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.addFollowing(parseInt(req.params.id,10));
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.delete('/:id/follow', isLoggedIn, async (req, res, next) => {
  try {
    const me = await db.User.findOne({
      where: { id: req.user.id },
    });
    await me.removeFollowing(parseInt(req.params.id, 10));
    res.send(req.params.id);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


router.get('/:id/followings', isLoggedIn, async (req, res, next) => { // /api/user/:id/followings
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    const followers = await user.getFollowings({
      attributes: ['id', 'nickname'],
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});

router.get('/:id/followers', isLoggedIn, async (req, res, next) => { // /api/user/:id/followers
  try {
    const user = await db.User.findOne({
      where: { id: parseInt(req.params.id, 10) },
    });
    const followers = await user.getFollowers({
      attributes: ['id', 'nickname'],
    });
    res.json(followers);
  } catch (e) {
    console.error(e);
    next(e);
  }
});


module.exports = router;