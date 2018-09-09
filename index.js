// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const _data = require('./lib/data');

//Instatiate the HTTP server
const httpServer = http.createServer((req,res) => {
  unifiedServer(req, res);
});

//Testing
// @TODO delete this
_data.delete('test', 'test', (err) => {
  console.log(`this was the error ${err}`);
})

// Start the HTTP server
httpServer.listen(config.httpPort, () => {
  console.log(`server listening on port ${config.httpPort}`);
});

//Instatiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem'),
};
const httpsServer = https.createServer(httpsServerOptions, (req,res) => {
  unifiedServer(req, res);
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log(`server listening on port ${config.httpsPort}`);
});

const unifiedServer = (req, res) => {
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
};

//define the handlers
const handlers = {};

//sample handler
handlers.ping = (data, callback) => {
  callback(200);
};

//not found handler
handlers.notFound = (data, callback) => {
  callback(404);
};

const router = {
  'ping': handlers.ping
}
