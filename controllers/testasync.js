// note: to have access to the dotenv package, i need to run "node testasync.js" FROM THE SAME FOLDER AS NODE_MODULES!!!
require('dotenv').config()
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

// prep mongoose
mongoose.Promise = global.Promise
console.log('mongodb_uri', process.env.MONGODB_URI)

// set up DB (location) and connect to mongoose ODM
const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/project-2'
mongoose.connect(url, {
  useMongoClient: true
}).then(
  function () { // this is the resolve callback
    console.log(`connected successfully to mongodb at server location ${url}`)
  },
  function (err) { // this is the error callback
    console.log(`connection error: ${err}`)
  }
)

const async = require('async')
const Qna = require('../models/Qna')
const HeadlineComment = require('../models/HeadlineComment')

// example code

// async.parallel([
//     function(callback) {
//         setTimeout(function() {
//             callback(null, 'one');
//         }, 200);
//     },
//     function(callback) {
//         setTimeout(function() {
//             callback(null, 'two');
//         }, 100);
//     }
// ],
// // optional callback
// function(err, results) {
//     // the results array will equal ['one','two'] even though
//     // the second function had a shorter timeout.
// });
//
// // an example using an object instead of an array
// async.parallel({
//     one: function(callback) {
//         setTimeout(function() {
//             callback(null, 1);
//         }, 200);
//     },
//     two: function(callback) {
//         setTimeout(function() {
//             callback(null, 2);
//         }, 100);
//     }
// }, function(err, results) {
//     // results is now equals to: {one: 1, two: 2}
// });

// define two functions executing model.find
// insert into parallel method
// inspect the results of the parallel method

function getQnaAnswers (callback) {
  Qna.find({ 'user': '5980be77a894e890f4563370' }, function (err, foundQnaDocs) {
    if (err) throw err
    // if (err) res.send(err)
    let contentArrQna = []
    for (var i = 0; i < foundQnaDocs.length; i++) {
      const contentObj = {}
      // need .join(' ') because answers is an array of strings. We want just one string.
      contentObj.content = foundQnaDocs[i].answers.join(' ')
      contentArrQna.push(contentObj)
      // console.log('hi from getQnaAnswers, inside iterator')
    }
    // console.log('hi from getQnaAnswers, inside .find')
    callback(null, contentArrQna)
  })
}

function getHeadlineComments (callback) {
  HeadlineComment.find({ 'user': '5980be77a894e890f4563370' }, function (err, foundHeadlineDocs) {
    if (err) throw err
    // if (err) res.send(err)
    let contentArrHeadline = []
    for (var i = 0; i < foundHeadlineDocs.length; i++) {
      const contentObj = {}
      contentObj.content = foundHeadlineDocs[i].comments.join(' ')
      contentArrHeadline.push(contentObj)
    }
    // console.log('hi from getHeadlineComments')
    callback(null, contentArrHeadline)
  })
}

async.parallel([ getQnaAnswers, getHeadlineComments ], function (err, results) {
  let contentArr = results[0].concat(results[1])
  // console.log(contentArr)
})
