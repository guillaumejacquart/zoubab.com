
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(username, password, callback){
        
        var hash = bcrypt.hashSync(username + password, constants.salt);
        var doc = { 
            username: username,
            hash: hash, 
            isConnected: false
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
	    var hash = bcrypt.hashSync(username + password, constants.salt);
        
        db.Users.findOne({ username: username, hash: hash }, function (err, user) {
            if(callback){
                callback(err, user);
            }
        });
    },
    findConnected: function(callback){        
        db.Users.find({ isConnected: true }, function (err, user) {
            if(callback){
                callback(err, user);
            }
        });
    },
    update: function(username, isConnected, callback){
        db.Users.update({ username: username }, { $set: { isConnected: isConnected } }, { multi: true, upsert: false }, function (err, numReplaced) {
            db.Users.persistence.compactDatafile();
            if(callback){
                callback(err);
            }
        });
    }
};