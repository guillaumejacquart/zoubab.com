var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');
var Chat = require('../models/chats');

/* GET home page. */
router.get('/', 
	passport.authenticate('bearer', { session: false }),
	function(req, res, next) {
		User.findConnected(function(err, users){			
			Chat.find(function (err, messages) {		
				res.json({
					messages: messages,
					users: users
				});
			});
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
		User.update(socket.decoded_token.username, true);		
		io.emit('connected_user', socket.decoded_token);
		
		socket.on('chat message', function(msg){
			Chat.insert(socket.decoded_token.username, msg, function (err, newDoc) {				
				io.emit('chat message', newDoc);
			});
			
		});
	
		// socket.io events
		socket.on("disconnect", function(){
			User.update(socket.decoded_token.username, false, function(){	
				io.emit('disconnected_user', socket.decoded_token);
			});
		});
		
	});
	
	return router;
}