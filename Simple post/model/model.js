var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  created_at: String,
  created_by: String,
  text: String,
  likes: Number
});

mongoose.model('Post', postSchema);