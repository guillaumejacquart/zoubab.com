
var bcrypt = require('bcryptjs');
var db = require('../models/db');
var salt;

var prop = {
    salt: undefined,
    secret: 'efq78qfj;45lsRGSdaT',
    pushToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2ZmU5NjQ4Yy05YTQ1LTQ5OTEtYThkNS02YTI0ZGY4NmVmMTkifQ.dFViZ2jQlhDfBWVTHUHShJVCGAcBWPEA_TcHFMK0YRw',
    pushProfile: 'dev'
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