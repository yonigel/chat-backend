const bot = require("./bot");
const { CHAT_ACTIONS } = require("./consts");

const BOT_NAME = "BOT_NAME";

const userList = [];
const connectedUser = {};

function onUserDisconnect(io, connectedUser, userList, socketId) {
  if (connectedUser.name === "" || connectedUser.name === undefined) {
    return;
  }
  userList = userList.filter(user => user.id !== socketId);
  io.emit(CHAT_ACTIONS.UserLeft, connectedUser);
  bot.sendMessage(`user ${connectedUser.name} left`);
}

function onNewChatMessage(io, connectedUser, message) {
  io.emit(CHAT_ACTIONS.ChatMessage, { username: connectedUser.name, message });
  bot.checkBadLanguage(message);
  // ignore messages from the bot
  if (connectedUser.name === BOT_NAME) {
    return;
  }

  const botAnswer = bot.answerToQuestion(message);
  if (botAnswer === "" || botAnswer === undefined) {
    bot.addAnswerToQuestion(message);
    return;
  }
  io.emit(CHAT_ACTIONS.BotMessage, botAnswer);
}

function onGettingUsername(io, username, socketId) {
  if (username === "" || username === undefined) {
    return;
  }
  connectedUser.name = username;
  connectedUser.id = socketId;
  userList.push(connectedUser);
  io.emit(CHAT_ACTIONS.UserJoined, connectedUser);
  bot.sendMessage(`user ${connectedUser.name} just connected!`);
}

function init(io) {
  bot.init(io);
  io.on(CHAT_ACTIONS.Connection, function(socket) {
    const socketId = socket.id;

    socket.emit(CHAT_ACTIONS.GotUserList, userList);
    bot.sendUserMessage(socket, "Welcome to our chat, hope you have fun!");

    socket.on(CHAT_ACTIONS.GotUsername, username => {
      onGettingUsername(io, username, socketId);
    });

    socket.on(CHAT_ACTIONS.ChatMessage, function(message) {
      onNewChatMessage(io, connectedUser, message);
    });

    socket.on(CHAT_ACTIONS.Disconnection, function() {
      onUserDisconnect(io, connectedUser, userList, socketId);
    });
  });
}

module.exports = { init };
