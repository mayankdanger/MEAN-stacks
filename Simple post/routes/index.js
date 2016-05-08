
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
	res.render('index', { title: "post"});
});

var mongoose = require('mongoose');

var Post = mongoose.model('Post');

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
				console.log("err1 : "+err);
				return res.status(500).send(err);
			}
			console.log("post1 : "+post);
			return res.json(post);
		});
	})
	//gets all posts
	.get(function(req, res){
		Post.find(function(err, posts){
			if(err){
				console.log("err2 : "+err);
				return res.status(500).send(err);
			}
			console.log("posts2 : "+posts);
			return res.status(500).send(posts);
		});
	});

router.route('/posts/:id')
	//gets specified post
	.get(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);
			res.json(post);
		});
	}) 
	//updates specified post
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.created_by = req.body.created_by;
			post.text = req.body.text;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})
	//deletes the post
	.delete(function(req, res) {
		Post.remove({
			_id: req.params.id
		}, function(err) {
			if (err)
				res.send(err);
			res.json("deleted :(");
		});
	});
	
module.exports = router;