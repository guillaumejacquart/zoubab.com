
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var constants = require('./constants');
var user = require('../models/users');
var passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new BearerStrategy(
  function(token, done) {
    var user = jwt.verify(token, constants.secret);
    return done(null, user, { scope: 'all' });
  }
));

passport.use(new LocalStrategy(
  function(username, password, done) {
    user.find(username, password, function(err, user){
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      var token = jwt.sign(user, constants.secret);
      user.token = token;
      return done(null, user);
    });
  }
));