// require the modules that allow me to create a schema and generate the model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create Schema
const qnaSchema = new Schema({
  questions: [{
    type: String
  }],
  answers: [{
    type: String
  }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'}
})

// create Model
const Qna = mongoose.model('Qna',  qnaSchema)

// export Model
module.exports = Qna
