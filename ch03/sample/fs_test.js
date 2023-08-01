const http = require("http");

const fs = require("fs").promises;

http
  .createServer(async (req, res) => {
    try {
      const f = await fs.readFile("./fs_test.html");
      res.writeHead(200, { "Content-Type": "text.html; charset=utf-8" });
    } catch (error) {
      console.log(err);
      res.writeHead(500, { "Content-Type": " text.html; charset=utf-8 " });
      // 500이면 서버 오류 발생
      res.end(err.message); // 오류 메시지와 함게 요청 종료
    }
  })
  .listen(8080, () => {
    console.log("8080 포트에서 연결 중 ..");
  });
