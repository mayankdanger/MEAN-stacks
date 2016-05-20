var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');


require('./model/Post');
require('./model/Comment');
var index = require('./routes/index');
var api = require('./routes/api');

var app = express();
var router = express.Router();


mongoose.connect('mongodb://localhost/posts');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api', api);

app.listen(3000,function(){
	console.log('Server Started at port 3000');
});

module.exports = app;