const bot = require("./bot");
function init(io) {
  bot.init(io);
  let userList = [];
  io.on("connection", function(socket) {
    let id = socket.id;
    const connectedUser = {};

    socket.emit("got users list", userList);
    bot.sendUserMessage(socket, "Welcome to our chat, hope you have fun!");

    socket.on("username", name => {
      if (name === "" || name === undefined) {
        return;
      }
      username = name;
      connectedUser.name = name;
      connectedUser.id = id;
      userList.push(connectedUser);
      io.emit("user join", connectedUser);

      bot.sendMessage(`user ${connectedUser.name} just connected!`);
    });

    socket.on("chat message", function(msg) {
      io.emit("chat message", { username: connectedUser.name, message: msg });
      if (connectedUser.name === "BOT_NAME") {
        return;
      }

      const botAnswer = bot.answerToQuestion(msg);
      if (botAnswer === "" || botAnswer === undefined) {
        bot.addAnswerToQuestion(msg);
        return;
      }
      io.emit("bot message", botAnswer);
    });

    socket.on("disconnect", function() {
      if (connectedUser.name === "" || connectedUser.name === undefined) {
        return;
      }
      userList = userList.filter(user => user.id !== id);
      io.emit("user left", connectedUser);
      bot.sendMessage(`user ${connectedUser.name} left`);
    });
  });
}

module.exports = { init };
