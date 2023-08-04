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
