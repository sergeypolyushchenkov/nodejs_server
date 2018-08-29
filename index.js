const http = require('http');

const server = http.createServer((req,res) => {
  res.end("Hello world\n");
});

server.listen(3000, () => {
  console.log("server listening now");
})
