const express = require('express')
const router = express.Router()
const Question = require('../models/Question')
const Qna = require('../models/Qna')
const userControllers = require('../controllers/userControllers')

router.route('/dashboard')
  .get(function (req, res) {
    res.render('user/dashboard', {
      user: req.user,
      // to avoid having to write the below for all my routes, i could go to app.js and write app.locals.flash... this writes the flash info into Sessions documents. See Placies repo? He couldn't get it to configure properly for me, so we just do it the longwinded way here
      info: req.flash('info'),
      error: req.flash('errorMessage')
    })
  })

router.route('/quiz/qna')
  .get(function (req, res) {
    Question.find({}, function (err, questionsFound) {
      if (err) res.send(err)
    })
    .exec(function (err, questionsFound) {
      if (err) res.send(err)
      res.render('user/quiz/qna', {
        user: req.user,           // this passes user to main.hbs, so that the right nav menu is shown
        questions: questionsFound
      })
    })
  })
  .post(function (req, res) {
    // This is how you PASS THE DATA FROM CLIENT, TO THE NEXT ROUTE'S DUMMY DATA: using form submit and writing to req.session
    // return res.send(req.body)
    req.session.categories = req.body.categories       // you can save objects into the req.session object!!!
    req.session.questions = req.body.questions
    req.session.qnIds = req.body.qnIds
    res.redirect('/user/quiz/qna/answer')
  })

router.route('/quiz/qna/answer')
    // display the data, including textarea inputs for comment
    .get(function (req, res) {
      const categories = req.session.categories
      const questionsSelected = req.session.questions
      const qnIds = req.session.qnIds
      res.render('user/quiz/answer', {
        user: req.user,
        questions: questionsSelected
        // categories: categories,
        // qnIds: qnIds
      })
    })
    .post(function (req, res) {
      // ********************* RESUME HERE *********************
      // Need to figure out how to pop the info from client to node (same problem as above) [resolved]
      // However answer has to be slightly different, as you want to save the page info into the DB permanently (vs just in the ephemeral sessions) - in this case, instead of req.sessions.questions = req.body.questions, we create a new document from the Qna model, and insert req.body into the properties of the document
      // res.send(req.body)
      // Also, reference the document to its owner (user)!
      const qna = new Qna({
        questions: req.body.questions,
        answers: req.body.answers,
        user: req.user._id
      })
      // console.log(qna)
      // // Then, create a document in the DB and save it
      qna.save(function (err, newQna) {
      if (err) { return res.send(err) }
      })
      // res.redirect('/user/quiz/headlines'), with a flash showing that the Q&A data was saved. The flash message must be defined before the redirect; req.flash is then assigned to a keyword in the res.render function after the redirect (see router.route('/quiz/headlines')). Finally, don't forget to add <p> {{ info }} </p> in the handlebars file that is rendered upon redirect.

      req.flash('info', 'Thank you! Your answers are saved')
      res.redirect('/user/quiz/headlines')
    })

// /quiz/headlines
router.route('/quiz/headlines')
  .get(userControllers.showHeadlines)
  // .post
  // ******************* RESUME HERE *******************

// /quiz/headlines/comments
// /quiz/thankyou
// /quiz/previousresults
// /personalityinsights

module.exports = router
