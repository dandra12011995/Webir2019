var speedStop = 0
var changeSpeedStop = function () {

    if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
        console.log('There are no cameras associated with the current user, you are not logged in, the LogIn command is still being processed, or you have not retrieved the list of all cameras.');
        return;
    }

    var changeStreamXMLMessageAtras = generateXMLMessage({
        sequenceId: 1,
        connectionId: connect.connectionId,
        command: 'ChangeStream',
        inputParams: {
            VideoId: requestStream.videoId,
            Speed: speedStop
        }
    });

    sendCommandRequest(changeStreamXMLMessageAtras, function (response) {
        oper = 0;
        //alert(speedini);
        //changeSpeed.speedini = getSpeedfin(response);
        //requestFrames();
    });

    /*function getSpeedfin(response) {
        return response.querySelector('OutputParams Param[Name="StartTime"]').getAttribute('Value');
    };*/

};