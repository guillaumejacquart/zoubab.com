app.controller('ChatCtrl', ['$scope', 'ChatService', function ($scope, ChatService) {
    $('body').fadeIn(3000);
	$('#home').addClass('animated');
	var vm = this;
	
	vm.users = ChatService.users;
	vm.messages = ChatService.messages;
	
	ChatService.setUpdateCallback(function(){
		if(!$scope.$$phase){
			$scope.$apply();
		}
	});
	ChatService.getMessages();
	
	vm.submit = function(msg){
		ChatService.newMessage(msg);
		vm.msg = '';
	};
}]);