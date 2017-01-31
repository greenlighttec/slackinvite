#### How to use

1. Modify code
2. `npm install`
3. `npm start`"# slackinviter" 

##### Basic layout

server.js: This is the node base script that powers the HTTP server.
	CONFIGURE ENV VARIABLES FOR RUN
		1. PORT = HTTP port for node to run on
		2. SLACK_INVITE_TOKEN = Slack token for API requests,
		   needs to be an admin or owner.

/public: This is where the webpage gets served. Index.html refers to
	 style/main.css and scripts/frontend.js 

This inviter will connect back to the Slack account using the generic API
no need to specify your slack domain at this time. The channels that are
not archived will be enumerated and created into checkboxes, so new users will
be able to select the channels that interest them prior to sign-up.
