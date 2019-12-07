const bot = require("./bot");
function init(io) {
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
    });

    socket.on("chat message", function(msg) {
      io.emit("chat message", { username: connectedUser.name, message: msg });
      const botAnswer = bot.answerToQuestion(msg);
      if (botAnswer === "" || botAnswer === undefined) {
        return;
      }
      io.emit("bot message", botAnswer);
    });

    socket.on("disconnect", function() {
      userList = userList.filter(user => user.id !== id);
      io.emit("user left", connectedUser);
    });
  });
}

module.exports = { init };
