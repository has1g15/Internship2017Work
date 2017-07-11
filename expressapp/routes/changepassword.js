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

module.exports = router;