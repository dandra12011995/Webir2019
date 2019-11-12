/**
 * Sends an AJAX request to the Mobile Server over the video channel to request a frame for a specific stream.
 * 
 * @param {String} videoId: videoId that has been previously returned from the RequestStream command
 * @param {Function} callback: called if the Mobile Server successfully returns a base64 encoded frame and the browser is able to decode it, passing a VideoConnectionFrame instance
 */
var sendFrameRequest = function(videoId, callback) {
	
	var ajaxRequest = new XMLHttpRequest();
    ajaxRequest.open('POST', 'http://10.210.0.190:8081/XProtectMobile/Video/' + videoId + '/');
	ajaxRequest.responseType = "arraybuffer";
	ajaxRequest.setRequestHeader("Content-type", "text/xml; charset=utf-8");
	
	ajaxRequest.onreadystatechange = function(response) {
		
		if (ajaxRequest.readyState == 4) {
			if (ajaxRequest.status == 200) {
				
				if (ajaxRequest.response) {
					// modern browsers
					var response = ajaxRequest.response;
				} else if ('responseBody' in ajaxRequest) {
					// InternetExplorer - use jDataView lib to parse the response
					var response = convertResponseBodyToText(ajaxRequest.responseBody);
				} 
				
				if (!response || response.length === 0 || response.byteLength === 0) {
					return;
				}
				
				var frame = new VideoConnectionFrame(response);
				callback(frame);
				
			} else {
				console.log('Something went wrong with the request.', ajaxRequest);
			}
		}
	};
	
	ajaxRequest.send();
};