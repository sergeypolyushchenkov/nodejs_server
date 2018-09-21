// lib for storing data

// Dependencies
const fs = require('fs');
const path = require('path');
const helpers = require('./helpers');

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
					});
				} else {
					callback('Error writing new file');
				}
			});
		} else {
			callback('Could not create new file, it may already exist');
		}
	});
};

//Read data from a file
lib.read = (dir, file, callback) => {
	fs.readFile(`${lib.baseDir}${dir}/${file}.json`, 'utf8', (err, data) => {
		if(!err && data) {
			const parsedData = helpers.parseJsonToObject(data);
			callback(false, parsedData);
		} else {
			callback(err, data);
		}
	});
};

//Update existing file
lib.update = (dir, file, data, callback) => {
	//open a file
	fs.open(`${lib.baseDir}${dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
		if(!err && fileDescriptor) {
			//Conver data to string
			const stringData = JSON.stringify(data);

			// Truncate the file
			fs.truncate(fileDescriptor, (err) => {
				if(!err) {
					// Write to the file and close it
					fs.writeFile(fileDescriptor, stringData, (err) => {
						if(!err) {
							fs.close(fileDescriptor, (err) => {
								if(!err) {
									callback(false);
								} else {
									callback('Error closing file');
								}
							});
						} else {
							callback('Error writing existing file');
						}
					});
				} else {
					callback('Error truncating file');
				}
			});
		} else {
			callback('Could not open the file for updating');
		}
	});
};

// Delete a file
lib.delete = (dir, file, callback) => {
	// Unlink the file
	fs.unlink(`${lib.baseDir}${dir}/${file}.json`, (err) => {
		if(!err) {
			callback(false);
		} else {
			callback('Error deleting file');
		}
	});
};

//Export the module
module.exports = lib;
