"use strict"

//setup page globals
var requests = [];

var requestsDiv = d3.select("#requests").text("");

function addRequest(request){
	request = {
		value: request
	};

	request.requestDiv = requestsDiv.append("div")
		.attr("class", "request");

	request.requestDiv.append("div")
		.attr("class", "check")
		.append("input")
		.attr("class", "completed")
		.attr("type", "button")
		.attr("value", "✔️")
		.on("click", function(){
			const message = "del##" + request.value;

			$.post( "http://localhost:8000/message", { message } );
		});

	var userInfo = request.requestDiv.append("div")
		.attr("class", "userInfo");

	userInfo.append("img")
		.attr("class", "bitmoji")
		.attr("src", "temp.png");

	userInfo.append("div")
		.attr("class", "snapId")
		.text("snapId");

	var message = request.requestDiv.append("div")
		.attr("class", "message");

	message.append("div")
		.attr("class", "title")
		.text("Title");

	message.append("div")
		.attr("class", "details")
		.text(request.value);

	requests.push(request);
}

function removeRequest(request){
	for(var r = 0; r < requests.length; r++){
		if(requests[r].value == request){
			requests[r].requestDiv.remove();
			requests.splice(r, 1);
			return;
		}
	}
}

//action page
$(document).ready(function(){
	//connect to the node server
	var pusher = new Pusher("d8769f3993afaff26999", {
		cluster: "us2",
		encrypted: false
	});

	//create chat channel
	let channel = pusher.subscribe("communications");
	
	channel.bind("update", onUpdate);

	//add send button
	$('#send').click(function(){
		const message = "add##" + $("#message").val();

		//clear message box
		$("#message").val("");

		//send message
		$.post( "http://localhost:8000/message", { message } );
	});

	//on new message received
	function onUpdate(data) {
		var update = data.message.split("##");
		if (update[0] == "add"){
			addRequest(update[1]);
		}
		else{
			removeRequest(update[1]);
		}
	}
});