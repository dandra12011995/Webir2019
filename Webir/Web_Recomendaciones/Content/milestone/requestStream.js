/**
 * Called when the user clicks on the Play a random camera link. Sends a RequestStream command to the Mobile Server and begins to request and parse frames over the video channel.
 */

var requestStream = function(camara, obtenerHora) {
    
	// Before opening a new stream, we should always close the previous one via the CloseStream command if we are not going to process any frames anymore
	// we do not do this here for simplicity
	
	if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
		alert('No hay cámaras para  mostrar.');
		return;
	}
	
    var cameraId = camara;
	
	var requestStreamXMLMessage = generateXMLMessage({
		sequenceId: 1,
		connectionId: connect.connectionId,
		command: 'RequestStream',
		inputParams: {
			CameraId: cameraId,
			DestWidth: 800,
			DestHeight: 600,
			MethodType: 'Pull',
			SignalType: 'Playback',
			Fps: 10,
			ComprLevel: 70,
			KeyFramesOnly: 'No'
		}
	});
	
	sendCommandRequest(requestStreamXMLMessage, function(response) {
		
		// save the videoId, so we can use it from now on to request frames
		requestStream.videoId = getVideoId(response);
        
		// begin to request frames
        requestFrames();
        obtenerHora();
        
	});
	
	function getVideoId(response) {
		return response.querySelector('OutputParams Param[Name="VideoId"]').getAttribute('Value');
	};
	
	function getRandomIntBetween(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	
};
