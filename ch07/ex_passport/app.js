const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const Localstrategy = require("passport-local").strategy;

const app = express();

//포트 설정
app.set("port", process.env.PORT || 8080);

// 가상 데이터
let fakeUser = {
  username: "test@test.com",
  password: "test@1234",
};

// 공통 미들웨어
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("passportExample"));
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "passportExample",
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);

// passport 미들 웨어

app.use(passport.initialize()); //passport 초기화
app.use(passport.session()); // passport session 전용

// 세션 처리  = 로그인에 성공했을 경우 딱 한 번 호출되어 사용자의 식별자를 session에 저장
passport.deserializeUser(function (id, done) {
  console.log("deserializeUser", id);
  done(null, fakeUser); //req.user에 전달
});

passport.use(
  new Localstrategy(function (username, password, done) {
    if (username === fakeUser.username) {
      if (password === fakeUser.username) {
        return done(null, fakeUser);
      } else {
        return done(null, false, { message: "password incorrect" });
      }
    } else {
      return done(null, false, { message: " username incorrect" });
    }
  })
);

// 라우터 설정
app.get("/", (req, res) => {
  if (!req.user) {
    res.sendFile(__dirname + "/index.html");
  } else {
    const user = req.user.username;
    const html = `
    <!DOCTYPE html>
    <html lang = "ko">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title> Document </title>
    </head>
    <body>
      <p>${user}님 안녕하세요! </P>
      <button type="button" onclick="location.href='/logout'">
      Log Out </button>
    </body>
    </html>
    `;
    res.send(html);
  }
});
