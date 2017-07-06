var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('forgotpassword', { title: 'Reset Your Password', name: 'user' });
});

module.exports = router;