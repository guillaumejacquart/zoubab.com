$(document).ready(function(){
	Vue.config.delimiters = ['${', '}']
	
	$('body').fadeIn(3000);
	$('#home').addClass('animated');
	var socket = io();
	
	$('form').submit(function(){
		socket.emit('chat message', $('#m').val());
		$('#m').val('');
		return false;
	});
	
	$.get('/messages', function(data){
		vm.messages = data;
	});
	
	socket.on('chat message', function(msg){
		vm.messages.push(msg);
	});
	

	var vm = new Vue({
	  el: '#messages',
	  data: {
		messages: []
	  },
	  filters: {
		  moment: function (date) {
			return moment(date).format('DD-MM-YYYY h:mm:ss');
		  }
	  }
	})
});