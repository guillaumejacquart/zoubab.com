
var Datastore = require('nedb');
db = {};
db.Chat = new Datastore({filename: 'dbchat', autoload: true});
db.Users = new Datastore({filename: 'dbusers', autoload: true});
db.Configs = new Datastore({filename: 'dbconfigs', autoload: true});

module.exports = {
    Chat: db.Chat,
    Users: db.Users,
    Configs: db.Configs
}