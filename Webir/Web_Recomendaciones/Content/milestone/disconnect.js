var disconnect = function () {

    var disconnectXMLMessage = generateXMLMessage({
        sequenceId: 1, // just a random number, we are not going to track the sequenceId
        connectionId: connect.connectionId,
        command: 'Disconnect'
    });

    sendCommandRequest(disconnectXMLMessage, function (response) {
        time = fecha_multa;
        oper = 0;
    });

};