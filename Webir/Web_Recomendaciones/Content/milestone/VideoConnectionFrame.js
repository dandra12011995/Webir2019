/**
 * This class uses the jDataView library to parse and provide information about the binary video frame. 
 * 
 * You can then read its properties and data:
 *  - imageURL - if the frame represents an image, this will be a base64 encoded image;
 *  - frameNumber - index of the frame;
 *  - timestamp - data and time of the frame (Date object);
 *  - hasSizeInformation, hasLiveInformation, hasPlaybackInformation - whether the frame has the corresponding extensions.
 *  If hasSizeInformation is set to true:
 *  	- sizeInfo - contains information about frame size and cropping.
 *  If hasLiveInformation is set to true:
 *  	- changedLiveEvents and currentLiveEvents - masks of flags. See VideoConnectionFrame.LiveFlags.
 *  If hasPlaybackInformation is set to true:
 *  	- changedPlaybackEvents and currentPlaybackEvents - masks of flags. See VideoConnectionFrame.PlaybackFlags.
 *  
 *  @param 		binary		data		Binary data represented header with all information about the frame and the frame itselft
 */
var VideoConnectionFrame = function(data) {
	
	var self = this;

	var dataView = new jDataView(data, 0, data.length, true);
	
	parseHeader(dataView, data);
	
	if (self.dataSize + self.headerSize != data.length) {
		//throw new Error('Frame header/data length incorrect');
	}
	
	if (self.dataSize > 0) {
		getImageData(dataView);
	}
	
	/**
	 * Parse frame headers
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function parseHeader (dataView) {
		var uuid = getVideoGUID(dataView);
		
		self.timestamp = parseTimeStame(dataView);
		
		self.frameNumber = dataView.getUint32();
		self.dataSize = dataView.getUint32();
		self.headerSize = dataView.getUint16();
		
		var headerExtensions = dataView.getUint16();
		
		self.hasSizeInformation = headerExtensions & VideoConnectionFrame.HeaderExtensionFlagSize;
		self.hasLiveInformation = headerExtensions & VideoConnectionFrame.HeaderExtensionFlagLive;
		self.hasPlaybackInformation = headerExtensions & VideoConnectionFrame.HeaderExtensionFlagPlayback;
		
		if (self.hasSizeInformation) {
			parseSizeInformation(dataView);
		}
		
		if (self.hasLiveInformation) {
			parseLiveInformation(dataView);
		}
		if (self.hasPlaybackInformation) {
			parsePlaybackInformation(dataView);
		}
	};
	
	/**
	 * Get video connection GUID 
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function getVideoGUID (dataView) {
		return dataView.getUUID();
	};
	
	/**
	 * Get frame timestamp in milliseconds unix timestamp  
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function parseTimeStame (dataView) {
		var tsBytes = dataView.getArray(8);
		var ts = 0;
		for (var i = 0; i < 8; i ++) {
			ts += tsBytes[i] * Math.pow(2, 8 * i);
		}
		return new Date (ts);
	};
	
	/**
	 * Get all information from header related with frame size
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function parseSizeInformation (dataView) {
		self.sizeInfo = {sourceSize: {}, sourceCrop: {}, destinationSize: {}};
		self.sizeInfo.sourceSize.width = dataView.getUint32();
		self.sizeInfo.sourceSize.height = dataView.getUint32();
		self.sizeInfo.sourceCrop.left = dataView.getUint32();
		self.sizeInfo.sourceCrop.top = dataView.getUint32();
		self.sizeInfo.sourceCrop.right = dataView.getUint32();
		self.sizeInfo.sourceCrop.bottom = dataView.getUint32();
		self.sizeInfo.sourceCrop.width = self.sizeInfo.sourceCrop.right - self.sizeInfo.sourceCrop.left;
		self.sizeInfo.sourceCrop.height = self.sizeInfo.sourceCrop.bottom - self.sizeInfo.sourceCrop.top;
		self.sizeInfo.destinationSize.width = dataView.getUint32();
		self.sizeInfo.destinationSize.height = dataView.getUint32();
		
		// Not currently used
		self.sizeInfo.destinationSize.left = dataView.getUint32();
		self.sizeInfo.destinationSize.top = dataView.getUint32();
		self.sizeInfo.destinationSize.right = dataView.getUint32();
		self.sizeInfo.destinationSize.bottom = dataView.getUint32();
	};
	
	/**
	 * Get video connection GUID 
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function parseLiveInformation (dataView) {
		self.currentLiveEvents = dataView.getUint32();
		self.changedLiveEvents = dataView.getUint32();
	};
	
	/**
	 * Get playback events information 
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function parsePlaybackInformation (dataView) {
		self.currentPlaybackEvents = dataView.getUint32();
		self.changedPlaybackEvents = dataView.getUint32();
	};
	
	/**
	 * Retrieve frame binary data and encode it using base64 algorithm  
	 * 
	 * @param		binary		dataView		Binary frame data
	 */
	function getImageData (dataView) {
		
		dataView.seek(self.headerSize);
		var darr = dataView.getArray(self.dataSize);
		
		self.imageURL = 'data:image/jpeg;base64,' + Base64.encodeArray(darr);
	};
	
	/**
	 * Class destructor
	 */
	this.destroy = function () {
		if (self.imageURL) {
			self.imageURL = null;
		}
	};
};

VideoConnectionFrame.MainHeaderLength = 36;
VideoConnectionFrame.SizeInfoHeaderLength = 32;
VideoConnectionFrame.LiveInfoHeaderLength = 8;
VideoConnectionFrame.PlaybackInfoHeaderLength = 8;

VideoConnectionFrame.HeaderExtensionFlagSize = 0x01;
VideoConnectionFrame.HeaderExtensionFlagLive = 0x02;
VideoConnectionFrame.HeaderExtensionFlagPlayback = 0x04;

VideoConnectionFrame.LiveFlags = {};
VideoConnectionFrame.LiveFlags.LiveFeed = 0x01;
VideoConnectionFrame.LiveFlags.Motion = 0x02;
VideoConnectionFrame.LiveFlags.Recording = 0x04;
VideoConnectionFrame.LiveFlags.Notification = 0x08;
VideoConnectionFrame.LiveFlags.CameraConnectionLost = 0x10;
VideoConnectionFrame.LiveFlags.DatabaseFail = 0x20;
VideoConnectionFrame.LiveFlags.DiskFull = 0x40;
VideoConnectionFrame.LiveFlags.ClientLiveStopped = 0x80;

VideoConnectionFrame.PlaybackFlags = {};
VideoConnectionFrame.PlaybackFlags.Stopped = 0x01;
VideoConnectionFrame.PlaybackFlags.Forward = 0x02;
VideoConnectionFrame.PlaybackFlags.Backward = 0x04;
VideoConnectionFrame.PlaybackFlags.DatabaseStart = 0x10;
VideoConnectionFrame.PlaybackFlags.DatabaseEnd = 0x20;
VideoConnectionFrame.PlaybackFlags.DatabaseError = 0x40;
