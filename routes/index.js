var express = require('express');
var router = express.Router();

// Type 2: Persistent datastore with manual loading
var Datastore = require('nedb')
  , db = new Datastore({ filename: 'db.data', autoload: true  });

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Zoubab' });
});

/* GET home page. */
router.get('/messages', function(req, res, next) {
	db.find({}, function (err, docs) {		
		res.json(docs);
	});
});

module.exports = function(io){	

	// socket.io events
	io.on( "connection", function( socket ){
		socket.on('chat message', function(msg){
			
			var date = new Date();
			var doc = { 
				text: msg,
				date: date               
		    };

			db.insert(doc, function (err, newDoc) {				
				io.emit('chat message', doc);
			});
			
		});
	});
	
	return router;
}