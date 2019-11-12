/**
 * Implementing Diffie Hellman algorithm for exchange shared key between two parties
 * 
 *  This library requires BigInt (http://www.leemon.com/crypto/BigInt.js) and 
 *  Advanced Encryption Standard library (http://crypto-js.googlecode.com/svn/tags/3.1/build/rollups/aes.js) 
 *
 * @see			http://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange
 * 
 * @author 		tvh <tvh@milestonesys.com>
 */
var DiffieHellman = function(params) {
	/**
	 * Server and client prime key
	 * 
	 * @var			string
	 * @access		private
	 */
	var primeKey = "F488FD584E49DBCD20B49DE49107366B336C380D451D0F7C88B31C7C5B2D8EF6F3C923C043F0A55B188D8EBB558CB85D38D334FD7C175743A31D186CDE33212CB52AFF3CE1B1294018118D7C84A70A72D686C40319C807297ACA950CD9969FABD00A509B0246D3083D66A45D419F9C7CBD894B221926BAABA25EC355E92F78C7";
	
	/**
	 * Converted prime key into big int
	 * 
	 * @var			array
	 * @access		private
	 */
	var primeKeyBigInt = str2bigInt(primeKey,16,1);
	
	/**
	 * Generator key
	 * 
	 * @var			array
	 * @access		private
	 */
	var generator = str2bigInt('2',10,1);
	
	/**
	 * Client specific random key
	 * 
	 * @var			array
	 * @access		private
	 */
	var randKey = randBigInt(160,0);

	/**
	 * Server public key
	 * 
	 * @var			array
	 * @access		private
	 */
	serverKey = null;
	
	/**
	 * Stores context of execution
	 * 
	 * @var			object
	 * @access		private
	 */
	var self = this;
	
	/**
	 * Convert string to byte array
	 * 
	 * @param 		str			string		String to convert to
	 * @access					private
	 * @return					array		Converted string to byte array
	 */
	var str2byteArray = function(str) {
		var result = [];
		for(var i=0; i<str.length; i=i+2)
			result.push(parseInt(str.substring(i,i+2),16));
		
		result.reverse();
		return result;
	};
	
	var fixKeyString = function(str) {
		if(str.length == 255) {
			str = '0' + str;
		}
		return str;
	};
	
	/**
	 * Generates client public key
	 * 
	 * @access					public
	 * @return					string		Base64 encoded public key
	 */
	this.createPublicKey = function() {
		var byteArrayKey = str2byteArray(fixKeyString(bigInt2str(powMod(generator,randKey,primeKeyBigInt),16)));
		byteArrayKey.push(0);
		var key = Base64.encodeArray(byteArrayKey);
		return key;
	};

	/**
	 * Decode and set server public key
	 * 
	 * @param 		str			string		Server public key
	 * @access					public
	 */
	this.setServerPublicKey = function(publicKey) {
		var decodedServerKey = Base64.decodeBinary(publicKey);

		var reversedServerKey = [];
		
		for(i=decodedServerKey.length-1; i>=0; i--)
			reversedServerKey.push(decodedServerKey[i]);
		
		serverKey = CryptoJS.enc.Base64.parse(Base64.encodeArray(reversedServerKey)).toString();
	};

	/**
	 * Return the skared key
	 * 
	 * @return					string		Shared key
	 * @access					public
	 */
	this.getSharedKey = function() {
		var secretKey = str2byteArray(fixKeyString(bigInt2str(powMod(str2bigInt(serverKey,16,1),randKey,primeKeyBigInt),16)));
		return CryptoJS.enc.Base64.parse(Base64.encodeArray(secretKey)).toString();
	};
	
	/**
	 * Encode a string using client and server public keys
	 * 
	 * @param 		str			string		String to encode
	 * @access					public
	 * @return					string		Base64 encoded encrypted string
	 */
	this.encodeString = function(str) {
		var secretString = this.getSharedKey().substring(0,96);
		
		var key = CryptoJS.enc.Hex.parse( secretString.substring(32,96) ); 
		var iv = CryptoJS.enc.Hex.parse( secretString.substring(0,32) ); 
			
		return CryptoJS.AES.encrypt(str, key, {iv: iv}).ciphertext.toString(CryptoJS.enc.Base64);
	};
};