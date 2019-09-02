import io from 'socket.io-client'

var socket = io('http://localhost:3000')
socket.on('reboot', function (data) {
  console.log(data)
})