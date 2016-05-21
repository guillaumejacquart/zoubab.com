var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');
var Chat = require('../models/chats');
var request = require('request');

/**
 * @api {get} /chats Get chat infos
 * @apiDescription Get latest chat informations (messages and connected users).
 * @apiName Get
 * @apiGroup Chats
 *
 * @apiHeader {String} Authorization Authorization value (bearer token).
 * @apiHeaderExample {String} Header-Example: 
 * 		Bearer T0k3n
 * 
 * @apiSuccess {Object[]} messages Message list
 * @apiSuccess {Object[]} users  Users list.
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "messages":[{"username":"test2","userId":"3TGEwiBWnMcddVKR","msg":"zoubab !","date":"2016-05-21T09:00:50.995Z","_id":"xXc9Wq85zPaHw4fa"},{"username":"test2","userId":"3TGEwiBWnMcddVKR","msg":"yeyy!","date":"2016-05-21T09:03:43.286Z","_id":"4kJAdQuRue1ZF2hi"}],
 *       "users":[{"email":"test@test.fr","username":"test2","isConnected":true,"_id":"3TGEwiBWnMcddVKR","picturePath":"/api/users/3TGEwiBWnMcddVKR/picture?1463766162779"},{"email":"test3@test.fr","username":"test3","isConnected":true,"_id":"8j5ix4VBXZt7YZs3"}]
 *     }
 */
router.get('/',
	passport.authenticate('bearer', { session: false }),
	function (req, res, next) {
		User.findConnected(function (err, users) {
			Chat.find(function (err, messages) {
				res.json({
					messages: messages,
					users: users
				});
			});
		});
	});

function sendPush(msg, targetsToken) {
	var jwt = constants.pushToken;
	var tokens = targetsToken;
	var profile = constants.pushProfile;

	// Build the request object
	request({
		url: 'https://api.ionic.io/push/notifications',
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + jwt
		},
		json: {
			"tokens": tokens,
			"profile": profile,
			"notification": {
				"title": "New zoubab message",
				"message": "user " + msg.username + " sent a new message",
				"android": {
					"title": "New zoubab message",
					"message": "user " + msg.username + " sent a new message",
					"payload": {
						"message": msg.msg
					}
				},
				"ios": {
					"title": "New zoubab message",
					"message": "user " + msg.username + " sent a new message",
					"payload": {
						"message": msg.msg
					}
				}
			}
		}
	}, function(error, response, body){
		if(error) {
			console.log(error);
		} else {
			console.log(response.statusCode, body);
		}
	});
}

module.exports = function (io) {

	// socket.io events
	io.on("connection", socketioJwt.authorize({
		secret: constants.secret,
		timeout: 15000 // 15 seconds to send the authentication message
	}));

	io.on('authenticated', function (socket) {
		console.log('connected & authenticated: ' + JSON.stringify(socket.decoded_token));
		User.update(socket.decoded_token._id, {isConnected: true});
		io.emit('connected_user', socket.decoded_token);

		socket.on('chat message', function (msg) {
			var message = {
				username: socket.decoded_token.username,
				userId: socket.decoded_token._id,
				msg: msg
			};
			Chat.insert(message, function (err, newDoc) {
				io.emit('chat message', newDoc);
			});
			User.getDeviceTokens(function(err, tokens){
				sendPush(message, tokens
					.filter(function(t){return t.device})
					.map(function(t){return t.device}));
			});
		});

		// socket.io events
		socket.on("disconnect", function () {
			User.update(socket.decoded_token._id, {isConnected:false}, function () {
				io.emit('disconnected_user', socket.decoded_token);
			});
		});

	});

	return router;
}