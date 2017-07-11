var express = require('express');
var router = express.Router();
var stuff;
var users = require('./users.js')
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
						
module.exports = router;