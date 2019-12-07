const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// TODO - delete
app.get("/", function(req, res) {
  res.send("<h1>Hello world</h1>");
});
let userList = [];
io.on("connection", function(socket) {
  let id = socket.id;
  const connectedUser = {};

  socket.emit("got users list", userList);

  socket.on("username", name => {
    if (name === "" || name === undefined) {
      return;
    }

    username = name;
    connectedUser.name = name;
    connectedUser.id = id;
    userList.push(connectedUser);
    io.emit("user join", connectedUser);
    // socket.emit("got users list", userList);
    console.log(`sending userList`, userList);
  });

  socket.on("chat message", function(msg) {
    io.emit("chat message", { username: connectedUser.name, message: msg });
  });

  socket.on("disconnect", function() {
    console.log(`user left:`, connectedUser);
    userList = userList.filter(user => user.id !== id);
    io.emit("user left", connectedUser);
    console.log(`users list`, userList);
  });
});

http.listen(5000, function() {
  console.log("listening on *:5000");
});
