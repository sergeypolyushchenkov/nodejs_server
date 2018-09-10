// Helpers for various tasks

// Dependencies
const crypto = require('crypto');
const config = require('./config');

// Container for all helpers
const helpers = {};

// create a SHA256 hash
helpers.hash = (str) => {
	if(typeof(str) == 'string' && str.length > 0) {
		const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
		return hash;
	} else {
		return false;
	}
};

// parse JSON to object
helpers.parseJsonToObject = (str) => {
	try {
		const obj = JSON.parse(str);
		return obj;
	} catch(e) {
		return {};
	}
};


// Export module
module.exports = helpers;
