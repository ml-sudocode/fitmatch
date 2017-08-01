// before everything else. load the .env file
// require modules
// create the app
// set up DB (location) and connect to mongoose ODM
// enable sessions functionality. connect sessions to mongoose > the database
// initialize authentication (passport), then connect to [sessions > mongoose > the database]
// set up morgan (to log http requests in the shell)
// install flash middleware
// set up body parser to handle requests
// set up methodOverride
// state the static/public directory
// set views engine
// set routes to use
// mount the app and start listening on the designated port

// load the .env file
require('dotenv').config()

// require modules
// Key modules: express sessions mongoose passport handlebars. Auxiliary: body-parser, MongoStore/connect-mongo, methodOverride, morgan. Note: passport strategies, e.g. passport-local, are required in the passport.js file, not here! Morgan only required below, after app is created
const express = require('express')
// create the app
const app = express()
const mongoose = require('mongoose')
const passport = require('passport')
const flash = require('connect-flash') ;
const exphbs = require('express-handlebars')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const session = require('express-session')
// connect the session to mongoose > the database
const MongoStore = require('connect-mongo')(session)
const methodOverride = require('method-override')

// prep mongoose
mongoose.Promise = global.Promise

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

// enable sessions functionality. connect sessions to mongoose > the database
app.use(session({
  store: new MongoStore({
    url: url
  }),
  secret: 'this is my secret salt',   // the secret that verifies that the cookie sent back by client is valid. it salts the session id that is returned (??? i think)
  resave: false,            // convention
  saveUninitialized: true   // convention
}))

// initialize authentication (passport), then connect to [sessions > mongoose > the database]
  // initialize passport
app.use(passport.initialize())
  // the line below must be AFTER the session setup
app.use(passport.session())
// [AXN] what does this do?
require('./config/passport')(passport)

  // set up morgan (to log http requests in the shell)
app.use(require('morgan')('dev'))

// install flash middleware. Flash depends on cookieParser, so have to set that up too
app.use(cookieParser());
app.use(flash());

// set up body parser to handle requests
  // requests submitted via ajax
app.use(bodyParser.json())
  // requests submitted via form submission
app.use(bodyParser.urlencoded({extended: true}))

// set up methodOverride [AXN not yet sure where and how this would be used]
// app.use(methodOverride(function(req, res) {
//   if(req.body && typeof req.body === 'object' && '_method' in req.body) {
//     var method = req.body._method;
//     delete req.body._method;
//     return method;
//   }
// }));
// alternatively, as used in brian's project: app.use(methodOverride('_method'))

// this doesn't work: "req" is not defined. How to fix it???
// app.locals = {
//   user: req.user
// }

// state the static/public directory
app.use(express.static('public'))

// set views engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main'
}))
app.set('view engine', 'handlebars')
// do i need this?
// app.set("views", __dirname + "/views");

// set routes to use
  // routes for key pages: homepage, terms & conditions page
  // impt: if i put .use instead of .get, i will end up being served the index.hbs file no matter where i navigate to!!
app.get('/', function (req, res) {
  res.render('index')
})

app.get('/termsandconditions', function (req, res){
  res.render('termsandconditions')
})
  // routes for auth and user
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/auth', authRoutes)
app.use('/user', userRoutes)

// mount the app and start listening on the designated port
const port = process.env.PORT || 5000
app.listen(port, function () {
  console.log(`express is running on port ${port}`)
})

// Create questions for the database here (i do not want to create a GUI for this yet). Note that we have to delete all qns before running this section, otherwise there will be several copies of the same question
const Question = require('./models/Question')
Question.remove({}, function () {
  console.log(`questions db cleared`)
})
const questionsAllControllers = require('./controllers/questionsAllControllers')
questionsAllControllers('What are your top 5 principles in life?', 'values')
questionsAllControllers('What are princples that you used to hold, that you have since rejected or deprioritized?', 'values')
questionsAllControllers('What makes you happy?', 'values')
questionsAllControllers('The Four Burners Theory (http://jamesclear.com/four-burners-theory) says that in order to be successful you can only have 2-3 burners on at one time: family, friends, health and work. How do you rank these? How do you think your priorities have changed over the years?', 'values')
questionsAllControllers('Who are the 5 most important people in your life? Who are the 5 people you spend most of your non-work time with?', 'values')
questionsAllControllers('The Five Love Languages are widely acknowledged to be: gift giving, quality time, words of affirmation, acts of service (devotion), and physical touch (https://en.wikipedia.org/wiki/The_Five_Love_Languages). How do you rank these? If a category is not important at all, leave it out.', 'communication')
questionsAllControllers('In your past relationships, were disagreements typically fiesty and passionate, or calm and rational? How quickly were they resolved?', 'communication')
questionsAllControllers('Do you typically expect your partner to be able to tell when you are upset, or are you quite verbal and proactive in sharing your problems?', 'communication')
questionsAllControllers('Am i free to talk to you about anything? What topics or history are offlimits?', 'communication')
questionsAllControllers('Am i doing anything now to make you feel disrespected?', 'communication')
questionsAllControllers('What are you looking for in your next relationship?', 'intentions')
questionsAllControllers('What do you think is a reasonable amount of time to date before knowing if you are compatible with someome for the long term? What are some milestones do you think you need to hit together to help determine this?', 'intentions')
questionsAllControllers('What have you learnt from your past relationships that you would like to apply or avoid in your next one?', 'intentions')
questionsAllControllers('What are your thoughts regarding marriage?', 'intentions')
questionsAllControllers('Do you intend to have children? If so, how many? If not, why? If unsure, what are your considerations/', 'intentions')
console.log(`questions are saved into DB`)
