app.factory('UserService', ['$http', '$q', 'UserStorageService', 'SocketService', function($http, $q, UserStorageService, SocketService) { 
	
	var service = {};
	
    service.login = function(user){
		return $q(function(resolve, reject){
			$http.post(apiUrl + '/users/login', user).then(function(response){
				if(response.status == 200){	
					setLocalUser(response.data);
					resolve(response.data);
				}
				else{					
					reject(response.data);
				}
			}, function(error){
				reject(error);
			});
		});			
	}
	
	service.register = function(user){
		return $q(function(resolve, reject){
			$http.post(apiUrl + '/users/', user).then(function(response){
				if(response.status == 200){	
					setLocalUser(response.data);
					resolve(response.data);
				}
				else{					
					reject(response.data);
				}
			}, function(error){
				reject(error);
			});
		});			
	}
	
	service.update = function(user){
		return $q(function(resolve, reject){
			$http.put(apiUrl + '/users/' + user._id, user).then(function(response){
				if(response.status == 200){	
					setLocalUser(response.data);
					resolve(response.data);
				}
				else{					
					reject(response.data);
				}
			}, function(error){
				reject(error);
			});
		});			
	}
	
	service.init = function(){
		var user = UserStorageService.getUser();
		if(user && user.token){	
			SocketService.socket.on('connect', function () {
				SocketService.authenticate();
			});
		}
	}
	
	service.logout = function(){
		setLocalUser();
	}
	
	function setLocalUser(user){		
		UserStorageService.setUser(user);
		SocketService.authenticate();
	}
	
	return service;
}]);