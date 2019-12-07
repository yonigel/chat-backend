const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const chat = require("./chat/index");

chat.init(io);

http.listen(5000, function() {
  console.log("listening on *:5000");
});
