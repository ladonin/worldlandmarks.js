console.log('Compiling completed');

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

const Application = require('server/src/components/base/Application');
const RequestsPool = require('server/src/core/RequestsPool');
const SocketsPool = require('server/src/core/SocketsPool');
const DBase = require('server/src/components/base/DBase');
const Ftp = require('server/src/components/base/Ftp');
const Mailer = require('server/src/components/base/Mailer');

SocketsPool.setIO(io);

console.log('Socket is set');
io.on('connection', function (socket) {
    let _token = SocketsPool.setSocket(socket);

    socket.on('api', function (data) {
        Application.run(data, _token)
    });

    socket.on('disconnect', (reason) => {
      SocketsPool.removeSocket(socket);
    });
});

server.listen(3001);