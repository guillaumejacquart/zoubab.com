app.factory('SocketService', ['UserStorageService', function(UserStorageService) {  
	
	var service = {};
	var hasAuthenticated = false;
	
	var socket = service.socket = io();
	
	service.authenticate = function(){
		var user = UserStorageService.getUser();
		if(user && user.token && ! hasAuthenticated){			
			socket.emit('authenticate', {token: user.token}); // send the jwt	
			hasAuthenticated = true;
		}	
	}
	
	return service;
}]);