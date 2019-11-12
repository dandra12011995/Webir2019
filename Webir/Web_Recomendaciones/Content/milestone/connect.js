/**
 * Called when the user clicks on the Connect link. Sends a Connect command to the Mobile Server.
 * Saves the connectionId returned from the server in connect.connectionId.
 */
var connect = function (hacerConnect) {
	
	connect.dh = new DiffieHellman();
	
	var connectXMLMessage = generateXMLMessage({
		sequenceId: 1, // just a random number, we are not going to track the sequenceId
		command: 'Connect',
		inputParams: {
			ProcessingMessage: 'No',
			PublicKey: connect.dh.createPublicKey()
		}
	});
	
	sendCommandRequest(connectXMLMessage, function(response) {
		// save the connectionId, so we can use it from now on
		connect.connectionId = getConnectionId(response);
		// set the shared key that is used to encrypt sensitive data
        connect.dh.setServerPublicKey(getPublicKey(response));
        hacerConnect();
	});
	
	function getConnectionId(response) {
		return response.querySelector('OutputParams Param[Name="ConnectionId"]').getAttribute('Value');
	};
	
	function getPublicKey(response) {
		return response.querySelector('OutputParams Param[Name="PublicKey"]').getAttribute('Value');
	};
	
};