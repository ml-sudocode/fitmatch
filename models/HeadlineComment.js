// require the modules that allow me to create a schema and generate the model
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// create Schema
const headlineCommentSchema = new Schema({
  titles: [{
    type: String
  }],
  descriptions: [{
    type: String
  }],
  urls: [{
    type: String
  }],
  publishedDates: [{
    type: String
  }],
  imgUrls: [{
    type: String
  }],
  comments: [{
    type: String
  }],
  // user: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User'},
  user: {
    type: String
  }
})

// create Model
const HeadlineComment = mongoose.model('HeadlineComment',  headlineCommentSchema)

// export Model
module.exports = HeadlineComment
