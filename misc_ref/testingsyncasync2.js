
const calories = []

burger('req', 'res')

function burger (req, res) {
  lettuce (req, res)
  meat (req, res)
  calories.push('burger')
  console.log(calories)
}


function lettuce (req, res) {
  // calories.push('lettuce')
  // console.log(calories)
  setTimeout(function () {
    calories.push('lettuce')
    console.log(calories)
  }, 3000)
}


function meat (req, res) {
  calories.push('meat')
  console.log(calories)
}
