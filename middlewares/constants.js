
var bcrypt = require('bcryptjs');
var db = require('../models/db');
var salt;

var prop = {
    salt: undefined,
    secret: 'efq78qfj;45lsRGSdaT',
    pushToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyOTgxZjdjMC04MzdhLTRjMWItYWM1ZS02ZjQ3ZTk0MWYwYzEifQ.k6snB7lW3EEWGWpaxjQ0HJVG31p7SrL4V5h2NCKP-A4',
    pushProfile: 'prod',
    facebookClientId: '191739911169580',
    facebookClientSecret: 'fe6e8f3a26419972fae81e7572ea82ff'
};

db.Configs.findOne({ key: "salt" }, function (err, doc) {
    if(doc){
        prop.salt = doc.value;
    }else{
        var newSalt = bcrypt.genSaltSync(10);
        var doc = { 
            key: "salt",
            value: newSalt
        };
        
        db.Configs.insert(doc, function (err, newDoc) {
            if(err){
                throw err;
            }
            if(!newDoc){
                throw Error("Salt ot inserted");
            }
            prop.salt = newSalt;
        });
    }
});

module.exports = prop;