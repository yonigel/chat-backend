const {
  BOT_NAME,
  LOW_QUESTION_MACH_THRESHOLD,
  HIGH_QUESTION_MACH_THRESHOLD,
  CHAT_ACTIONS,
  BAD_WORDS_ANSWERS,
  DONT_KNOW_ANSWERS,
  BAD_LANGUAGE,
  QUESTIONS_PREFIXES,
  NUMBER_OF_WORDS_THRESHOLD
} = require("./consts");

const stringSimilarity = require("string-similarity");

let questionsAnswersList = [
  {
    question: "bot, who are you?",
    answer: "I am Minion bot! HaHaHaHa!"
  }
];

let io;

function init(socket) {
  io = socket;
}

function getRandomAnswerFromList(answerList) {
  return answerList[Math.floor(Math.random() * answerList.length)];
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
    return getRandomAnswerFromList(DONT_KNOW_ANSWERS);
  }
}

function sendMessage(message) {
  if (io === undefined) {
    return;
  }
  io.emit(CHAT_ACTIONS.BotMessage, message);
}

function sendUserMessage(socket, message) {
  socket.emit(CHAT_ACTIONS.BotMessage, message);
}

function checkBadLanguage(message) {
  if (BAD_LANGUAGE.some(badWord => message.includes(badWord))) {
    io.emit(
      CHAT_ACTIONS.BotMessage,
      getRandomAnswerFromList(BAD_WORDS_ANSWERS)
    );
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
