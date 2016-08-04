
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var constants = require('./constants');
var user = require('../models/users');
var passport = require('passport')
  , BearerStrategy = require('passport-http-bearer').Strategy
  , LocalStrategy = require('passport-local').Strategy
  , FacebookStrategy = require('passport-facebook').Strategy;


// Configure the Facebook strategy for use by Passport.
//
// OAuth 2.0-based strategies require a `verify` function which receives the
// credential (`accessToken`) for accessing the Facebook API on the user's
// behalf, along with the user's profile.  The function must invoke `cb`
// with a user object, which will be set at `req.user` in route handlers after
// authentication.
passport.use(new FacebookStrategy({
    clientID: constants.facebookClientId,
    clientSecret: constants.facebookClientSecret,
    callbackURL: '/auth/facebook/callback',
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    user.findOrCreateFacebook(profile, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      var token = jwt.sign(user, constants.secret);
      user.token = token;
      return cb(err, user);
    });
  }));;

passport.use(new BearerStrategy(
  function(token, done) {
    var user = jwt.verify(token, constants.secret);
    return done(null, user, { scope: 'all' });
  }
));

passport.use(new LocalStrategy(
  {usernameField:"email", passwordField:"password"},
  function(email, password, done) {
    user.find(email, password, function(err, user){
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