/**
 * Called when the user clicks on the Login link. Sends a LogIn command to the Mobile Server.
 */
var login = function(hacerLogin) {
	
	//var username = prompt('Username');
	//var password = prompt('Password');
	
	var loginXMLMessage = generateXMLMessage({
		sequenceId: 1,
		connectionId: connect.connectionId,
		command: 'LogIn',
		inputParams: {
            Username: connect.dh.encodeString("Embarcado"),
		    Password: connect.dh.encodeString("Soriano.1180")
		}
	});
	
    // we are not interested in the successful response, so we are not providing a callback 
    sendCommandRequest(loginXMLMessage, function (response) { hacerLogin(); });
	
};