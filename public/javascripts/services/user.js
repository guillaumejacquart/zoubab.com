app.factory('UserService', ['$http', '$q', 'UserStorageService', 'SocketService', function($http, $q, UserStorageService, SocketService) { 
	
	var service = {};
	
    service.login = function(user){
		return $q(function(resolve, reject){
			$http.post('/api/users/login', user).then(function(response){
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
			$http.post('/api/users/', user).then(function(response){
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
			$http.put('/api/users/' + user._id, user).then(function(response){
				resolve(response.data);
			}, function(error){
				reject(error);
			});
		});			
	}
	
	function setLocalUser(user){		
		UserStorageService.setUser(user);
		SocketService.authenticate();
	}
	
	return service;
}]);