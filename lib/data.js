// lib for storing data

// Dependencies
const fs = require('fs');
const path = require('path');

//Container
const lib = {};

//Base dir of data
lib.baseDir = path.join(__dirname, '/../data/');

//write data to a file
lib.create = (dir, file, data, callback) => {
	//Open file for writing
	fs.open(`${lib.baseDir}${dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
		if(!err && fileDescriptor) {
			//Conver data to string
			const stringData = JSON.stringify(data);

			//Write to file and close it
			fs.writeFile(fileDescriptor, stringData, (err) => {
				if(!err) {
					fs.close(fileDescriptor, (err) => {
						if(!err) {
							callback(false);
						} else {
							callback('Error closing new file');
						}
					})
				} else {
					callback('Error writing new file');
				}
			})
		} else {
			callback('Could not create new file, it may already exist');
		}
	})
}




//Export the module
module.exports = lib;
