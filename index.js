require("dotenv").config();
const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const chat = require("./chat/index");

chat.init(io);

http.listen(process.env.PORT, function() {
  console.log(`listening on port ${process.env.PORT}`);
});
