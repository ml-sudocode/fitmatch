// require the modules that allow me to create a schema and generate the model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create Schema
const questionSchema = new Schema({
  question: String,
  category: {
    type: String,
    enum: ['values', 'communication', 'intentions']}
})

// create model
const Question = mongoose.model('Question', questionSchema)

// export model
module.exports = Question
