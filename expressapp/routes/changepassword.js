var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('changepassword', { title: 'Change Your Password', name: 'user' });
});
var answer;
var answer2;
var answer3;
const readline = require('readline');
var uname;
var pass;
var prepass;
/*rl.question('Enter Username:', (answer) => {
	uname = answer;
	rl.question('Enter Previous Password:', (answer2) => {
		prepass = answer2;
		rl.question('Enter New Password:', (answer3) => {
			pass = answer3;
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
});*/
module.exports = router;