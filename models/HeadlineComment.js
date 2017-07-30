// require the modules that allow me to create a schema and generate the model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create Schema
const headlineCommentSchema = new Schema({
  headlines: [{
    type: String
  }],
  comments: [{
    type: String
  }]
})

// create Model
const HeadlineComment = mongoose.model('HeadlineComment',  headlineCommentSchema)

// export Model
module.exports = HeadlineComment
