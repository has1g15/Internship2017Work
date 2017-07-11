var express = require('express');
var router = express.Router();
var stuff;

var parts;
var exec = require('child_process').exec;
var child;
var glob = require('../app.js');
var clientID = "5q5hugosg9t383rpi5mcfn0j74";
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forgotpassword', { title: 'Reset Your Password', name: 'user' });
});
var uname;
var pass;
var prepass;
var valcode;
var answer;
var answer2;
var answer3;

/*rl.question('Enter Username:', (answer) => {
	uname = answer;
	child=exec("aws cognito-idp forgot-password --client-id 73ol5h18ov3ip0s5ehse3aiedn --username " + uname, function (error, stdout, stderr){ });
	rl.question('We have sent you an email, please enter your verification code:', (answer2) => {
		valcode = answer2;
		rl.question('Enter new password:', (answer3) => {
			pass = answer3;
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
});*/
						
module.exports = router;