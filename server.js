var express = require("express");
var bodyParser = require("body-parser");
var Pusher = require("pusher");
const Chatkit = require('@pusher/chatkit-server');

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

var pusher = new Pusher({ appId: "726568", key: "d8769f3993afaff26999", secret:  "d3d86cac14856f0e820c", cluster: "us2" });

const chatkit = new Chatkit.default({
	instanceLocator: 'v1:us1:89d3c02a-7a0c-46df-935f-e5e98a5f69e6',
	key: '5dfb3a8b-de47-4916-b7db-68649cfd4539:xxHdfamprG/SfAYC43fCcFUTuPPLHrU1F0vztbmZ3yQ=',
  });
  
  app.use(
	bodyParser.urlencoded({
	  extended: false,
	})
  );
  app.use(bodyParser.json());
  //app.use(cors());
  
  app.post('/users', (req, res) => {
	const { username } = req.body;
  
	chatkit
	  .createUser({
		id: username,
		name: username,
	  })
	  .then(() => {
		res.sendStatus(201);
	  })
	  .catch(err => {
		if (err.error === 'services/chatkit/user_already_exists') {
		  console.log(`User already exists: ${username}`);
		  res.sendStatus(200);
		} else {
		  res.status(err.status).json(err);
		}
	  });
  });
  
  app.post('/authenticate', (req, res) => {
	const authData = chatkit.authenticate({
	  userId: req.query.user_id,
	});
	res.status(authData.status).send(authData.body);
  });

app.post('/message', function(req, res) {
	var message = req.body.message;
	pusher.trigger( 'communications', 'update', { message });
	res.sendStatus(200);
});

app.get('/',function(req,res){      
	res.sendFile('index.html', {root: __dirname });
});

app.use(express.static(__dirname));

var port = process.env.PORT || 3001;

app.listen(port, function () {
	console.log("Active on port: " + port)
});