app.factory('UserService', ['$http', '$q', function($http, $q) {  
    var login = function(user){
		return $q(function(resolve, reject){
			$http.post('/api/users/login', user).then(function(response){
				if(response.status == 200){					
					localStorage.setItem('user', JSON.stringify(response.data));
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
	
	var register = function(user){
		return $q(function(resolve, reject){
			$http.post('/api/users/', user).then(function(response){
				localStorage.setItem('user', JSON.stringify(response.data));
				resolve(response.data);
			}, function(error){
				reject(error);
			});
		});			
	}
	
	return {
		login: login,
		register: register
	};
}]);