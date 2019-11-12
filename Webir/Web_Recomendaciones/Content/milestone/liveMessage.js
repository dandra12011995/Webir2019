/**
 * Sends a LiveMessage command each several seconds to avoid disconnection. 
 */
var liveMessage = function() {
	
	// we are sending live message if we are already connected (connectionId is available)
	// for simplicity, we are hardcoding a 15 seconds interval
	setInterval(function() {
		
		if (connect.connectionId) {

			var liveMessageXMLMessage = generateXMLMessage({
				sequenceId: 1,
				connectionId: connect.connectionId,
				command: 'LiveMessage'
			});
			
			// we are not interested in the successful response, so we are not providing a callback 
			sendCommandRequest(liveMessageXMLMessage);
		}
	}, 15000);
	
};