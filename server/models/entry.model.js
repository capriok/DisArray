const mongoose = require('mongoose')

const Schema = mongoose.Schema

const entrySchema = new Schema({
  name: {
    type: String,
    trim: true
  },
  time: {
    type: String,
    trim: true
  }
})

const Entry = mongoose.model('Entry', entrySchema)

module.exports = Entry