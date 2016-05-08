var myApp = angular.module('myApp',['ngRoute']);

myApp.config(function($routeProvider){
  $routeProvider
    //the post display
    .when('/', {
      templateUrl: 'post.html',
      controller: 'myControl'
    });
});

myApp.factory('postService',function($http){
  var factory = {};
  factory.getAll = function(){
    return $http.get('/posts');
  }

  factory.addPost = function(post){
    return $http.post('/posts',post);
  }
  return factory;
});

myApp.controller('myControl',function($scope,postService){
  
  $scope.allPost = [];
  $scope.newPost = {created_by: '', text: '', created_at: '', likes : 0};

  postService.getAll().success(function(data){
    $scope.allPost = data;
  });

	$scope.post = function(){
    $scope.newPost.created_at = Date.now();

    postService.addPost($scope.newPost).success(function(data){
        
        $scope.allPost.push(data);
        $scope.newPost = { created_by: '', text: '', created_at: '', likes : 0};
      
    });
  };

  	$scope.like = function(post){
  		post.likes += 1; 
  	};
});