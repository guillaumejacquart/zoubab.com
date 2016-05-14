
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(username, password, callback){
        
        var hash = bcrypt.hashSync(password, constants.salt);
        var doc = { 
            username: username,
            hash: hash
        };
        
        db.Users.insert(doc, function (err, newDoc) {		
            var token = jwt.sign(newDoc, constants.secret);
            if(callback){
                newDoc.token = token;
                callback(newDoc);
            }
        });
    },
    find: function(username, password, callback){        
	    var hash = bcrypt.hashSync(password, constants.salt);
        
        db.Users.findOne({ username: username, hash: hash }, function (err, user) {
            if(callback){
                callback(err, user);
            }
        });
    }
};