var exportar = function () {

    if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
        alert('No hay cámaras para  mostrar.');
        return;
    }
    var cameraId = '01d8c9f8-9a6c-4024-9e82-422eef23356b';//getAllCameras.cameras[getRandomIntBetween(0, getAllCameras.cameras.length - 1)].id;

    var exportXMLMessage = generateXMLMessage({
        sequenceId: 1,
        connectionId: connect.connectionId,
        command: 'StartExport',
        inputParams: {
            CameraId: cameraId,
            StartTime: (new Date(2018, 08, 09, 12, 52, 59)).getTime(),
            EndTime: (new Date(2018, 08, 09, 12, 53, 59)).getTime(),
            Type: 'Avi',
            PathToResults: 'C:\\'
        }
    });

    // we are not interested in the successful response, so we are not providing a callback 
    sendCommandRequest(exportXMLMessage);

};