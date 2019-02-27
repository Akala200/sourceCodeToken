var express = require('express');
var router = express.Router();
var User = require('../dbconnections/models/users');





router.post('/createAccount', function (req, res) {
  const balance = 0
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userPhoneNumber: req.body.userPhoneNumber,
      accountBalance: balance
      // createdAt: req.body.createdAt
    });
    // var user = new User({...req.body})
  
    user.save()
    .then(() => {
      res.json({
        'success': true,
        'status': 201,
        'message': 'User created successfully'
      });
    })
    .catch(err => {
      msg = err.message.split('failed: ')[1].split('., ');
      res.json({
        'success': false,
        'status': 500,
        'message': msg
      });
    })
  
    return;
  });


  
  


  module.exports = router;

  