var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
  text: String,
  created_by: String,
  created_at: String,
  likes: {type: Number, default: 0},
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb){
	this.likes += 1;
	this.save(cb);
}
mongoose.model('Comment', CommentSchema);