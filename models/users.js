
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(user, callback){        
        var hash = bcrypt.hashSync(user.email + user.password, constants.salt);
        user.isConnected = false;
        user.hash = hash;
        delete user.password;
        
        db.Users.findOne({$or: [{ email: user.email }, { username: user.username }]}, function (err, exists) {
            if(exists){
                callback('a user with this email or username already exists !');
                return;
            }else{
                db.Users.insert(user, function (err, newDoc) {	
                    if(err){      
                        if(callback){                  
                            callback(err);
                        }
                        return;
                    }	
                    var token = jwt.sign(newDoc, constants.secret);
                    if(callback){
                        newDoc.token = token;
                        callback(err, newDoc);
                    }
                });
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
    findOrCreateFacebook: function(profile, callback){        
        db.Users.findOne({ facebookId: profile.id }, function (err, user) {
            if(user){                
                if(callback){
                    callback(err, user);
                }
            }
            else{
                var user = {
                    username: profile.displayName,
                    email: profile.email,
                    pictureUrl: profile.photos[0].value,
                    facebookId: profile.id
                };
                
                db.Users.insert(user, function (err, newDoc) {	
                    if(err){      
                        if(callback){                  
                            callback(err);
                        }
                        return;
                    }	
                    var token = jwt.sign(newDoc, constants.secret);
                    if(callback){
                        newDoc.token = token;
                        callback(err, newDoc);
                    }
                });
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
        db.Users.find({ isConnected: true }, {token: 0, picture: 0, password:0, hash: 0}, function (err, user) {
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
        db.Users.find({}, { deviceToken: 1 }, function (err, tokens) {
            if(callback){
                callback(err, tokens);
            }
        });
    }
};