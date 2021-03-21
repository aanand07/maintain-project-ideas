const http = require('http')
const fs = require('fs')
const port = process.env.PORT || 3100;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'content-type': 'text/html' })
  fs.createReadStream('home.html').pipe(res)
})

server.listen(port);

console.log(`Server listening on port ${port}`);