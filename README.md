#### How to use

1. Modify code in index.html to customize for your own design
2. Setup the required environment variables (see BASIC LAYOUT)
3. `npm install`
4. `npm start`"# slackinviter" 

##### Basic layout

server.js: This is the node base script that powers the HTTP server.
	CONFIGURE ENV VARIABLES FOR RUN
		1. PORT = HTTP port for letsencrypt to listen to
		2. SECURE_PORT = HTTPS port for node to listen on for the primary website
		2. SLACK_INVITE_TOKEN = Slack token for API requests, needs to be an admin or owner.
		3. EMAIL_ADDRESS is used for LetsEncrypt ACME cert to register the certificate.
		4. DOMAINS is used to define the domains the certificate
		   will be securing, MAKE SURE THIS IS A UNDERSCORE DELIMINATED
		   ex. DOMAINS=domain1.com_domain2.com_domain3.com

/public: This is where the webpage gets served. Index.html refers to
	 style/main.css and scripts/frontend.js for formatting and styles.
	 
	 Customize index.html to adjust the primary form that gets displayed
	 on the inviter main page. Note that the list of channels will be
	 auto-generated from the slack team the inviter connects to via the API key.

This inviter will connect back to the Slack account using the generic API
no need to specify your slack domain at this time. The channels that are
not archived will be enumerated and created into checkboxes, so new users will
be able to select the channels that interest them prior to sign-up.
