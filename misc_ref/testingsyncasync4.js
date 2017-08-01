const async = require('async')
// import series from 'async/series'
const calories = []

assemble('req', 'res')

// function assemble (req, res) {
//   async.series([lettuce(req, res), meat(req, res), burger(req, res)])
// }


function assemble (req, res) {
  async.series([function (req, res) {
    calories.push('lettuce')
    console.log(calories)
  }, function (req, res) {
    calories.push('meat')
    console.log(calories)
  }, function (req, res) {
    calories.push('burger')
    console.log(calories)
  } ])
}

// function burger (req, res) {
//   // lettuce (req, res)
//   // meat (req, res)
//   calories.push('burger')
//   console.log(calories)
// }
//
//
// function lettuce (req, res) {
//   calories.push('lettuce')
//   console.log(calories)
//   // setTimeout(function () {
//   //   calories.push('lettuce')
//   //   console.log(calories)
//   // }, 3000)
// }
//
//
// function meat (req, res) {
//   calories.push('meat')
//   console.log(calories)
// }
