var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('changepassword', { title: 'Change Your Password', name: 'user' });
});

module.exports = router;