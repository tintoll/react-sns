// passport는 전략이라는 개념을 사용한다.
const passport = require('passport');
const { Strategy : LocalStrategy } = require('passport-local');
const bcrypt = require('bcrypt');
const db = require('../models');

module.exports = () => {
  passport.use(new LocalStrategy({
    usernameField : 'userId', // 프론트에서 요청할때 req.body의 아이디에 해당하는 부분 
    passwordField : 'password' // 프론트에서 요청할때 req.body의 패스워드에 해당하는 부분
  }, async (userId, password, done) => {
    // 로그인 전략 부분
    try {
      const user = await db.User.findOne({where : {userId} });
      if(!user) {
        // 첫번째 서버쪽 에러
        // 두번째는 성공했을때 
        // 세번째는 실패 이유를 작성 
        return done(null, false, {reason : '존재하지 않는 사용자 입니다.'});
      }

      const result = await bcrypt.compare(password, user.password);
      if(result) {
        return done(null, user);
      }

      return done(null, false, {reason : '비밀번호가 틀립니다.'})
    } catch(e) {
      console.log(e);
      return done(e);
    }
  }));
}