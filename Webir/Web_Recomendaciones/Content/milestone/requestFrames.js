/**
 * Requests, parses and displays frames for a specific videoId over the video channel.
 */
var requestFrames = function() {
	
	console.log('Requesting frames for videoId ' + requestStream.videoId);
	
	var imageElement = document.getElementById('img');
	
	var displayImage = function(frame) {
		
		if (frame && frame.imageURL) {
			imageElement.src = frame.imageURL;
		}
		sendFrameRequest(requestStream.videoId, displayImage);
	};
	
	sendFrameRequest(requestStream.videoId, displayImage);
};