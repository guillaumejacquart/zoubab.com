
var Datastore = require('nedb');
var path = require('path');
var constants = require('../middlewares/constants');

db = {};
db.Chat = new Datastore({filename: path.join(constants.dbPath, 'dbchat'), autoload: true});
db.Users = new Datastore({filename: path.join(constants.dbPath, 'dbusers'), autoload: true});
db.Configs = new Datastore({filename: path.join(constants.dbPath, 'dbconfigs'), autoload: true});

module.exports = {
    Chat: db.Chat,
    Users: db.Users,
    Configs: db.Configs
}