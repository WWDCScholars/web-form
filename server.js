/*
//Uncomment this if you want to run this locally, and add a .env file.
var dotenv = require('dotenv');
dotenv.load();
*/

var express = require('express');
var mongoose = require('mongoose');

var bodyParser = require('body-parser');

//views
var ejs = require('ejs');
var ejsMate = require('ejs-mate');

//models library
var Scholar = require('./models/scholars');

var app = express();

//connect to mongoose
mongoose.connect(process.env.DB_URL_LOCAL, function(err){
	if (err) {
		console.log(err);
	} else {
		console.log("Connected to our database");
	}
});

//middleware
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//views
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');

//settings
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST);

//routes
var mainRoute = require('./routes/main');
app.use(mainRoute);

var addPostRoute = require('./routes/addpostform');
app.use(addPostRoute);

var addScholarRoute = require('./routes/addscholarform');
app.use(addScholarRoute);

var PORT = app.get('port');

app.listen(PORT, function(err) {
	if (err) throw err;
	console.log("Server Running at port " + PORT);
});