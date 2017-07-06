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

module.exports = router;

//scanning the users in our DynamoDB and adding ones to Cognito if they aren't already there
child = exec("aws dynamodb scan --table-name UserDetails", function (error, stdout, stderr) {
	child = exec("aws cognito-idp list-users --user-pool-id us-east-2_MN8edldd8", function (error2, stdout2, stderr2) {
	userPool = stdout2;
	console.log("I am an error" + stderr2);

  stuff = stdout;
  parts = stuff.split('\"');
  //goes through the usernames in DynamoDB and checks if they're in Cognito or not, if not it adds them		
  for (var i = 21; i < parts.length; i+=30)
{
	console.log("checkd user " + [i]);
	if (userPool.indexOf(parts[i]) < 0)
	{
		console.log(parts[i] + " has been checked");
		child=exec("aws cognito-idp sign-up --client-id 73ol5h18ov3ip0s5ehse3aiedn --password Password5 --user-attributes Name=email,Value=" + parts[i+12] + " Name=preferred_username,Value=rdi1g15 Name=phone_number,Value=+447543216789 --username " + parts[i] + " --region us-east-2", function (error, stdout, stderr){
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
  one = parts[21];
  two = parts[51];
  three = parts[81];
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
});



/*child = exec("aws dynamodb get-item --table-name UserDetails --key UserID={N=1} --attributes-to-get Username", function (error, stdout, stderr) {
  stuff1 = stdout;
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});
child = exec("aws dynamodb get-item --table-name UserDetails --key UserID={N=2} --attributes-to-get Username", function (error, stdout, stderr) {
  stuff2= stdout;
  if (error !== null) {
    console.log('exec error: ' + error);
  }
});*/

router.get('/', function(req, res, next) {
  res.render('users', { title: 'Select an option', one: one, two: two, three: three});
});