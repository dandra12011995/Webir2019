var NextFrame = function () {

    if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
        console.log('There are no cameras associated with the current user, you are not logged in, the LogIn command is still being processed, or you have not retrieved the list of all cameras.');
        return;
    }

    //var hora = prompt('Fecha');
    //var time = Date(fecha);
    //var date = time.getTime();
    var changeStreamXMLMessage = generateXMLMessage({
        sequenceId: 1,
        connectionId: connect.connectionId,
        command: 'ChangeStream',
        inputParams: {
            VideoId: requestStream.videoId,
            SeekType: "NextFrame"
        }
    });

    sendCommandRequest(changeStreamXMLMessage, function (response) {

        requestFrames();
        //mostrarBotones();
    });

};