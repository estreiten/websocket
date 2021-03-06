const config = require('./config')
const fs = require('fs')
const protocol = config.https ? 'https' : 'http'
const http = require(protocol)
const io = require('socket.io')
const path = config.filePath

const options = config.https ? {
  key: fs.readFileSync(config.https.keyFile),
  cert: fs.readFileSync(config.https.certFile)
} : null

const server = http.createServer(options);
const socket = io(server);
server.listen(config.port);

fs.watch(path, () => {
  fs.readFile(path, {encoding: 'utf-8'}, (err, data) => {
    try {
      if (err) throw err;
      if (data === 'free') {
        socket.emit('reboot', { seconds: config.seconds });
        fs.writeFile(path, 'waiting', 'utf8', () => {})
      }
    } catch(err) {
      console.error(err)
    }
  });
})