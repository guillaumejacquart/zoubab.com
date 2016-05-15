app.factory('ChatService', ['$http', '$q', function($http, $q) {  
	var messages = [];
	var users = [];
	var updateCallback;
	
	var service = {
		messages: messages,
		users: users,
		setUpdateCallback: function(callback){
			updateCallback = callback;
		}
	};
	
	var socket = io('http://localhost:3003', {'sync disconnect on unload':true});
	socket.on('connect', function () {
		socket.on('authenticated', function () {
			//Do
			socket.on('chat message', function (msg) {
				service.messages.push(msg);
				if(updateCallback){
					updateCallback();
				}
			});
			
			socket.on('connected_user', function(user){
				var elems = service.users.filter(function(u){return u._id === user._id});
				if(!elems.length){
					service.users.push(user);
				}
				if(updateCallback){
					updateCallback();
				}
			});
			
			socket.on('disconnected_user', function(user){
				var elems = service.users.filter(function(u){return u._id === user._id});
				if(elems.length){
					var index = service.users.indexOf(elems[0]);
					if(index != - 1){
						service.users.splice(index, 1);
						if(updateCallback){
							updateCallback();
						}
					}
				}
			});
		});
		socket.emit('authenticate', {token: JSON.parse(localStorage.getItem('user')).token}); // send the jwt
	})
	
	service.getMessages = function(){
		return $q(function(resolve, reject){
			$http.get('api/chats').then(function(response){
				service.messages.length = 0;
				service.messages.push.apply(service.messages, response.data.messages);
				service.users.length = 0;
				service.users.push.apply(service.users, response.data.users);
				resolve(service);
			}, function(err){
				reject(err);
			});
		});
	};
	
	service.newMessage = function(msg){		
		socket.emit('chat message', msg);
	};
	
	return service;
}]);