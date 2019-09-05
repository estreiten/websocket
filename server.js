const fs = require('fs')
const http = require('http')
const io = require('socket.io')
const config = require('./config')
const path = config.filePath

const server = http.createServer();
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