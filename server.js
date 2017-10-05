'use strict';
const path = require('path'); // This requires path so we can use its join method later
const express = require('express'); // Require express so its methods can be used
const request = require('request'); //Require request library for backend calls.
const bodyParser = require('body-parser'); //Require body-parser for POST
const isemail = require('isemail'); //Require isemail for email validation

const token = process.env.SLACK_INVITE_TOKEN; //place your token in this env variable called SLACK_INVITE_TOKEN.
const optEmail = process.env.EMAIL_ADDRESS; //place the email address to register LE Cert to in this env variable called EMAIL_ADDRESS
const optDomains = process.env.DOMAINS; //place the list of domains to protect in a UNDERSCORE SEPARATED env variable called DOMAINS
const securePort = process.env.SECURE_PORT //place the HTTPS port to listen to in this env variable called SECURE_PORT
const unsecurePort = process.env.PORT //place the HTTP port to listen to in this env variable called PORT

const baseUrl = "https://slack.com/api/";

var lex = require('letsencrypt-express').create({
	server: 'https://acme-v01.api.letsencrypt.org/directory',
	challenges: { 'http-01': require('le-challenge-fs').create({ webrootPath: '/tmp/acme-challenges' }) },
	store: require('le-store-certbot').create({ webrootPath: '/tmp/acme-challenges' }),
	approveDomains: approveDomains});



function approveDomains(opts, certs, cb) {
  if (certs) {
    opts.domains = certs.altnames;
  }
  else {
    opts.email = optEmail;
    opts.agreeTos = true;
    opts.domains = optDomains.split('_');
  }

  cb(null, { options: opts, certs: certs });
}


require('http').createServer(
	lex.middleware(
	 require('redirect-https')(
	  {port: securePort}
	 )
	)).listen(unsecurePort,function(){console.log('Listening for ACME http-01 challenges on ', this.address());})
const app = express(); // app is the actual server created by express


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/getChannels', (req, res) => {
	var fullUrl = baseUrl + 'channels.list?token=' + token;
	function callback(error, respond, body) {
		var obj = JSON.parse(body)
		var channels = obj.channels
		var newChannels = channels.map((currentValue) => { return {id: currentValue.id, name: currentValue.name, is_archived: currentValue.is_archived}; });
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

require('https').createServer(lex.httpsOptions, lex.middleware(app)).listen(securePort,function(){console.log("Listening for ACME tls-sni-01 challenges and serve app on", this.address());})
