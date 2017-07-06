//setting up everything
var config = {
	region: "us-east-2",
	accessKeyId: "AKIAI55LGXUPXY5J2IXQ",
	secretAccessKey: "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"
};
var AWS = require("aws-sdk");
AWS.config.update({
    region: "us-east-2",
    endpoint: "dynamodb.us-east-2.amazonaws.com"
});
var ddb = new AWS.DynamoDB();
var express = require('express');
var app = express();
app.locals.points = "8,713";

var router = express.Router();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var sys = require('util')
var exec = require('child_process').exec;
var child;
var stuff;

//This is the code we used to perform the operations at the command line interface
//We kept it in case we need any of the code
/*const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
    output: process.stdout
});
var response;
var uname;
var pass;
var email;
var prepass;
var valcode;
var action;
rl.question('Select Operation: \n 1 - Create User \n 2 - Change User Password \n 3 - Forgotten User Password \n', (answer1) => {
	response = answer1;
	if (response == 1)
	{
		
		rl.question('Enter Username:', (answer2) => {
			uname = answer2;
				rl.question('Enter Password:', (answer3) => {
					pass = answer3;
					rl.question('Enter Email:', (answer4) => {
						email = answer4;
						child=exec("aws cognito-idp sign-up --client-id 73ol5h18ov3ip0s5ehse3aiedn --password " + pass + " --user-attributes Name=email,Value=" + email + " Name=preferred_username,Value=rdi1g15 Name=phone_number,Value=+447543216789 --username " + uname + " --region us-east-2", function (error, stdout, stderr){
							if (error == null)
							{
								console.log("User Successfully Created");
								action = "Created user " + uname;
							}
							else {
								console.log("Error: " + stderr);
							}
						});
						rl.close();
					});
				});
		});
	}
	else if (response == 2)
	{
		rl.question('Enter Username:', (answer2) => {
			uname = answer2;
				rl.question('Enter Previous Password:', (answer3) => {
					prepass = answer3;
					rl.question('Enter New Password:', (answer4) => {
						pass = answer4;
						child=exec("aws cognito-idp admin-initiate-auth --user-pool-id us-east-2_MN8edldd8 --client-id 73ol5h18ov3ip0s5ehse3aiedn --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=" + uname + ",PASSWORD=" + prepass, function (error, stdout, stderr){
							if (error !== null) {
								console.log("Error: " + stderr);
							}
							var token = stdout.split('\"');
							child=exec("aws cognito-idp change-password --previous-password " + prepass + " --proposed-password " + pass + " --access-token " + token[19], function (error, stdout, stderr){
								if (error == null) {
									console.log('Password Successfully Changed!');
									action = "Password changed";
								} else {
									console.log("Error: " + stderr);
								}
							});
							
						});
						rl.close();
					});
				});
		});
	}
	else if (response == 3)
	{
		rl.question('Enter Username:', (answer2) => {
			uname = answer2;
			child=exec("aws cognito-idp forgot-password --client-id 73ol5h18ov3ip0s5ehse3aiedn --username " + uname, function (error, stdout, stderr){ });
			rl.question('We have sent you an email, please enter your verification code:', (answer3) => {
				valcode = answer3;
				rl.question('Enter new password:', (answer4) => {
					pass = answer4;
					child=exec("aws cognito-idp confirm-forgot-password --client-id 73ol5h18ov3ip0s5ehse3aiedn --confirmation-code " + valcode + " --password " + pass + " --username " + uname, function (error, stdout, stderr){
						if (error == null)
						{
							console.log('Your password has been successfully reset');
							action = "Password Reset Successfully";
						} else {
							console.log("Error: " + stderr);
						}
					});
				});
			});
		});
	}
});*/


//setting up the pages in Express
var users = require('./routes/users');
var createusers = require('./routes/createusers');
var changepassword = require('./routes/changepassword');
var forgotpassword = require('./routes/forgotpassword');
var tables = ddb.listTables();

var port = 9000;
app.listen(port);
console.log('Listening on port', port);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', users);
app.use('/createusers', createusers);
app.use('/changepassword', changepassword);
app.use('/forgotpassword', forgotpassword);

//error to display if a user searches for a page we don't have
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
