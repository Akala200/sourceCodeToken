var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var User = require('../dbconnections/models/users');

/* GET users listing. */
router.get('/getall', function (req, res) {
  
  User.find({}).sort({createdAt: -1}).exec()
  .then(users => {
    if (users.length > 0) { res.json(users); return; }
    res.json({
      'success': false,
      'status': 200,
      'message': 'No users found'
    });
  })
  .catch(err => res.json({
    'success': false,
    'status': 500,
    'message': err
  }));

  return;
});



router.get('/:phoneNumber', function (req, res) {
  User.find({userPhoneNumber: req.params.phoneNumber})
  .then(user => {console.log(req.params.phoneNumber)
    if (user.length > 0) { res.json(user); return; }
    res.json({
      'success': false,
      'status': 200,
      'message': 'User doesn\'t exist'
    });
  })
  .catch(err => res.json({
    'success': false,
    'status': 500,
    'message': err
  }));

  return
})

module.exports = router;
