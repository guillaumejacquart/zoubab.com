app.factory('SocketService', ['UserStorageService', function(UserStorageService) {  
	
	var service = {};
	var hasAuthenticated = false;
	
	var socket = service.socket = io();
	
	service.authenticate = function(){
		var user = UserStorageService.getUser();
		if(user && user.token && !hasAuthenticated){			
			socket.emit('authenticate', {token: user.token}); // send the jwt	
			hasAuthenticated = true;
		}	
	}
	
	service.Connect = function(){		
		if(!socket.connected){
			socket.connect();
		}
	}
	
	service.Disconnect = function(){		
		if(socket.connected){
			socket.disconnect();
			hasAuthenticated = false;
		}
	}
	
	return service;
}]);