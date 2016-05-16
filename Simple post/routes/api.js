
var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');

var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

router.route('/posts')
	//creates a new post
	.post(function(req, res){

		var post = new Post();
		post.text = req.body.text;
		post.created_by = req.body.created_by;
		post.created_at = req.body.created_at;
		post.likes = req.body.likes;
		post.save(function(err, post) {
			if (err){
				return res.status(500).send(err);
			}
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		Post.find(function(err, posts){
			if(err){
				return res.status(500).send(err);
			}
			return res.json(posts);
		});
	});

router.route('/posts/:post')
	//gets specified post
	.get(function(req, res){
		return res.json(req.post);
	}) 

	//updates specified post
	.put(function(req, res){
		var post = req.post;

		post.text = req.body.text;

		post.save(function(err, post){
			if(err)
				return res.status(500).send(err);

			return res.json(post);
		
		});
	})

	//deletes the post
	.delete(function(req, res) {
		Post.remove(req.post, function(err) {
			if (err)
				return res.status(500).send(err);

			return res.json("Post deleted!");
		});
	});

//get post by id from url
router.param('post',function (req,res,next,id) {
  var query=Post.findById(id);

  query.exec(function (err, post) {
    if (err) { return next(err);}
    if(!post){return next(new Error("can't find post")); }
    req.post=post;
    return next();
  });
});

//upvote a post
router.put('/posts/:post/upvote',function(req,res){
		
	req.post.upvote(function(err,post){
		if(err){
			return res.status(500).send(err);
		}
		return res.json(post);
	});
});

//get post along with comments by id from url
router.param('postc',function (req,res,next,id){
	var query=Post.findById(id);

  	query.exec(function (err, post) {
	    if (err) { return next(err);}
	    if(!post){return next(new Error("can't find post")); }

	    post.populate('comments', function(err, post) {
		    if (err) { return next(err); }

		    req.post = post;
		    return next();
	  	});
 	});
});

//get comment by id from url
router.param('comment',function (req,res,next,id) {
  var query=Comment.findById(id);

  query.exec(function (err, comment) {
    if (err) { return next(err);}
    if(!comment){return next(new Error("can't find comment")); }
    req.comment=comment;
    return next();
  });
});

//get all comments of specified post
router.get('/posts/:postc/comments',function(req,res){

	res.json(req.post);
});

router.route('/posts/:postc/:comment')
	
	//get a comment
	.get(function(req,res){
		return res.json(req.comment);
	})

	//edit comment
	.put(function(req,res){
		var comment = req.comment;

		comment.text = req.body.text;
		var index = req.post.comments.indexOf(comment);
		req.post.comments[index].text = comment.text;

		req.post.save(function(err,post){
			if(err){
				return res.status(500).send(err);
			}

			comment.save(function(err,comment){
				if(err){
					return res.status(500).send(err);
				}

				return res.json(comment);
			});
		});
	})

	//delete comment
	.delete(function(req,res){

		var index = req.post.comments.indexOf(req.comment);
      	req.post.comments.splice(index, 1); 

      	req.post.save(function(err,post){

      		if(err){
      			return res.status(500).send(err);
      		}

      		Comment.remove(req.comment,function(err){
				if(err){
					return res.status(500).send(err);
				}
				
				return res.json("comment deleted");
			});
      	});
	});

//add a comment
router.post('/posts/:post/comment',function(req,res){
	var comment = new Comment(req.body);
	comment.post = req.post;

	comment.save(function(err, comment) {
		if (err){
			return res.status(500).send(err);
		}

		req.post.comments.push(comment);

		req.post.save(function(err,post){
			if(err){
				return res.status(500).send(err);
			}

			return res.json(comment);

		});
		
	});
});

//upvote a comment
router.put('/posts/comment/:comment/upvote',function(req,res){
	req.comment.upvote(function(err,comment){
		if(err){
			return res.status(500).send(err);
		}

		return res.json(comment);
	});
});

module.exports = router;