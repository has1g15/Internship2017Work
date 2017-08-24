var config = require('config');
//Getting configuration information from development and production JSON files 
var userPoolID = config.get('Config.userPoolID');
var clientID = config.get('Config.clientID');
var region = config.get('Config.region');
var accessKey = config.get('Config.accessKeyID');
var secretAccessKey = config.get('Config.secretAccessKey');
var dbName = config.get('Config.dbName');

//Importing libraries 
var _ = require("lodash");
var express = require("express");
var app = express();

app.set('port', process.env.PORT || 8081);

var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var router = express.Router();
var request = require("request");

var passport = require("passport");
var refresh = require('passport-oauth2');
Auth2RefreshTokenStrategy = require('passport-oauth2-middleware').Strategy;
var randtoken = require('rand-token');
var refreshTokens = {} 
var secret = "secret" 

//Using passport for user authentication
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

var parts;
var exec = require('child_process').exec;
var child;

var usernames = [];
var count = 0;		

function random (low, high) {
    return Math.random() * (high - low) + low;
}

//Temporary test users 
var users = [
  {
	id: 1,
    name: 'has1g15',
    password: 'Password1'
  },
  {
	id: 2,
    name: 'trs1g15',
    password: 'Password2'
  }
];

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
//Tokens signed with secret key 
jwtOptions.secretOrKey = 'secretKey';

//Strategy for web token authentication 
var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
	
	console.log('payload received', jwt_payload);
  //TODO: iterate round dynamoDB users to check existing user rather than test users 
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});

passport.use(strategy);

app.use(passport.initialize());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var refreshToken;
var user;
var name;
var refreshTokens = [];

//Login gives access token provided username and password are valid - token can be tested using /test route 
app.post("/login", function(req, res) {
	//generating refresh token
  if(req.body.name && req.body.password){
    name = req.body.name;
	refreshToken = randtoken.uid(256);
	refreshTokens[refreshToken] = name;
	console.log(refreshToken);
	console.log(refreshTokens[refreshToken]);
	console.log(name);
	user = users[_.findIndex(users, {name: name})];
    var password = req.body.password;
  }
  if( ! user ){
    res.status(401).json({message:"Unable to find user"});
  }

  if(user.password === req.body.password) {
	  //setting token expiration time 
    var payload = {id: user.id, exp:(Date.now() / 1000) + 60};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
	
    //when both user and password are recognised, access token is released 
    res.json({message: "Password accepted", token: token});
  } else {
    res.status(401).json({message:"Passwords do not match"});
  }
});

//when provided with a refresh token, a new access token is released 
app.post('/getNewAccess', function (req, res, next) {
  name = req.body.name
  user = users[_.findIndex(users, {name: name})];
  refreshToken = req.body.refreshToken;
  if((refreshToken in refreshTokens) && (refreshTokens[refreshToken] == name)) {
    /*var user = {
      'name': name
    }*/
	var payload = {id: user.id, exp:(Date.now() / 1000) + 60};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
	//var token = jwt.sign(user, secret, { expiresIn: (Date.now() / 1000) + 60 })
    res.json({token: 'JWT ' + token});
  }
  else {
    res.status(401).json({message:"Invalid refresh token"});
	console.log(refreshToken);
	console.log(refreshTokens[refreshToken]);
	console.log(name);
  }
  
})

//authenticates token 
app.get("/getRefresh", passport.authenticate('jwt', { session: false }), function(req, res){ 
  res.json({refreshToken: refreshToken});
});

app.get("/", function(req, res) {
  res.json("Main Page");
});

//route adds all users to user pool who have been added via REST client 
app.get("/createusers", function(req, res) {
  res.json({message: "Add users via Postman or similar REST client, they will then be allocated a password"});
  //function is called every 3 seconds to check for any newly added users 
  setTimeout(checkNewUsers, 3000);
  console.log("checking");
});

