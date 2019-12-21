const CHAT_ACTIONS = {
  UserJoined: "user join",
  UserLeft: "user left",
  ChatMessage: "chat message",
  BotMessage: "bot message",
  GotUserList: "got users list",
  Connection: "connection",
  Disconnection: "disconnect",
  GotUsername: "username"
};

const BOT_NAME = "Minion_Bot";
const LOW_QUESTION_MACH_THRESHOLD = 0.75;
const HIGH_QUESTION_MACH_THRESHOLD = 0.9;
const NUMBER_OF_WORDS_THRESHOLD = 3;
const QUESTIONS_PREFIXES = [
  "who",
  "when",
  "how",
  "is",
  "are",
  "am",
  "where",
  "what",
  "do",
  "does"
];

const BAD_LANGUAGE = ["fuck", "shit"];

const DONT_KNOW_ANSWERS = [
  "I have absolute no idea! what a stupid question.",
  "Oh crap, I have no idea! wait for someone else answer.",
  "Let me get back to you about this one...",
  "Oh jeez, I dont know"
];

const BAD_WORDS_ANSWERS = ["Watch your language! there are kids in here."];

module.exports = {
  BOT_NAME,
  LOW_QUESTION_MACH_THRESHOLD,
  HIGH_QUESTION_MACH_THRESHOLD,
  CHAT_ACTIONS,
  BAD_WORDS_ANSWERS,
  DONT_KNOW_ANSWERS,
  BAD_LANGUAGE,
  QUESTIONS_PREFIXES,
  NUMBER_OF_WORDS_THRESHOLD
};
