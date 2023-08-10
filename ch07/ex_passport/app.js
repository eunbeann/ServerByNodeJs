const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const Localstrategy = require("passport-local").Strategy;

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
  // Localstrategy 인스턴스 생성
  new Localstrategy(function (username, password, done) {
    // 콜백 함수로 사용자가 등록한 username, password 검사
    if (username === fakeUser.username) {
      // fakeUser값과 동일한지 처리
      if (password === fakeUser.username) {
        // done(오류 여부, 결과 값, 실패했을 경우 실패 정보)
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
  // 로그인 되어 있지 않으면 로그인 화면 index.html 보여주기
  if (!req.user) {
    res.sendFile(__dirname + "/index.html");
    // 로그인 되어있다면 req.user에서 username을 user 변수에 넣고 사용자의 이름과 환영 메시지 그리고 로그아웃 버튼을 응답으로 보내주기
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

// passport Login : strategy-Local
// Authenticate Request
app.post(
  "/login",
  //passport.authenticate() 함수로 local 전략 쓴다고 첫 번째 인자로 알려줌
  // 로그인 실패했을 경우 "/login" 라우터로 이동
  passport.authenticate("local", { failureRedirect: "/" }),
  function (req, res) {
    // 로그인 성공시 res.sne()로 로그인 성공 메시지 띄워주기
    res.send("Login success...!");
  }
);

app.get("/logout", function (req, res) {
  // 로그아웃은 passport가 알아서 Req 객체에 logout() 메서드를 넣어주어 간단한 구현 가능
  req.logout();
  // req.session에 담긴 사용자의 정보를 삭제하고 다시 '/' 루트 페이지로 리다이렉트하게 됨.
  res.redirect("/");
});

// 404 오류 처리
app.use((req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== "development" ? err : {};
  res.status(err.status || 500);
  res.send("error Occurred");
});

// 서버와 포트 연결
app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 서버 실행 중...");
});
