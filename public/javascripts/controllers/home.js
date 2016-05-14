app.controller('HomeCtrl', ['$scope', '$http', function ($scope, $http) {
    $('body').fadeIn(3000);
	$('#home').addClass('animated');
	var vm = this;
	
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
		});
		socket.emit('authenticate', {token: JSON.parse(localStorage.getItem('user')).token}); // send the jwt
	})
	
	vm.submit = function(msg){
		socket.emit('chat message', msg);
		vm.msg = '';
	};
	
	$http.get('/messages').then(function(response){
		vm.messages = response.data;
		if(!$scope.$$phase){			
			$scope.$apply();
		}
	});
	
	socket.on('chat message', function(msg){
	});
	$scope.messages = [];
}]);