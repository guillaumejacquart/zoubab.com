var express = require('express');
var passport = require('passport');
var socketioJwt = require('socketio-jwt');
var router = express.Router();
var constants = require('../middlewares/constants');
var User = require('../models/users');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');

/**
 * @api {post} /users/login Login user
 * @apiDescription Login user with email and password and returns db user with token.
 * @apiName Login
 * @apiGroup Users
 * 
 * @apiParam {String} email User email.
 * @apiParam {String} password User password.
 * 
 * @apiSuccess {String} token User token
 * @apiSuccess {String} username Username
 * @apiSuccess {String} _id User id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "t0K3n",
 *       "username": "Username",
 *       "_id": "467281"
 *     }
 */
router.post('/login',
	passport.authenticate('local', { session: false }),
	function(req, res) {
		res.json(req.user);
});

/**
 * @api {post} /users Create user
 * @apiDescription Register user with email, username and password and returns db user with token
 * @apiName Register
 * @apiGroup Users
 * 
 * @apiParam {String} email User email.
 * @apiParam {String} username Username.
 * @apiParam {String} password User password.
 * 
 * @apiSuccess {String} token User token
 * @apiSuccess {String} username Username
 * @apiSuccess {String} _id User id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "t0K3n",
 *       "username": "Username",
 *       "_id": "467281"
 *     }
 */
router.post('/', function(req, res) {
	var user = {
		email: req.body.email,
		username: req.body.username, 
		password: req.body.password
	}
	User.insert(user, function(err, user){
		if(err){
			res.status(400).json(err);
		}
		res.json(user);	
	});
});

/**
 * @api {post} /users/:id/picture Upload picture
 * @apiDescription Upload picture and associate with user profile.
 * @apiName UploadPicture
 * @apiGroup Users
 * 
 * @apiParam {String} id User id.
 * @apiParam {Object} file Picture file (multipart).
 * 
 * @apiSuccess {String} token User token
 * @apiSuccess {String} username Username
 * @apiSuccess {String} _id User id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "t0K3n",
 *       "username": "Username",
 *       "_id": "467281"
 *     }
 */
router.post('/:id/picture', 
	passport.authenticate('bearer', { session: false }),
	upload.single('file'), 
	function(req, res) {
		User.get(req.params.id, function(err, user){
			if(user.picture){
				var oldPicturePath = path.join(__dirname, '../', user.picture);
			}
			User.update(req.params.id, { picture: req.file.path }, function(err, user){
				if(oldPicturePath){
					try{
						fs.exists(oldPicturePath, function(exists) { 
							if (exists) { 
								fs.unlink(oldPicturePath);
							} 
						});
					} catch(err){
						console.log(err);
					}
				}
				res.json(user);	
			});
		});
});

/**
 * @api {get} /users/:id/picture Get picture
 * @apiDescription Get user picture by id (returns image file data).
 * @apiName GetPicture
 * @apiGroup Users
 *
 * @apiHeader {String} Authorization Authorization value (bearer token).
 * @apiHeaderExample {String} Header-Example: 
 * 		Bearer T0k3n
 */
router.get('/:id/picture',
	function(req, res) {
		passport.authenticate('bearer', { session: false }),
		User.get(req.params.id, function(err, user){
			if(user && user.picture){
				var imagePath = path.join(__dirname, '../', user.picture);
				fs.exists(imagePath, function(exists) { 
					if (exists) { 
						res.sendFile(path.join(__dirname, '../', user.picture));
					} 
					else{						
						res.sendFile(path.join(__dirname, '../public/images/user.png'));
					}
				});
			}else{
				res.sendFile(path.join(__dirname, '../public/images/user.png'));
			}
		});
});

/**
 * @api {put} /users/:id
 * @apiDescription Update user profile.
 * @apiName UpdateProfile
 * @apiGroup Users
 * 
 * @apiParam {String} id User id.
 * @apiParam {string} username Username.
 * 
 * @apiSuccess {String} token User token
 * @apiSuccess {String} username Username
 * @apiSuccess {String} _id User id
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token": "t0K3n",
 *       "username": "Username",
 *       "_id": "467281"
 *     }
 */
router.put('/:id', 
	passport.authenticate('bearer', { session: false }),
	function(req, res) {	
		var user = {
			username: req.body.username
		}
		User.update(req.params.id, req.body, function(err, user){
			res.json(user);	
		});
});

module.exports = router;