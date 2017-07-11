//setting everything up
var express = require('express');
var router = express.Router();
var stuff;
var parts;
var exec = require('child_process').exec;
var child;
var one;
var two;
var three;
var clientID;
var tablename;
var poolID;
//var glob = require('../app.js');
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Users', name: 'user' });
});

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
    output: process.stdout
});
rl.question('Run config: \n 1 - Development \n 2 - Production \n', (answer1) => {
	response = answer1;
	if (response == 1)
	{
		clientID = "5q5hugosg9t383rpi5mcfn0j74";
		tablename = "UserDetailsDev";
		poolID = "us-east-2_M8LZIsbAN";
	}
	else if (response == 2)
	{
		clientID = "6m4hcbg93084uktp7bep6m8128";
		tablename = "UserDetailsProd";
		poolID = "us-east-2_6Ty3PX9Ss";
	}
	child = exec("aws dynamodb scan --table-name " + tablename, function (error, stdout, stderr) {
		child = exec("aws cognito-idp list-users --user-pool-id " + poolID, function (error2, stdout2, stderr2) {
			userPool = stdout2;
			if(error !== null) {
				console.log("I am an error" + stderr2);
			}
			stuff = stdout;
			parts = stuff.split('\"');
	  //goes through the usernames in DynamoDB and checks if they're in Cognito or not, if not it adds them		
			for (var i = 21; i < parts.length; i+=24)
			{
				console.log("checkd user " + [i]);
				if (userPool.indexOf(parts[i]) < 0)
				{
					console.log(parts[i] + " has been checked");
					child=exec("aws cognito-idp sign-up --client-id " + clientID + " --password Password5 --user-attributes Name=email,Value=" + parts[i+6] + " Name=phone_number,Value=+447543216789 --username " + parts[i] + " --region us-east-2", function (error, stdout, stderr){
						if (error == null)
						{
							console.log("User Successfully Created");
							action = "Created user " + parts[i];
						}
						else {
							console.log("Error: " + stderr);
						}
					});
				}	 
			}
			if (error !== null) {
				console.log('exec error: ' + error);
			}
		});
	});
});
//scanning the users in our DynamoDB and adding ones to Cognito if they aren't already there

module.exports = router;

