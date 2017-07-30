// need to require passport to use passport.authenticate
const passport = require('passport')

// GET /login
function getLogin(req, res) {
  // i deleted this from the below line because i dont see where it comes from / what it does: ", { message: req.flash('errorMessage') }". As copied from passport-ref repo
  res.render('auth/login')
}

// POST /login
// this inserts the req and res objects into a function, which authenticates against a strategy that is defined in passport.js. If there is any error, the page will be redirected to the paths specified below, with the flash messages specified in passport.js. If there is no error, the user is returned, and [a session document will be created for the user]
function postLogin(req, res) {
  const loginStrategy = passport.authenticate('local-login', {
    successRedirect: "/user/dashboard",
    // if i put "auth/login" here, error: "Cannot GET /auth/auth/login"
    failureRedirect: "/auth/login",
    // I DIDN'T get a flash message... how is this supposed to work? [???]
    failureFlash: true
  })
  return loginStrategy(req, res)
}

// GET /signup
function getSignup(req, res) {
  res.render('auth/signup')
}

// POST /signup
// this inserts the req and res objects into a function, which authenticates against a strategy that is defined in passport.js. If there is any error, the page will be redirected to the paths specified below, with the flash messages specified in passport.js. If there is no error, the user is returned, and [a session document will be created for the user]
function postSignup(req, res) {
  const signupStrategy = passport.authenticate('local-signup', {
    successRedirect: "/user/dashboard",
    failureRedirect: "/auth/signup",
    failureFlash: true
  })
  return signupStrategy(req, res)
}

// export
module.exports = {
  getLogin,
  postLogin,
  getSignup,
  postSignup
}
