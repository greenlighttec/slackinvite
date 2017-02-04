$(document).ready(function() {
	function loadChannelList(results) { //pulls the list of channels from the JSON response and creates checkboxes
		$("#hiddenJSON")[0].innerHTML = results
			var a = JSON.parse(results);
			var cbh = $("#cb");
			var html = '';
			for (let i = 0, l = a.length;i<l;i++) {
				if (!a[i].is_archived) {
				//var start = i % 2 === 0 ? '<p>' : '';
				//var end = i % 2 !== 0 ? '</p>' : '';
				var htmlString = '<label for="' + a[i].id + '" class="form-check-label" style="padding-right: 10px;"><input type="checkbox" value="' + a[i].name + '" id="' + a[i].id + '" class="form-check" />' + a[i].name + '</label>';
				html += htmlString;}
			}
		cbh.html(html);
	}

	function returnSignupResults(results) { //checks the sign-up json for success or error.
		$("#hiddenRES")[0].innerHTML = results
		var obj = results
		var resSignup = $("#signUpOK")[0]
		if (obj.ok) {resSignup.style.color = "blue";resSignup.innerHTML = "Welcome! Check your email to finish sign-up and join the team ☺"}
		else if (!obj.ok) {resSignup.style.color = "red";resSignup.innerHTML = "ERROR!!! " + obj.error}
		else {resSignup.innerHTML = "Something else happened! \n" + obj}
	}

	function httpGetAsync(theUrl, callback) {
		var xmlHttp = new XMLHttpRequest();
		xmlHttp.open("GET", theUrl, true);
		xmlHttp.onreadystatechange = function() {
										if (xmlHttp.readyState == XMLHttpRequest.DONE && xmlHttp.status === 200) {
										callback(xmlHttp.responseText);}
										}
		xmlHttp.send();
	}

	$('#invite-slack').submit(function(event) {
		event.preventDefault()
		function buildCL() {
			var stringChannels;
			var checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
			for (let i = 0,l = checkboxes.length;i<l;i++) {
				stringChannels = (!stringChannels) ? stringChannels = checkboxes[i].id + ',' : stringChannels = stringChannels + checkboxes[i].id + ','
			} 
			stringChannels = (!stringChannels) ? '' : stringChannels.replace(/,\s*$/, "");
			return stringChannels
		}

		var data = { //build JSON form data to post.
			email: $('#email-address').val(),
			channels: buildCL(),
			first_name: $('#first-name').val(),
			last_name: $('#last-name').val()
		}

		$.post(('/submitInvite'), data, returnSignupResults, 'json');
		})
		
		$('#linkSubmit').click(function(event) {
			event.preventDefault()
			$('#invite-slack').submit()
		})
	httpGetAsync("/getChannels", loadChannelList);
});