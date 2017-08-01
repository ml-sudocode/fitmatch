// const request = require('request')
const XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest
const HeadlineComment = require('../models/HeadlineComment')

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
}

function makeApiCall () {
  const url = process.env.NEWS_API_URL

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

// export
module.exports = {
  showHeadlines,
  saveHeadlineComments
}
