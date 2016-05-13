var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Zoubab' });
});

module.exports = function(io){	

	// socket.io events
	io.on( "connection", function( socket ){
		socket.on('chat message', function(msg){
			io.emit('chat message', msg);
		});
	});
	
	return router;
}