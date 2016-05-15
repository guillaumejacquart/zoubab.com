var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');

router.post('/login',
	passport.authenticate('local', { session: false }),
	function(req, res) {
		res.json(req.user);
});

router.post('/', function(req, res) {	
	User.insert(req.body.username, req.body.password, function(user){
		res.json(user);	
	});
});

module.exports = router;