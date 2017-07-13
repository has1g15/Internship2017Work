var express = require('express');
var router = express.Router();

var stuff;
var users = require('./users.js')
var parts = "";
var exec = require('child_process').exec;
var child;
var glob = require('../app.js');

/* GET home page. */


var usernames = [];
var count = 0; 

child = exec("aws dynamodb scan --table-name UserDetailsDev", function (error, stdout, stderr) {
	console.log("Scanning table");
		
			if(error !== null) {
				console.log("Error in forgot password" + stderr);
			}
			stuff = stdout;
			parts = stuff.split('\"');
	  //goes through the usernames in DynamoDB and checks if they're in Cognito or not, if not it adds them		
			for (var i = 21; i < parts.length; i+=24)
			{
				usernames[count] = parts[i];
				console.log(usernames[count]);
					 count++;
			}
			
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			
			rand = Math.round(random(0, count -1));
			console.log(rand);
			console.log("Simulating " + usernames[rand] + " changing password");
		
		child=exec("aws cognito-idp forgot-password --client-id 5q5hugosg9t383rpi5mcfn0j74 --username " + usernames[rand], function (error, stdout, stderr){ });
			//When incorportating front end features, this would be the command used, there would be facility for the user to enter the confirmation code they have received via email
			/*child=exec("aws cognito-idp confirm-forgot-password --client-id 5q5hugosg9t383rpi5mcfn0j74 --confirmation-code " + valcode + " --password " + pass + " --username " + uname, function (error, stdout, stderr){
				if (error == null)
				{
					console.log('Your password has been successfully reset');
					action = "Password Reset Successfully";
				} else {
					console.log("Error: " + stderr);
				}
			});*/
			child=exec("aws cognito-idp admin-initiate-auth --user-pool-id us-east-2_M8LZIsbAN --client-id 5q5hugosg9t383rpi5mcfn0j74 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=" + usernames[rand] + ",PASSWORD=Password1", function (error, stdout, stderr){
				if (error !== null) {
					console.log("Error: " + stderr);
				}
				
				var token = stdout.split('\"');
				child=exec("aws cognito-idp change-password --previous-password Password1 --proposed-password Password1 --access-token " + token[19], function (error, stdout, stderr){
					if (error == null) {
						console.log('Password Successfully Changed!');
						action = "Password changed";
					} else {
						console.log("Error: " + stderr);
					}
				});		
			});
			router.get('/', function(req, res, next) {
			  res.render('changepassword', { title: 'Change Your Password', username: usernames[rand] });
			});
});

function random (low, high) {
    return Math.random() * (high - low) + low;
}

module.exports = router;