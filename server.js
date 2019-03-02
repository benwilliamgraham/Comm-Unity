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

var port = process.env.PORT || 8000;

app.listen(port, function () {
	console.log("Active on port: " + port)
});