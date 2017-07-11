//setting up everything
var config = {
	region: "us-east-2",
	accessKeyId: "AKIAI2FRIJ2MDJGVS43Q",
	secretAccessKey: "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"
};
var AWS = require('aws-sdk');
	AWS.config.update({
	region: "us-east-2",
	endpoint: "dynamodb.us-east-2.amazonaws.com"
});
var ddb = new AWS.DynamoDB();
var express = require('express');
var app = express();
var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var poolid = "us-east-2_qch3iuEm3";
var clientid = "5hbv2t9b7cbgk69dnkflhsodne";
var index = require('./routes/index');
var users = require('./routes/users');
var createuser = require('./routes/createusers');
var changepassword = require('./routes/changepassword');
var forgotpassword = require('./routes/forgotpassword');
var tables = ddb.listTables();

var port = 9000;
app.listen(port);
console.log('Listening on port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', users);
app.use('/createusers', createuser);
app.use('/changepassword', changepassword);
app.use('/forgotpassword', forgotpassword);

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;