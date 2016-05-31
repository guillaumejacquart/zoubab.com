app.factory('UserService', ['$http', '$q', 'UserStorageService', 'SocketService', function($http, $q, UserStorageService, SocketService) { 
	
	var service = {};
	
    service.login = function(user){
		return $q(function(resolve, reject){
			$http.post(apiUrl + '/users/login', user).then(function(response){
				if(response.status == 200){	
					setLocalUser(response.data);
					UserStorageService.setToken(response.data.token);
					service.init();
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
					UserStorageService.setToken(response.data.token);
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
					service.get();
					resolve(response.data);
				}
				else{					
					reject(response.data);
				}
			}, function(error){
				reject(error);
			});
		});	
	};
	
	service.get = function(user){
		$http.get(apiUrl + '/users/me').then(function(response){
			setLocalUser(response.data);
		}, function(err){
		});
		return UserStorageService.getUser();
	}
	
	service.init = function(){
		var token = UserStorageService.getToken();
		if(token){	
			SocketService.socket.on('connect', function () {
				SocketService.authenticate();
			});
			SocketService.Connect();
		}
	}
	
	service.logout = function(){
		UserStorageService.setUser();
		UserStorageService.setToken();
		SocketService.Disconnect();
	}
	
	function setLocalUser(user){		
		UserStorageService.setUser(user);
		SocketService.authenticate();
	}
	
	return service;
}]);