"use strict"

//setup page globals
var requests = [];

var requestsDiv = d3.select("#requests").text("");

function addRequest(title, description){
	var request = {
		title: title,
		description: description
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
			const message = "del##" + request.title + "##" + request.description;

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

	message.append("textarea")
		.attr("readonly","true")
		.attr("class", "title")
		.text(request.title);

	message.append("textarea")
		.attr("readonly","true")
		.attr("class", "description")
		.text(request.description);

	requests.push(request);
}

function removeRequest(title, description){
	for(var r = 0; r < requests.length; r++){
		if(requests[r].title == title && requests[r].description == description){
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
	$('#post').click(function(){
		const message = "add##" + $("#title").val() + "##" + $("#description").val();

		//clear message box
		$("#title").val("");
		$("#description").val("");

		//send message
		$.post( "http://localhost:8000/message", { message } );
	});

	//on new message received
	function onUpdate(data) {
		var update = data.message.split("##");
		if (update[0] == "add"){
			addRequest(update[1], update[2]);
		}
		else{
			removeRequest(update[1], update[2]);
		}
	}
});