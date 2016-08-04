app.controller('ChatCtrl', ['$scope', 'ChatService', 'UserStorageService', function ($scope, ChatService, UserStorageService) {
    $('body').fadeIn(3000);
	$('#home').addClass('animated');
	var vm = this;
	
	vm.users = ChatService.users;
	vm.messages = ChatService.messages;
	
	$scope.$on('$routeChangeSuccess', function () { 
		vm.user = UserStorageService.getUser();
	});
	
	ChatService.setUpdateCallback(function(){
		if(!$scope.$$phase){
			$scope.$apply();
		}
	});
	
	vm.submit = function(msg){
		ChatService.newMessage(msg);
		vm.msg = '';
	};
	
	vm.getPicture = function(msg){
		return apiUrl + '/users/' + msg.userId + '/picture';
	};
	
	vm.getPictureUser = function(user){
		return apiUrl + '/users/' + user._id + '/picture';
	};
	
	vm.toggleChat = function(){
		if(vm.show){
			vm.show = false;
		}else{			
			ChatService.getMessages();
			vm.show = true;
		}
	}
}]);