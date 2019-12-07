var app = require("express")();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});

io.on("connection", function(socket) {
  let username = "";
  let userId = socket.id;

  //   io.emit("user join");

  socket.on("username", newUser => {
    console.log(`got username ${newUser}`);
    username = newUser;
    io.emit("user join", { name: newUser, id: userId });
  });

  socket.on("chat message", function(msg) {
    console.log(`got message ${msg}`);
    io.emit("chat message", { username, message: msg });
  });

  socket.on("disconnect", function() {
    console.log("user disconnected");
    io.emit("user left", { name: username, id: userId });
  });
});

http.listen(5000, function() {
  console.log("listening on *:5000");
});
