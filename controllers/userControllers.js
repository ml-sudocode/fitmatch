// const request = require('request')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
// const passport = require('passport')
const Qna = require('../models/Qna')
const HeadlineComment = require('../models/HeadlineComment')
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3')

const username = process.env.IBMWDC_USERNAME
const password = process.env.IBMWDC_PASSWORD

// Note: usually try not to create global variables, but this is necessary to avoid async issues in the series of functions
// sampleText needs to be an array of objects, with each object containing a key:value pair named "content": [{content: xxx}, {content: xxx}, {content: xxx}].
const sampleText = []

function showHeadlines (req, res) {
  // const headlines = makeApiCall()
  const headlines = makeApiCall()
  // console.log('headline supposed to show')
  // console.log(`these is headlines in showHeadlines: ${headlines}`)
  // return res.send(headlines)
  res.render('user/quiz/headlines', {
    user: req.user,
    headlines: headlines,
    info: req.flash('info'),
    errors: req.flash('errorMessage')
  })
  // console.log(`req.user is ${req.user}`)
}

function makeApiCall () {
  // const url = process.env.NEWS_API_URL
  const url = process.env.NEWS_API_URL_BASE + '&apiKey=' + process.env.NEWS_API_KEY
  console.log(url)

  // using the request package didn't seem to work for me, so i went to xmlhttprequest
  // const headlines = request(url, function (err, res, body) {
  //   if (err) throw err
  //   // need to parse the body returned, because it is in JSON form. Need to parse to javascript object, e.g. remove the extraneous ' " '
  //   const bodyAsJSObject = JSON.parse(body)
  //   // console.log(bodyAsJSObject)
  //   const headlinesss = bodyAsJSObject.articles
  //   console.log(`these is headlines in makeApiCall: ${headlinesss}`)
  //   return headlinesss
  // })
  // return headlines

  const req = new XMLHttpRequest()
  req.open('GET', url, false)
  req.send(null)
  // console.log(`req.status is: ${req.status}`)
  // console.log(JSON.parse(req.responseText))
  const responseTextAsJSObject = JSON.parse(req.responseText)
  const headlines = responseTextAsJSObject.articles
    // console.log(`headlines is: ${headlines}`)
  return headlines
}

function saveHeadlineComments (req, res) {
  // get data from the form submit and save into the database
  const headlineComment = new HeadlineComment({
    titles: req.body.titles,
    descriptions: req.body.descriptions,
    urls: req.body.urls,
    publishedDates: req.body.publishedDates,
    imgUrls: req.body.imgUrls,
    comments: req.body.comments,
    user: req.user._id
  })
  // console.log('CREATED new HeadlineComment document')

  headlineComment.save(function (err, headlineComment) {
    if (err) { return res.send(err) }
  })
  // console.log('SAVED new HeadlineComment document')
  req.flash('info', 'Your headline comments are saved!')
  res.redirect('/user/thankyou')
}

// ************* THIS IS HOW I AVOID ASYNC ISSUES POTENTIALLY INTERRUPTING THE POPULATION OF SAMPLETEXT!
function prepareData (req, res, getQnaData) {
  // getQnaData(req, res)
  // console.log(`sampleText after getQnaData (shd have 1 object): ${sampleText}`)
  // console.log(sampleText)
  // getHeadlineData(req, res)
  // console.log(`sampleText after getQnaData (shd have 2 objects): ${sampleText}`)
  // console.log(sampleText)
  getQnaData(req, res)
}

function getQnaData (req, res, getHeadlineData) {
  // get user's qna documents and populate the array
  Qna.find({ 'user': req.user._id }, function (err, foundQnaDocs) {
  // if (err) throw err
    if (err) res.send(err)
    // console.log(foundQnaDocs.length)
    // console.log(foundQnaDocs[0].answers)
    for (var i = 0; i < foundQnaDocs.length; i++) {
      const contentObj = {}
      // need .join(' ') because answers is an array of strings. We want just one string.
      contentObj.content = foundQnaDocs[i].answers.join(' ')
      sampleText.push(contentObj)
      console.log(`sampleText inside the .find method in getQnaData: ${sampleText}`)
      console.log(sampleText)
    }
    getHeadlineData(req, res)
  // console.log(sampleText)
  })
}

function getHeadlineData (req, res) {
  HeadlineComment.find({ 'user': req.user._id }, function (err, foundHeadlineDocs) {
    // if (err) throw err
    if (err) res.send(err)
    for (var i = 0; i < foundHeadlineDocs.length; i++) {
      const contentObj = {}
      contentObj.content = foundHeadlineDocs[i].comments.join(' ')
      sampleText.push(contentObj)
      console.log(`sampleText inside the .find method in getHeadlineData: ${sampleText}`)
      console.log(sampleText)
    }
    // console.log(sampleText)
    getPersonalityInsights(req, res)
  })
}

function getPersonalityInsights (req, res) {
  // prepareData(req, res)
  // console.log(`sampleText after prepareData: ${sampleText}`)
  // console.log(sampleText)

  const personality_insights = new PersonalityInsightsV3({
    username: username,
    password: password,
    version_date: '2017-04-10',
    headers: {
      'X-Watson-Learning-Opt-Out': 'true'
    }
  })

  const params = {
    // Get the content items from the JSON file.
    // content_items: require('./misc_ref/profile.json').contentItems,
    content_items: sampleText,
    consumption_preferences: true,
    raw_scores: true,
    headers: {
      'accept-language': 'en',
      'accept': 'application/json'
    }
  }

  // comment this out to avoid an additional API call during testing
  // personality_insights.profile(params, function(error, response) {
  //   if (error)
  //     console.log('Error:', error);
  //   // else
  //     // console.log(JSON.stringify(response, null, 2));
  //     // const rawResults = JSON.stringify(response, null, 2)
  //     // res.send(rawResults)
  //     const rawResults = JSON.stringify(response, null, 2)
  //     console.log(`These are the results: ${rawResults}`)
  //   })

  res.render('user/personalityinsights', {
    user: req.user
    // pi_results: rawResults
  })
}

    // The note below no longer applies because i have moved this function out of the getPersonalityInsights function. So the failure does not happen
    // THIS IS FAILING (sampleText is empty) BECAUSE .FIND IS AN ASYCHRONOUS FUNCTION, WHICH MEANS THAT SHELL GOT TO THIS LINE, BEFORE THE ASYNC FUNCTION COULD MODIFY sampleText. Need to put this console.log of sampleText INSIDE the async function's callback function (added above)
    // console.log(`This is the sampleText (should be an array of objects, each with only one key:value pair named content): ${sampleText}. This is the end of the test sentence.`)

// export
module.exports = {
  showHeadlines,
  saveHeadlineComments,
  getPersonalityInsights,
  prepareData
}
