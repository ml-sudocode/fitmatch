const express = require('express')
const router = express.Router()
const userControllers = require('../controllers/userControllers')
const Question = require('../models/Question')

router.route('/dashboard')
  .get(function (req, res) {
    res.render('user/dashboard', {
      user: req.user
    })
  })

router.route('/quiz/qna')
  .get(function (req, res) {
    Question.find({}, function (err, questionsFound){
      if (err) res.send(err)
    })
    .exec(function (err, questionsFound) {
      if (err) res.send(err)
      res.render('user/quiz/qna', {
        questions: questionsFound
      })
    })
  })
  .post(function (req, res) {
    // console.log(req.body)
    // [AXN] NEED TO FIGURE OUT HOW TO PASS THE DATA FROM CLIENT, TO THE NEXT ROUTE'S DUMMY DATA
    res.redirect('/quiz/qna/answer')
  })

  router.route('/quiz/qna/answer')
    // display the data, including textarea inputs for comment
    .get(function (req, res) {
      // [AXN] NEED TO FIGURE OUT HOW TO GET THE DUMMY DATA POPULATED WITH REAL DATA
      const questionsSelected = [{question: 'dummy qn 1', category: 'dummy category'}, {question: 'dummy qn 2', category: 'dummy category'}]
      res.render('user/quiz/answer', {
        questions: questionsSelected
      })
    })
    .post(function (req, res) {
      // ********************* RESUME HERE *********************
      // [AXN] Need to figure out how to pop the info from client to node (same problem as above)
      // Then, create a document in the DB and save it
      // And also reference the document to its owner (user)
      
      res.redirect('/user/quiz/headlines')
    })

// /quiz/headlines
  router.route('/quiz/headlines')
  // ********************* RESUME HERE *********************

// /quiz/headlines/comments
// /quiz/thankyou
// /quiz/previousresults
// /personalityinsights

module.exports = router
