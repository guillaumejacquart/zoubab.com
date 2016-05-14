var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');
var Chat = require('../models/chats');

router.post('/login',
	passport.authenticate('local', { session: false }),
	function(req, res) {
		res.json(req.user);
});

router.post('/register', function(req, res) {	
	User.insert(req.body.username, req.body.password, function(user){
		res.json(user);	
	});
});

/* GET home page. */
router.get('/messages', 
	passport.authenticate('bearer', { session: false }),
	function(req, res, next) {
		Chat.find(function (err, docs) {		
			res.json(docs);
		});
});

module.exports = function(io){	

	// socket.io events
	io.on("connection", socketioJwt.authorize({
		secret: constants.secret,
		timeout: 15000 // 15 seconds to send the authentication message
	}));
		
		
	io.on('authenticated', function(socket){
		console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token));
		
		socket.on('chat message', function(msg){
			
			Chat.insert(socket.decoded_token.username, msg, function (err, newDoc) {				
				io.emit('chat message', newDoc);
			});
			
		});
	});
	
	return router;
}