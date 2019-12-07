const questionPrefixes = ["who", "when", "how", "is", "are", "where"];

let questionsAnswersList = [
  {
    question: "who are you?",
    answer: "I am Minion bot! HaHaHaHa!"
  }
];

function isMessageQuestion(message) {
  const isMessageHaveQuestionMark = message.indexOf("?") !== -1;
  const isMessageStartWithQuestion = questionPrefixes.some(question =>
    message.startsWith(question)
  );
  return isMessageHaveQuestionMark || isMessageStartWithQuestion;
}

function isQuestionExists(message) {
  return questionsAnswersList.some(
    questionAnswer => questionAnswer.question === message
  );
}

function isAnswerExists(message) {
  return questionsAnswersList.some(
    questionAnswer => questionAnswer.answer === message
  );
}

function addQuestion(message) {
  if (isMessageQuestion(message) && !isQuestionExists(message)) {
    questionsAnswersList.push({ question: message, answer: "" });
  }
}

function addAnswer(message) {
  if (isMessageQuestion(message) && !isAnswerExists(message)) {
    return;
  }
}

function answerToQuestion(message) {
  if (!isMessageQuestion(message)) {
    return;
  }
  if (isQuestionExists(message)) {
    return "I know this one...";
  } else {
    return "I have absolute no idea!";
  }
}

module.exports = {
  answerToQuestion
};
