const passport = require('passport');
const db = require('../models');
const local = require('./local');

module.exports = () => {
  // 로그인을 하면 서버에 배열로 정보를 저장하고 cookie 정보를 프론트로 보낸다.
  // 프론트에서 cookie정보를 서버에 보내면 
  // 배열에서 cookie값을 확인후 id를 찾아주는 역할을 한다.
  passport.serializeUser( (user, done) => { // 서버쪽에 [{id:3, cookie:'adddff' }]
    return done(null, user.id);
  });

  // serializeUser에서 찾은 id를 가지고 user정보를 조회하여준다. 
  // 그리고 req.user에 저장하여 준다. 
  passport.deserializeUser( async (id, done) => {
    try {
      const user = await db.User.findOne({
        where : {
          id : id
        }
      });
      return done(null, user); // req.user
    } catch(e) {
      console.log(e);
      return done(e);
    }
  });

  local();

}

// 프론트에서 cookie를 보냄
// 서버에서 쿠키파서, 익스프레스세션으로 쿠키검사하여 id : 3을 발견
// id : 3이 deserializeUser로 들어감 
// 그 다음 req.user에 저장

// 요청 보낼때 마다 deserializeUser를 실행 (db 요청 1번씩)
// 실무에서는 deserializeUser 결과물을 캐싱하여 사용 
