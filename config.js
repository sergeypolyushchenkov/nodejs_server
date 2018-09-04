// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
	'port': 3000,
	'envName': 'staging'
};

// Production environment
environments.production = {
	'port': 5000,
	'envName': 'production'
};

// Get passed environment
const currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check envoronment exist above
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
