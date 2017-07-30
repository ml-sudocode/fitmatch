const Question = require('../models/Question')

function createQn (question, category) {
  var newQn = new Question({
    question: question,
    category: category
  })
  newQn.save(function (err, newQn) {
  })
}

module.exports = createQn