function checkNewUsers(){
	console.log("I got here");
  child = exec("aws dynamodb scan --table-name " + dbName, function (error, stdout, stderr) {
		child = exec("aws cognito-idp list-users --user-pool-id " + userPoolID, function (error2, stdout2, stderr2) {0
			console.log(stdout2);
			userPool = stdout2;
			if(error !== null) {
				console.log("Error" + stderr2);
			}
			parts = stdout.split('\"');
	  //goes through the usernames in DynamoDB and checks if they're in Cognito or not, if not it adds them		
			for (var i = 21; i < parts.length; i+=24)
			{
				console.log("checked user " + [i]);
				if (userPool.indexOf(parts[i]) < 0)
				{
					console.log(parts[i] + " has been checked");
					child=exec("aws cognito-idp sign-up --client-id " + clientID + " --password Password1 --user-attributes Name=email,Value=" + parts[i+6] + " Name=phone_number,Value=+447543216789 --username " + parts[i] + " --region " + region, function (error, stdout, stderr){
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
  }
  
//simulates user changing password 
app.get("/forgotpassword", function(req, res) {
	res.json({message: "Forgot Password"});
	child = exec("aws dynamodb scan --table-name " + dbName, function (error, stdout, stderr) {
	console.log("Scanning table");
		
			if(error !== null) {
				console.log("Error in forgot password" + stderr);
			}
			parts = stdout.split('\"');
	for (var i = 21; i < parts.length; i+=24)
			{
				usernames[count] = parts[i];
				console.log(usernames[count]);
					 count++;
			}
			
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			
			//random user from the table is selected in order to test function 
			rand = Math.round(random(0, count -1));
			console.log("Index of random user: " + rand);
			console.log("Simulating " + usernames[rand] + " forgetting password");
			
//child=exec("aws cognito-idp forgot-password --client-id " + clientID + " --username " + usernames[rand], function (error, stdout, stderr){ 
			//When incorportating front end features, this would be the command used, there would be facility for the user to enter the confirmation code they have received via email
			/*child=exec("aws cognito-idp confirm-forgot-password --client-id " + clientID + " --confirmation-code " + valcode + " --password " + pass + " --username " + uname, function (error, stdout, stderr){
				if (error == null)
				{
					console.log('Your password has been successfully reset');
					action = "Password Reset Successfully";
				} else {
					console.log("Error: " + stderr);
				}
			});*/
			child=exec("aws cognito-idp admin-initiate-auth --user-pool-id " + userPoolID + " --client-id 5q5hugosg9t383rpi5mcfn0j74 --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=" + usernames[rand] + ",PASSWORD=Password1", function (error, stdout, stderr){
				if (error !== null) {
					console.log("Error: " + stderr);
				}
				//splits command output in order to extract and use access token
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

//simulates user changing password 
app.get("/changepassword", function(req, res) {	
res.json({message: "Change Password"});
child = exec("aws dynamodb scan --table-name " + dbName, function (error, stdout, stderr) {
	console.log("Scanning table");
		
			if(error !== null) {
				console.log("Error in change password" + stderr);
			}
			parts = stdout.split('\"');
			
			for (var i = 21; i < parts.length; i+=24)
			{
				usernames[count] = parts[i];
				console.log(usernames[count]);
					 count++;
			}
			
			if (error !== null) {
				console.log('exec error: ' + error);
			}
			//random user from table is selected 
			rand = Math.round(random(0, count -1));
			console.log("Index of random user: " + rand);
			console.log("Simulating " + usernames[rand] + " changing password");
		
			//change selected users password 
			child=exec("aws cognito-idp admin-initiate-auth --user-pool-id " + userPoolID + " --client-id " + clientID + " --auth-flow ADMIN_NO_SRP_AUTH --auth-parameters USERNAME=" + usernames[rand] + ",PASSWORD=Password1", function (error, stdout, stderr){
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

app.listen(app.get('port'));