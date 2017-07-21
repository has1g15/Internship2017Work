var _ = require("lodash");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var jwt = require('jsonwebtoken');
var router = express.Router();

var passport = require("passport");
//var passportJWT = require("passport-jwt");
var Auth0Strategy = require('passport-auth0');

//var ExtractJwt = passportJWT.ExtractJwt;
//var JwtStrategy = passportJWT.Strategy;

var strategy = new Auth0Strategy(
  {
    domain: 'timhannah.eu.auth0.com',
    clientID: 'kbbO4O2GK9MVgRfVY7Usz_5yKZUBj5Hf',
    clientSecret: 'YOUR_CLIENT_SECRET',
    callbackURL: 'http://localhost:3000/callback'
  },
  (accessToken, refreshToken, extraParams, profile, done) => {
    return done(null, profile);
  }
);

passport.use(strategy);

var env = {
  AUTH0_CLIENT_ID: 'kbbO4O2GK9MVgRfVY7Usz_5yKZUBj5Hf',
  AUTH0_DOMAIN: 'timhannah.eu.auth0.com',
  AUTH0_CALLBACK_URL: 'http://localhost:3000/callback'
};

// Perform the login
router.get(
  '/login',
  passport.authenticate('auth0', {
    clientID: env.AUTH0_CLIENT_ID,
    domain: env.AUTH0_DOMAIN,
    redirectUri: env.AUTH0_CALLBACK_URL,
    audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
    responseType: 'code',
    scope: 'openid'
  }),
  function(req, res) {
    res.redirect('/');
  }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Perform the final stage of authentication and redirect to '/user'
router.get(
  '/callback',
  passport.authenticate('auth0', {
    failureRedirect: '/'
  }),
  function(req, res) {
    res.redirect(req.session.returnTo || '/user');
  }
);

// This can be used to keep a smaller payload
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.use(passport.initialize());
app.use(passport.session());

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

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json())

/*var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'secretKey';*/

/*var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
	domain: 'timhannah.eu.auth0.com',
	clientID: '9Kwf4wkYp4Rjmw0rROVatC7lcD952OCj',
	clientSecret: 'pnMBr1YpHCXCyk_7QXfzcDPw6KlF1i_-XoPnnWAMIhV6_LjNwjZcSrcsMI4OXwmC'.
	callbackURL: '/callback'
	/*console.log('payload received', jwt_payload);
  //iterate round dynamoDB users to check existing user 
  var user = users[_.findIndex(users, {id: jwt_payload.id})];
  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});*/

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
    var payload = {id: user.id};
    var token = jwt.sign(payload, jwtOptions.secretOrKey);
    res.json({message: "Password accepted", token: token});
  } else {
    res.status(401).json({message:"Passwords do not match"});
  }
});

app.get("/test", passport.authenticate('jwt', { session: false }), function(req, res){
  res.json({message: "Successful"});
});

function getToken() {
  var loginUrl = "http://localhost:3000/login"
  var xhr = new XMLHttpRequest();
  var userElement = document.getElementById('username');
  var passwordElement = document.getElementById('password');
  var tokenElement = document.getElementById('token');
  var user = userElement.value;
  var password = passwordElement.value;

  xhr.open('POST', loginUrl, true);
  xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  xhr.addEventListener('load', function() {
    var responseObject = JSON.parse(this.response);
    console.log(responseObject);
    if (responseObject.token) {
      tokenElement.innerHTML = responseObject.token;
    } else {
      tokenElement.innerHTML = "No token received";
    }
  });

  var sendObject = JSON.stringify({name: user, password: password});

  console.log('going to send', sendObject);

  xhr.send(sendObject);
}

function getSecret() {

  var url = "http://localhost:3000/secret"
  var xhr = new XMLHttpRequest();
  var tokenElement = document.getElementById('token');
  var resultElement = document.getElementById('result');
  xhr.open('GET', url, true);
  xhr.setRequestHeader("Authorization", "JWT " + tokenElement.innerHTML);
  xhr.addEventListener('load', function() {
    var responseObject = JSON.parse(this.response);
    console.log(responseObject);
    resultElement.innerHTML = this.responseText;
  });

  xhr.send(null);
}

var request = require("request");

/*var options = { method: 'POST',
  url: 'https://localhost:3000/test',
  headers: { 'content-type': 'application/json' },
  body: 
   { grant_type: 'authorization_code',
     client_id: 'b5e12a8a-d1cf-4885-93c7-1e6df4f87962',
     client_secret: 'T2vzr4pzpdYbUfnCuJhCwOY',
     code: 'YOUR_AUTHORIZATION_CODE',
     redirect_uri: 'https://localhost:3000/login/callback' },
  json: true };

  console.log(options.body);
request(options, function (error, response, body) {
  //if (error) throw new Error(error);
  console.log(body);
});*/

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