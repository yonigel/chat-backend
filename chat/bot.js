const BOT_NAME = "Minion_Bot";
const QUESTIONS_PREFIXES = ["who", "when", "how", "is", "are", "where"];

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

function isQuestionExists(message) {
  return questionsAnswersList.some(
    questionAnswer => questionAnswer.question === message
  );
}

function getAnswerToQuestion(question) {
  return questionsAnswersList.find(
    questionAnswer =>
      questionAnswer.question === question && questionAnswer.answer !== ""
  ).answer;
}

function addQuestion(message) {
  console.log(`addQuestion`, message);
  if (isMessageQuestion(message) && !isQuestionExists(message)) {
    console.log(`adding`);
    questionsAnswersList.push({ question: message, answer: "" });
  }
}

function isQuestionWasAsked() {
  console.log(`is asked`, questionsAnswersList);
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

module.exports = {
  init,
  answerToQuestion,
  addAnswerToQuestion,
  sendMessage,
  BOT_NAME
};
