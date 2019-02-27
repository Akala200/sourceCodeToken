var express = require('express');
var router = express.Router();
var mongoose = require('mongoose')

var User = require('../dbconnections/models/users');
var History = require('../dbconnections/models/transaction');

/* Credit User Account. */
router.post('/credit', function (req, res) {
    User.find({userPhoneNumber: req.body.data}).exec()
    .then(users => {
      if (users.length > 0) { 
          if (req.body.amount === 0 || typeof req.body.amount === 'undefined') {
              res.json({
                'success': false,
                'status': 200,
                'message': 'Invalid amount'
              })
              return;
          }
          else {
            users[0].accountBalance = parseInt(users[0].accountBalance) - parseInt(req.body.amount);
              console.log(users)
              users[0].save(function(err) {
                if(err) {
                    res.json({
                        'success': false,
                        'status': 200,
                        'message': 'Sorry an error occured'
                    })
                    return;
                }
                else {
                    // add to transaction history
                    var history = new History({
                        userPhoneNumber: users[0].userPhoneNumber,
                        amount: req.body.amount,
                    });
                    history.save(function(err) {
                        if(err) {
                            res.json({
                                'success': false,
                                'status': 200,
                                'message': 'Sorry an error occured'
                            })
                            return;
                        }
                        else {
                            // end of history
                            res.json({
                                'success': true,
                                'status': 200,
                                'message': 'credited succeesfully',
                                'data': parseInt(users[0].accountBalance)
                            })
                            return;
                        }
                    })
                }
              })
          }
          return;
      }
      res.json({
        'success': false,
        'status': 200,
        'message': 'No users found'
      });
      return;
    })
    .catch(err => res.json({
      'success': false,
      'status': 500,
      'message': err
    }));
  
    return;
  });



/* Debit from User's account. */
router.post('/debit', function (req, res) {
  User.find({userPhoneNumber: req.body.data}).exec()
  .then(users => {
    if (users.length > 0) { 
        if (req.body.amount === 0 || typeof req.body.amount === 'undefined') {
            res.json({
              'success': false,
              'status': 200,
              'message': 'Invalid amount'
            })
            return;
        }
        else {
            users[0].accountBalance = parseInt(users[0].accountBalance) - parseInt(req.body.amount);
            console.log(users[0].accountBalance)
            users[0].save(function(err) {
              if(err) {
                  res.json({
                      'success': false,
                      'status': 200,
                      'message': 'Sorry an error occured'
                  })
                  return;
              }
              else {
                  // add to transaction history
                  var history = new History({
                      userPhoneNumber: users[0].userPhoneNumber,
                      amount: req.body.amount,
                  });
                  history.save(function(err) {
                      if(err) {
                          res.json({
                              'success': false,
                              'status': 200,
                              'message': 'Sorry an error occured'
                          })
                          return;
                      }
                      else {
                          // end of history
                          res.json({
                              'success': true,
                              'status': 200,
                              'message': 'debited succeesfully',
                              'data': parseInt(users[0].accountBalance)
                          })
                          return;
                      }
                  })
              }
            })
        }
        return;
    }
    res.json({
      'success': false,
      'status': 200,
      'message': 'No users found'
    });
    return;
  })
  .catch(err => res.json({
    'success': false,
    'status': 500,
    'message': err
  }));

  return;
});



  /* Debit from User's account. */
  router.post('/balance', function (req, res) {
    User.find({userPhoneNumber: req.body.data}).exec()
    .then(users => {
      if (users.length > 0) { 
        res.json({
            'success': true,
            'status': 200,
            'message': 'Success',
            'data': parseInt(users[0].accountBalance)
        })
        return;
      }
      res.json({
        'success': false,
        'status': 200,
        'message': 'No users found'
      });
      return;
    })
    .catch(err => res.json({
      'success': false,
      'status': 500,
      'message': err
    }));
  
    return;
  });





  module.exports = router;