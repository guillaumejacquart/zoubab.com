app.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
    $('body').fadeIn(3000);
	$('#home').addClass('animated');
	var vm = this;
	
	vm.users = [];
	
	var socket = io();
	socket.on('connect', function () {
		socket.on('authenticated', function () {
			//Do
			socket.on('chat message', function (msg) {
				vm.messages.push(msg);
				if(!$scope.$$phase){			
					$scope.$apply();
				}
			});
			
			socket.on('connected_user', function(user){
				var elems = vm.users.filter(function(u){return u._id === user._id});
				if(!elems.length){
					vm.users.push(user);
					if(!$scope.$$phase){			
						$scope.$apply();
					}
				}
			});
			
			socket.on('disconnected_user', function(user){
				var elems = vm.users.filter(function(u){return u._id === user._id});
				if(elems.length){
					var index = vm.users.indexOf(elems[0]);
					if(index != - 1){
						vm.users.slice(index, 1);
						if(!$scope.$$phase){			
							$scope.$apply();
						}
					}
				}
			});
		});
		socket.emit('authenticate', {token: JSON.parse(localStorage.getItem('user')).token}); // send the jwt
	})
	
	vm.submit = function(msg){
		socket.emit('chat message', msg);
		vm.msg = '';
	};
	
	$http.get('/messages').then(function(response){
		vm.messages = response.data.messages;
		vm.users = response.data.users;
		if(!$scope.$$phase){			
			$scope.$apply();
		}
	});
}]);