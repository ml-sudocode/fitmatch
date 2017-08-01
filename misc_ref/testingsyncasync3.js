
var calories = []

burger('req', 'res')

function burger (req, res) {
  // lettuce (req, res, function() {
  //   meat (req, res)
  // })

  calories = meat(req, res)           // assigning a variable to the result of an async function does NOT make it synchronouse =(
  console.log(`calories is ${calories}`)
  calories = lettuce(req, res)
  calories.push('burger')
  console.log(calories)
}

function meat (req, res) {
  // calories.push('meat')
  // console.log(calories)
  // return calories
  setTimeout(function () {
    calories.push('meat')
    console.log(calories)
    return calories
  }, 3000)
}

function lettuce (req, res) {
  // callback()
  calories.push('lettuce')
  console.log(calories)
  return calories
}
