// Dependencies
const http = require('http');
const url = require('url');

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

  //send response
  res.end("Hello world\n");

  //log the request
  console.log(headers);
});

server.listen(3000, () => {
  console.log("server listening now");
})
