$(document).ready(function(){
	//connect to the node server
	var pusher = new Pusher('d8769f3993afaff26999', {
		cluster: 'us2',
		encrypted: false
	});

	//create chat channel
	let channel = pusher.subscribe('public-chat');
	
	channel.bind('message-added', onMessageAdded);

	//add send button
	$('#send').click(function(){
		const message = $("#message").val();

		//clear message box
		$("#message").val("");

		//send message
		$.post( "http://localhost:8000/message", { message } );
	});

	//on new message received
	function onMessageAdded(data) {
		$("#chat").append(data.message + "<br>");
	}
});