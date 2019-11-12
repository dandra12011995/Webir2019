/**
 * Called when the user clicks on the Get a list of all cameras link. Sends a GetViews command to the Mobile Server, providing the All Cameras View Id.
 */
var getAllCameras = function (listaCamaras) {
	
	var getAllCamerasXMLMessage = generateXMLMessage({
		sequenceId: 1, 
		connectionId: connect.connectionId,
		command: 'GetViews',
		inputParams: {
            ViewId: 'bb16cc8f-a2c5-44f8-9d20-6e9ac57806f5' // The All Cameras View Id
		}
	});
	
	sendCommandRequest(getAllCamerasXMLMessage, function(response) {
		
		// save the cameras, so we can chose one of them and request frames
		getAllCameras.cameras = getItems(response);
		if (getAllCameras.cameras.length == 0) {
            console.log('There are no cameras associated with the current user, or you are not logged in.');
		}
        console.log('All Cameras parsed and saved for further use.', getAllCameras.cameras);
        listaCamaras();
	});
	
	// lets construct some json that represents cameras based on the server xml response
	function getItems(response) {
		
		var cameras = [];
		var cameraNodes = response.querySelectorAll('SubItems Item');
		
		for (var i = 0; i < cameraNodes.length; i++) {
			var camera = {
				name: cameraNodes[i].getAttribute('Name'),
				type: cameraNodes[i].getAttribute('Type'),
				id: cameraNodes[i].getAttribute('Id')
			};
			cameras.push(camera);
		}
		
		return cameras;
	};
	
};