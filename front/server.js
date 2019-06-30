const express = require('express');
const next = require('next');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const dev = process.env.NODE_ENV !== 'production';
const prod = process.env.NODE_ENV === 'production';

// next + express 작업 
const app = next({ dev });
const handle = app.getRequestHandler();
dotenv.config();

app.prepare().then(() => {
  // express 작업 소스부분 
  const server = express();

  server.use(morgan('dev'));
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(cookieParser(process.env.COOKIE_SECRET));
  server.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }));

  // /hashtag/태그 요청을 express 에서 받아서 next로 넘겨준다. 
  server.get('/hashtag/:tag', (req, res) =>{
    return app.render(req, res, '/hashtag', { tag : req.params.tag});
  });
  // /user/id 요청을 express 에서 받아서 next로 넘겨준다. 
  server.get('/user/:id', (req, res) =>{
    return app.render(req, res, '/user', {id : req.params.id})
  });

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3060, () => {
    console.log('next+express running on port 3060');
  });
});