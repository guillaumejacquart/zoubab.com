app.factory('SocketService', ['UserStorageService', function(UserStorageService) {  
	
	var service = {};
	
	var socket = service.socket = io();
	
	socket.on('connect', function () {
		service.authenticate();
	})
	
	service.authenticate = function(){
		var user = UserStorageService.getUser();
		if(user && user.token){			
			socket.emit('authenticate', {token: user.token}); // send the jwt	
		}	
	}
	
	return service;
}]);