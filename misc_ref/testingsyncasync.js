
const calories = []

burger('req', 'res')

function burger (req, res) {
  lettuce (req, res)
  calories.push('burger')
  console.log(calories)
}


function lettuce (req, res) {
  meat(req, res)
  calories.push('lettuce')
  console.log(calories)
}


function meat (req, res) {
  setTimeout(function () {
    calories.push('meat')
    console.log(calories)
  }, 3000)
}
