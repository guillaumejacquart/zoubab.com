var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');

router.get('/',
	passport.authenticate('facebook'));

router.get('/callback',
	passport.authenticate('facebook', { failureRedirect: '/login' }),
	function (req, res) {
		// Successful authentication, redirect home.
		res.render('after-auth', { state: 'success', user: req.user ? req.user : null });
	});

module.exports = router;