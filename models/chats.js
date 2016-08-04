
var constants = require('../middlewares/constants');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var db = require('./db');

module.exports = {
    insert: function(doc, callback){        
        doc.date= new Date();        
        db.Chat.insert(doc, function (err, newDoc) {
            if(callback){
                callback(err, newDoc);
            }
        });
    },
    find: function(callback){
        db.Chat.find({}).sort({ date: -1 }).limit(100).exec(function (err, docs) {
            if(callback){
                callback(err, docs.reverse());
            }
        });
    }
};