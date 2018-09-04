// Dependencies
const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

const server = http.createServer((req,res) => {
  //get url
  const parsedUrl = url.parse(req.url, true);

  //get pathname
  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  //get method
  const method = req.method.toLowerCase();

  //get headers
  const headers = req.headers;

  //get query params
  const queryParams = parsedUrl.query;

  //get payload if it exist
  const decoder = new StringDecoder('utf-8');
  let buffer = '';

  req.on('data', (data) => {
    buffer += decoder.write(data);
  })

  req.on('end', () => {
    buffer += decoder.end();

    //choose a handler
    let choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

    //constuct the data object for handler
    const data = {
      'trimmedPath': trimmedPath,
      'method': method,
      'headers': headers,
      'queryParams': queryParams,
      'payload': buffer
    }

    //route the request
    choosenHandler(data, (statusCode, payload) => {
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      payload = typeof(payload) == 'object' ? payload : {};
      let payloadString = JSON.stringify(payload);

      //send response
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);

      //log the request
      console.log(`Returning this result: ${statusCode}, ${payloadString}`);
    });
  })
});

// Start the server
server.listen(config.port, () => {
  console.log(`server listening on port ${config.port} in ${config.envName} mode now`);
})

//define the handlers
const handlers = {};

//sample handler
handlers.sample = (data, callback) => {
  //callback http status code and a payload object
  callback(406, {'name': 'sample handler'});
};

//not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

const router = {
  'sample': handlers.sample
}
