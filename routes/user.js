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

router.post('/login',
	passport.authenticate('local', { session: false }),
	function(req, res) {
		res.json(req.user);
});

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