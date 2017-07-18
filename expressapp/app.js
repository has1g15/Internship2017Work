var _ = require("lodash");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var stuff;
var parts;
var exec = require('child_process').exec;
var child;

var usernames = [];
var count = 0;
			
function random (low, high) {
    return Math.random() * (high - low) + low;
}

var users = [
  {
    username: 'has1g15',
    password: 'Password1'
  },
  {
    name: 'test',
    password: 'test'
  }
];

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

app.get("/createusers", function(req, res) {
  res.json({message: "Add users via Postman or similar REST client, they will then be allocated a password"});
  function checkNewUsers(){
  child = exec("aws dynamodb scan --table-name UserDetailsDev", function (error, stdout, stderr) {
		child = exec("aws cognito-idp list-users --user-pool-id us-east-2_M8LZIsbAN", function (error2, stdout2, stderr2) {
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
					child=exec("aws cognito-idp sign-up --client-id 5q5hugosg9t383rpi5mcfn0j74 --password Password1 --user-attributes Name=email,Value=" + parts[i+6] + " Name=phone_number,Value=+447543216789 --username " + parts[i] + " --region us-east-2", function (error, stdout, stderr){
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
	setTimeout(checkNewUsers, 3000);
  }
});

app.get("/forgotpassword", function(req, res) {
	res.json({message: "Forgot Password"});
	child = exec("aws dynamodb scan --table-name UserDetailsDev", function (error, stdout, stderr) {
	console.log("Scanning table");
		
			if(error !== null) {
				console.log("Error in forgot password" + stderr);
			}
			stuff = stdout;
			parts = stuff.split('\"');
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
			console.log("Index of random user: " + rand);
			console.log("Simulating " + usernames[rand] + " forgetting password");
			
//child=exec("aws cognito-idp forgot-password --client-id 5q5hugosg9t383rpi5mcfn0j74 --username " + usernames[rand], function (error, stdout, stderr){ 
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
		});
	});	

app.get("/changepassword", function(req, res) {	
res.json({message: "Change Password"});
child = exec("aws dynamodb scan --table-name UserDetailsDev", function (error, stdout, stderr) {
	console.log("Scanning table");
		
			if(error !== null) {
				console.log("Error in change password" + stderr);
			}
			stuff = stdout;
			parts = stuff.split('\"');
			
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
			console.log("Index of random user: " + rand);
			console.log("Simulating " + usernames[rand] + " changing password");
		
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

		});
});

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'secretKey';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  //iterate round dynamoDB users to check existing user 
  var user = users[_.findIndex(users, {username: jwt_payload.username})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

app.use(passport.initialize());

app.get("/", function(req, res) {
  res.json({message: "Login Page"});
});

app.post("/login", function(req, res) {
  if(req.body.name && req.body.password){
    var name = req.body.name;
    var password = req.body.password;
  }
  // usually this would be a database call:
  var user = users[_.findIndex(users, {name: name})];
  if( ! user ){
    res.status(401).json({message:"Unable to find user"});
  }

  if(user.password === req.body.password) {
    var payload = {username: user.username};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "Password accepted", token: token});
  } else {
    res.status(401).json({message:"Passwords do not match"});
  }
});

app.get("/test", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Yay"});
});

app

app.listen(3000, function() {
  console.log("Listening on port 3000");
});/*//setting up everything
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
var auth = require('express-jwt-token')
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

var CognitoStrategy = require('passport-cognito')
var passport = require('passport');

router.all('*', auth.jwtAuthProtected)
 
router.all('/api/*', auth.jwtAuthProtected)
 
router.get('/auth-protected', auth.jwtAuthProtected, function(req, res){
	console.log("jwt auth protected");
  /*res.send({'msg': 'Im jwt auth protected!'})
  res.json({ error: err })
});

var port = 9000;
app.listen(port);
console.log('Listening on port', port);

/*var nJwt = require('njwt');
var secureRandom = require('secure-random');

var signingKey = secureRandom(256, {type: 'Buffer'}); 

var claims = {
  iss: "http://localhost:9000",  
  sub: "",    
  scope: "self, admins"
}

var jwt = nJwt.create(claims,signingKey);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

console.log(jwt);

var token = jwt.compact();
console.log(token);

var base64SigningKey = signingKey.toString('base64');
console.log(base64SigningKey);

nJwt.verify(token,signingKey,function(err,verifiedJwt){
  if(err){
    console.log(err); 
  }else{
    console.log(verifiedJwt); 
  }
});

passport.use(new CognitoStrategy({
    userPoolId: 'us-east-2_M8LZIsbAN',
    clientId: '5q5hugosg9t383rpi5mcfn0j74',
    region: 'us-east-2'
  },
  function(accessToken, idToken, refreshToken, user, cb) {
    process.nextTick(function() {
		console.log("i am working");
		user.expiration = session.getIdToken().getExpiration();
      cb(null, user);
    });
  }
));

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

module.exports = app;*/