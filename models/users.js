
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(user, callback){        
        var hash = bcrypt.hashSync(user.email + user.password, constants.salt);
        user.isConnected = false;
        user.hash = hash;
        
        db.Users.insert(user, function (err, newDoc) {		
            var token = jwt.sign(newDoc, constants.secret);
            if(callback){
                newDoc.token = token;
                callback(newDoc);
            }
        });
    },
    find: function(email, password, callback){        
	    var hash = bcrypt.hashSync(email + password, constants.salt);
        
        db.Users.findOne({ email: email, hash: hash }, function (err, user) {
            if(callback){
                callback(err, user);
            }
        });
    },
    get: function(id, callback){        
        db.Users.findOne({ _id: id }, function (err, user) {
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
    update: function(id, user, callback){
        db.Users.update({ _id: id }, { $set: user }, { returnUpdatedDocs: true, multi: false}, function (err, numReplaced, affectedDocuments) {
            db.Users.persistence.compactDatafile();
            if(callback){
                callback(err, affectedDocuments);
            }
        });
    },
    getDeviceTokens: function(callback){
        db.Users.find({}, { device: 1 }, function (err, user) {
            if(callback){
                callback(err, user);
            }
        });
    }
};