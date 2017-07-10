var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('createusers', { title: 'Create a User', name: 'user' });
});

//Users are created via Advanced Rest Client, the application automatically adds users to the cognito pool if they exist in the corresponding DynamoDB
						
module.exports = router;
