"use strict"

//setup page globals
var requests = [];
var closedRequests = [];

var requestsDiv = d3.select("#requests").text("");
var closedRequestsDiv = d3.select("#closed").text("");

function addRequest(picture, displayName, title, description){
	var request = {
		picture: picture,
		displayName: displayName,
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
			const message = "close##" + request.title + "##" + request.description + "##" + displayName;

			$.post( "http://localhost:8000/message", { message } );
		});

	var userInfo = request.requestDiv.append("div")
		.attr("class", "userInfo");

	userInfo.append("img")
		.attr("class", "bitmoji")
		.attr("src", picture);

	userInfo.append("div")
		.attr("class", "snapId")
		.text(displayName);

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

function addClosedRequest(closer, picture, displayName, title, description){
	var request = {
		picture: picture,
		displayName: displayName,
		title: title,
		description: description,
	};

	request.requestDiv = closedRequestsDiv.append("div")
		.attr("class", "request");

	request.requestDiv.append("div")
		.attr("class", "check")
		.append("input")
		.attr("class", "completed")
		.attr("type", "button")
		.attr("value", "🗑️")
		.on("click", function(){
			const message = "del##" + request.title + "##" + request.description;

			$.post( "http://localhost:8000/message", { message } );
		});

	var userInfo = request.requestDiv.append("div")
		.attr("class", "userInfo");

	userInfo.append("img")
		.attr("class", "bitmoji")
		.attr("src", picture);

	userInfo.append("div")
		.attr("class", "snapId")
		.text(displayName);

	var message = request.requestDiv.append("div")
		.attr("class", "message");

	message.append("textarea")
		.attr("readonly","true")
		.attr("class", "title")
		.text(request.title + " - Closed By " + closer);

	message.append("textarea")
		.attr("readonly","true")
		.attr("class", "description")
		.text(request.description);

	closedRequests.push(request);
}

function closeRequest(title, description, closer){
	for(var r = 0; r < requests.length; r++){
		if(requests[r].title == title && requests[r].description == description){
			addClosedRequest(closer, requests[r].picture, requests[r].displayName, requests[r].title, requests[r].description);
			requests[r].requestDiv.remove();
			requests.splice(r, 1);
			return;
		}
	}
}

function removeRequest(title, description){
	for(var r = 0; r < closedRequests.length; r++){
		if(closedRequests[r].title == title && closedRequests[r].description == description){
			closedRequests[r].requestDiv.remove();
			closedRequests.splice(r, 1);
			return;
		}
	}
}

function openTab(evt, tabName) {
	// Declare all variables
	var i, tabcontent, tablinks;
  
	// Get all elements with class="tabcontent" and hide them
	tabcontent = document.getElementsByClassName("tabcontent");
	for (i = 0; i < tabcontent.length; i++) {
	  tabcontent[i].style.display = "none";
	}
  
	// Get all elements with class="tablinks" and remove the class "active"
	tablinks = document.getElementsByClassName("tablinks");
	for (i = 0; i < tablinks.length; i++) {
	  tablinks[i].className = tablinks[i].className.replace(" active", "");
	}
  
	// Show the current tab, and add an "active" class to the button that opened the tab
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " active";
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
		const message = "add##" + $("#picture").attr('src') + "##" +$("#displayName").html() + "##" + $("#title").val() + "##" + $("#description").val();

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
			addRequest(update[1], update[2], update[3], update[4]);
		}
		else if(update[0] == "close"){
			closeRequest(update[1], update[2], update[3]);
		}
		else{
			removeRequest(update[1], update[2]);
		}
	}
});