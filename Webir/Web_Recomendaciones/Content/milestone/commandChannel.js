// This files defines functions used to communicate with the Mobile Server over the command channel. 

/**
 * Sends an AJAX request to the Mobile Server. Executes a specific command depending on the provided message parameter.
 * 
 * @param {String} message: the XML message for a specific command - see the SDK documentation
 * @param {Function} callback: optional, called if the Mobile Server returns a successful (Result = OK) response to this command, passing a XML object representing the response as a parameter
 * @returns
 */
var sendCommandRequest = function(message, callback) {
	
	var ajaxRequest = new XMLHttpRequest();
	ajaxRequest.open('POST', 'http://10.210.0.190:8081/XProtectMobile/Communication');
	ajaxRequest.setRequestHeader('Content-Type', 'text/xml; charset=utf-8');
	
	ajaxRequest.onreadystatechange = function() {
		if (ajaxRequest.readyState == 4) {
			if (ajaxRequest.status == 200) {
				
				console.log('Response received.', ajaxRequest.responseText);
				
				var response = parseAjaxResponse(ajaxRequest.responseText);
				if (isResponseOk(response)) {
					callback && callback(response);
				}
			} else {
				console.log('Something went wrong with the request.', ajaxRequest);
			}
		}
	};
	
	console.log('Sending XML message to the Mobile Server.', message);
	ajaxRequest.send(message);
};

/**
 * Generates the XML message that will be sent to the Mobile Server.
 * 
 * @param {Object} options: simple json describing the optional parts of the XML message; contains:
 * 		- sequenceId - mandatory, each command should contain an unique sequenceId;
 * 		- command - mandatory, the name of the command;
 * 		- connectionId - optional, only the Connect command does not require connectionId;
 * 		- inputParams - optional, simple json containing name/value parameters to fill the input parameters of the XML message
 * 			
 * @return {String} xmlData: the XML message that will be sent to the Mobile Server
 */
var generateXMLMessage = function(options) {
	
	// the <InputParams> part of the XML message
	var paramsXML = '';
	
	if (options.inputParams) {
		for (key in options.inputParams) {
			// add a new <Param> as a child of <InputParams>
			paramsXML += '<Param Name="' + key + '" Value="' + options.inputParams[key] + '" />';
		}
	}
	
	return '<?xml version=\"1.0\" encoding=\"utf-8\"?>' +
    	'<Communication xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">' +
    	(options.connectionId ? '<ConnectionId>' + options.connectionId + '</ConnectionId >': '') + 
    	'<Command SequenceId="' + options.sequenceId + '">' +
    	'<Type>Request</Type>' +
    	'<Name>' + options.command + '</Name>' +
    	'<InputParams>' + paramsXML + '</InputParams>' +
    	'</Command>' +
    	'</Communication>\r\n\r\n';
};

/**
 * Parses the response from the Mobile Server.
 * 
 * @param {String} response: XML strings returned from the Mobile Server
 * @return {Document} document: object, representing the XML structure
 */
var parseAjaxResponse = function(response) {
	
	// The Mobile Server can return many XML strings as a response. We are interested only in the last message. 
	var xmlMessages = response.split('<?xml');
	var lastXMLMessage = '<?xml' + xmlMessages[xmlMessages.length - 1];
	
	// Parse the XML response in a way you prefer the most. DOMParser is used for simplicity here.
	return new window.DOMParser().parseFromString(lastXMLMessage, "text/xml");
};

/**
 * Checks whether the response from the server is successful (contains the OK result) or has failed with some error.
 * Alerts the ErrorString or ErrorCode in the latter case.
 * 
 * @param {Document} response: the XML response from the Mobile Server
 * @return {boolean} isOk: true if the response from the Mobile Server contains no errors
 */
var isResponseOk = function(response) {
	
	var commandName = response.querySelector('Command Name').firstChild.textContent;
	var result = response.querySelector('Command Result').firstChild.textContent;
	
	if (result == 'OK') {
		console.log('Command ' + commandName + ' finished successfully.');
		return true;
	} else {
		
		console.log('Command ' + commandName + ' finished with error.');
		
		// if the response does not contain OK, it should contain ErrorString or ErrorCode
		if (response.querySelector('Command ErrorString')) {
            console.log(response.querySelector('Command ErrorString').firstChild.textContent);
		} else if (response.querySelector('Command ErrorCode')) {
            console.log('ErrorCode ' + response.querySelector('Command ErrorCode').firstChild.textContent + ' for command ' + commandName);
		}
		
		return false;
	}
};