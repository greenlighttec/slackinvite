const path = require('path'); // This requires path so we can use its join method later

const express = require('express'); // Require express so its methods can be used
const request = require('request'); //Require request library for backend calls.
const bodyParser = require('body-parser'); //Require body-parser for POST
const isemail = require('isemail'); //Require isemail for email validation
const https = require('https'); //Require HTTPS module for secure hosting
const fs = require('fs');
const port = "3000"
const app = express(); // app is the actual server created by express
const token = process.env.SLACK_INVITE_TOKEN; //place your token in this env variable, or replace with token as string.
const baseUrl = "https://slack.com/api/";
const options = {key: fs.readFileSync('cert/cert.key'),cert: fs.readFileSync('cert/cert.cert')};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getChannels', (req, res) => {
	var fullUrl = baseUrl + 'channels.list?token=' + token;
	function callback(error, respond, body) {
		var obj = JSON.parse(body)
		var channels = obj.channels
		newChannels = channels.map((currentValue) => { return {id: currentValue.id, name: currentValue.name, is_archived: currentValue.is_archived}; });
		res.send(newChannels)
		return}
	request(fullUrl, callback)

})

app.post('/submitInvite', (req, res) => {
	var fullUrl = baseUrl + 'users.admin.invite'
	var formData = req.body
	console.log(formData.email)

	function callback(err, respond, body) {
		console.log(body)
		var obj = JSON.parse(body)
		res.send(obj)
		return;}

		function validEmailCallback(result) {
		console.log(result);
		if (result > 0) {
			callback('','{"statusCode":"200"}','{"ok":false,"error":"Invalid email"}');
			console.log("FAILED TO VALIDATE. SEE NPM DOCS FOR STATUS CODE " + result)
			}
		else {
			if (!formData.channels) {callback('','{"statusCode":"200"}','{"ok":false,"error":"Please select at least 1 channel"}');return}
			formData.token = token;
			request.post(fullUrl, {form: formData}, callback)
			}
		}

	isemail.validate(formData.email, {checkDNS: true, errorLevel: true}, validEmailCallback)
})


// This runs the server and should always be last
// If the PORT env variable isn't set it uses 3000 as the port
//app.listen(process.env.PORT || 3000);
var server = https.createServer(options, app).listen(port, function(){
  console.log("Express server listening on port " + port);
});