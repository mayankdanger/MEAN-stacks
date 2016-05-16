var mongoose = require('mongoose');

var postSchema = mongoose.Schema({
  created_at: String,
  created_by: String,
  text: String,
  likes: {type: Number, default: 0},
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

postSchema.methods.upvote = function(post){
	this.likes += 1;
	this.save(post);
};

mongoose.model('Post', postSchema);