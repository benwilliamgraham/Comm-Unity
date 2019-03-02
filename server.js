var express = require("express");
var bodyParser = require("body-parser");
var Pusher = require("pusher");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var pusher = new Pusher({ appId: "726568", key: "d8769f3993afaff26999", secret:  "d3d86cac14856f0e820c", cluster: "us2" });

app.post('/message', function(req, res) {
	var message = req.body.message;
	pusher.trigger( 'communications', 'update', { message });
	res.sendStatus(200);
});

app.get('/',function(req,res){      
	res.sendFile('index.html', {root: __dirname });
});

app.use(express.static(__dirname));

function openCity(evt, cityName) {
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
	document.getElementById(cityName).style.display = "block";
	evt.currentTarget.className += " active";
  }

var port = process.env.PORT || 8000;

app.listen(port, function () {
	console.log("Active on port: " + port)
});