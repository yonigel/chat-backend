const stringSimilarity = require("string-similarity");

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
  "what"
];

const BAD_LANGUAGE = ["fuck"];

let questionsAnswersList = [
  {
    question: "who are you?",
    answer: "I am Minion bot! HaHaHaHa!"
  }
];

let io;

function init(socket) {
  io = socket;
}

function isMessageQuestion(message) {
  const isMessageHaveQuestionMark = message.indexOf("?") !== -1;
  const isMessageStartWithQuestion = QUESTIONS_PREFIXES.some(question =>
    message.startsWith(question)
  );
  return isMessageHaveQuestionMark || isMessageStartWithQuestion;
}

function getEquivalentQuestion(question) {
  const numberOfWords = question.split(" ").length;
  let matchPercentageThreshold = 0;
  if (numberOfWords <= NUMBER_OF_WORDS_THRESHOLD) {
    matchPercentageThreshold = HIGH_QUESTION_MACH_THRESHOLD;
  } else {
    matchPercentageThreshold = LOW_QUESTION_MACH_THRESHOLD;
  }
  const allQuestions = questionsAnswersList.map(
    questionAnswer => questionAnswer.question
  );
  const matches = stringSimilarity.findBestMatch(question, allQuestions);

  const equivalentQuestion = matches.ratings.find(
    match => match.rating >= matchPercentageThreshold
  );

  return equivalentQuestion !== undefined
    ? questionsAnswersList.find(
        answerQuestion => answerQuestion.question === equivalentQuestion.target
      )
    : {};
}

function isQuestionExists(question) {
  const equivalentQuestion = getEquivalentQuestion(question);
  const isQuestionExists =
    equivalentQuestion !== undefined &&
    equivalentQuestion.answer !== "" &&
    equivalentQuestion.answer !== undefined;
  return isQuestionExists;
}

function getAnswerToQuestion(question) {
  const answer = getEquivalentQuestion(question).answer;
  return answer;
}

function addQuestion(message) {
  if (isMessageQuestion(message) && !isQuestionExists(message)) {
    questionsAnswersList.push({ question: message, answer: "" });
  }
}

function isQuestionWasAsked() {
  return questionsAnswersList.some(
    questionAnswer => questionAnswer.answer === ""
  );
}

function addAnswerToQuestion(answer) {
  if (isMessageQuestion(answer) || !isQuestionWasAsked()) {
    return;
  }
  const askedQuestionWithoutAnswer = questionsAnswersList.find(
    questionAnswer => questionAnswer.answer === ""
  );
  askedQuestionWithoutAnswer.answer = answer;
}

function answerToQuestion(message) {
  if (!isMessageQuestion(message)) {
    return;
  }
  if (isQuestionExists(message)) {
    return getAnswerToQuestion(message);
  } else {
    addQuestion(message);
    return "I have absolute no idea! what a stupid question.";
  }
}

function sendMessage(message) {
  if (io === undefined) {
    return;
  }
  io.emit("bot message", message);
}

function sendUserMessage(socket, message) {
  socket.emit("bot message", message);
}

function checkBadLanguage(message) {
  if (BAD_LANGUAGE.some(badWord => message.includes(badWord))) {
    io.emit("bot message", "Whatch your language! there are kids in here.");
  }
}

module.exports = {
  init,
  answerToQuestion,
  checkBadLanguage,
  addAnswerToQuestion,
  sendMessage,
  BOT_NAME,
  sendUserMessage
};
