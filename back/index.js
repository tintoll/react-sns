const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');

// passport 사용하는 이유는 프론트랑 서버쪽에 세션 실제로 맞는지 체크해주는 역할을 한다. 
const passport = require('passport');
const passportConfig = require('./passport');

const db = require('./models');
const userAPIRouter = require('./routes/user');
const postAPIRouter = require('./routes/post');
const postsAPIRouter = require('./routes/posts');

dotenv.config();
const app = express();
db.sequelize.sync();
passportConfig();

app.use(morgan('dev'));
// json 처리 
app.use(express.json());
// form 관련 처리 
app.use(express.urlencoded({extended : true}));

// 프론트 서버에서 호출할수 있도록 설정
app.use(cors({
  origin : true,
  credentials : true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  resave : false,
  saveUninitialized : false,
  secret : process.env.COOKIE_SECRET,
  cookie : {
    // httpOnly를 해주면 javascript에서 쿠키접근을 할수없다.
    httpOnly : true,
    secure : false, // https 사용시 
  },
  name : 're_sns_c' // 안주면 쿠키이름이 connect.id 로 들어감 
}));

// expressSession 밑에 와야한다 passport.session()이 expressSession를 사용하기 때문에 
app.use(passport.initialize());
app.use(passport.session());


// API는 다른 서비스가 내 서비스의 기능을 실행할 수 있게 열어둔 창구
app.use('/api/user', userAPIRouter);
app.use('/api/post', postAPIRouter);
app.use('/api/posts', postsAPIRouter);

app.listen(3065, () => {
  console.log('server is running on http://localhost:3065');
});