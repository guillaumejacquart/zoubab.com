
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(username, msg, callback){
        
        var doc = { 
            username: username,
            msg: msg,
            date: new Date()
        };
        
        db.Chat.insert(doc, function (err, newDoc) {
            if(callback){
                callback(err, newDoc);
            }
        });
    },
    find: function(callback){
        db.Chat.find({}, function (err, docs) {
            if(callback){
                callback(err, docs);
            }
        });
    }
};