var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider
    //All posts display
    .when('/', {
      templateUrl: 'post.html',
      controller: 'myControl'
    })
    //single post display
    .when('/posts/:id',{
      templateUrl: 'comment.html',
      controller: 'postControl'
    })
    //any other url
    .otherwise({
      redirectTo : '/'
    })
    ;
});

myApp.factory('postService',function($http){
  
  var factory = {};

  factory.getAll = function(){
    return $http.get('/api/posts');
  }

  factory.addPost = function(post){
    return $http.post('/api/posts',post);
  }

  factory.upvote = function(post){
    return $http.put('/api/posts/'+post._id+'/upvote');
  }

  factory.editPost = function(post){
    return $http.put('/api/posts/'+post._id,post)
  }

  factory.delete = function(post){
    return $http.delete('/api/posts/'+post._id);
  }
  //get the post by id
  factory.get = function(id){
    return $http.get('/api/posts/'+id);
  }

  factory.getComments = function(id){
    return $http.get('/api/posts/'+id+'/comments');
  }

  factory.addComment = function(comment,id){
    return $http.post('/api/posts/'+id+'/comment',comment);
  }

  factory.editComment = function(comment){
    return $http.put('/api/posts/comment/'+comment._id,comment);
  }

  factory.upvoteComment = function(comment){
    return $http.put('/api/posts/comment/'+comment._id+'/upvote');
  }

  factory.deleteComment = function(comment,id){
    return $http.delete('/api/posts/'+id+'/'+comment._id);
  }

  return factory;
});

myApp.controller('myControl',function($scope,postService){
  
  $scope.allPost = [];
  $scope.newPost = {created_by: '', text: '', created_at: '', likes : 0, comments : []};

  postService.getAll().success(function(data){
    $scope.allPost = data;
  });

	$scope.post = function(){
    $scope.newPost.created_at = Date.now();

    postService.addPost($scope.newPost).success(function(data){
        
        $scope.allPost.push(data);
        $scope.newPost = { created_by: '', text: '', created_at: '', likes : 0, comments : []};
      
    });
  };

  	$scope.like = function(post){
      postService.upvote(post).success(function(data){
        post.likes += 1; 
      });
  	};

    $scope.delete = function(post){
      postService.delete(post).success(function(data){
        console.log(data);
        var index = $scope.allPost.indexOf(post);
        $scope.allPost.splice(index, 1); 
      });
    };
});

myApp.controller('postControl',function($scope,postService,$routeParams){

  $scope.post = { created_by: '', text: '', created_at: '', likes : 0, comments : []};
  $scope.allComments = [];

  postService.getComments($routeParams.id).then(function(res){
    $scope.post = res.data;
    $scope.allComments = $scope.post.comments;
  });

  
  $scope.newComment = {created_by: '', text: '', created_at: '', likes : 0, post : {}};


  $scope.comment = function(){
    $scope.newComment.created_at = Date.now();

    postService.addComment($scope.newComment,$routeParams.id).success(function(data){
        
      $scope.allComments.push(data);
      $scope.newComment = { created_by: '', text: '', created_at: '', likes : 0, post : {}};
      
    });
  };

  $scope.likeComment = function(comment){
    postService.upvoteComment(comment).success(function(data){
      comment.likes += 1; 
    });
  };

  $scope.likePost = function(post){
    postService.upvote(post).success(function(data){
      post.likes += 1; 
    });
  };

  $scope.delete = function(comment){
    postService.deleteComment(comment,$routeParams.id).success(function(data){
      console.log(data);
      var index = $scope.allComments.indexOf(comment);
      $scope.allComments.splice(index, 1); 
      $scope.post.comments = $scope.allComments;
    });
  };

});