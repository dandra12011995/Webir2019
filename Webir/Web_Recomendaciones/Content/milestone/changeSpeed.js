/**
 * Called when the user clicks on the Speed +1 link. Sends a ChangeStream command to the Mobile Server and continues to request and parse frames over the video channel.
 */
speedfin = 0

var changeSpeed = function() {
	
	if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
        console.log('There are no cameras associated with the current user, you are not logged in, the LogIn command is still being processed, or you have not retrieved the list of all cameras.');
		return;
	}

    var time = new Date().getTime();
    var date = new Date(time);
	
	var changeStreamXMLMessageAdelante = generateXMLMessage({
		sequenceId: 1,
		connectionId: connect.connectionId,
		command: 'ChangeStream',
		inputParams: {
			VideoId: requestStream.videoId,
            Speed: speedfin + 1
		}
	});
	
    sendCommandRequest(changeStreamXMLMessageAdelante, function (response) {
        oper = 1;
        //alert(speedfin);
        //changeSpeed.speedfin = getSpeedini(response);
		//requestFrames();
    });

   /* function getSpeedini(response) {
        return response.querySelector('OutputParams Param[Name="EndTime"]').getAttribute('Value');
    };*/
	
};
