/*
 * File application/express/core/SocketsPool.js
 * const SocketsPool = require('application/express/core/SocketsPool');
 *
 * Sockets pool component - keeps all sockets
 */


const ErrorCodes = require('application/express/settings/ErrorCodes');
const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Constants = require('application/express/settings/Constants');


/*
 * Sockets pool:
 * {
 *      [token:string]: {
 *          socket: object,
 *          data: object
 *      },
 *      ...
 * }
 */
let _sockets = {};

let _socketIo = false;

const TOKEN_LENGTH = 10;



/*
 * Check token
 *
 * @param {string} token
 * @returns {boolean}
 */
function checkToken(token) {
    if (BaseFunctions.isUndefined(_sockets[token])) {
        BaseFunctions.processError(ErrorCodes.ERROR_WRONG_SOCKET_TOKEN, 'token[' + token + ']', undefined, undefined, false);
    }
}






module.exports = {

    /*
     * Set io once (when the application starts)
     *
     * @param {object} - io
     */
    setIO(io) {
        if (_socketIo === false) {
            _socketIo = io;
        } else {
            BaseFunctions.processError(ErrorCodes.ERROR_SET_SOCKET_IO_TWICE, undefined, undefined, undefined, undefined, true);
        }
    },

    /*
     * Set socket to pool (at client connection)
     *
     * @param {object} socket
     */
    setSocket(socket) {

        let _token = socket.handshake.query.token;


        _token = BaseFunctions.toString(_token);

        if (!_token || _token.length !== TOKEN_LENGTH) {
            BaseFunctions.processError(ErrorCodes.ERROR_WRONG_SOCKET_TOKEN, 'token[' + _token + ']', undefined, undefined, false, true);
        }

        if (!BaseFunctions.isUndefined(_sockets[_token])) {
            BaseFunctions.processError(ErrorCodes.ERROR_SET_SOCKET_TWICE, undefined, undefined, undefined, undefined, true);
        }

        _sockets[_token] = {
            socket: socket,
            data: {}
        };

        return _token;
    },

    /*
     * Remove socket data parameter
     *
     * @param {string} token - socket token
     * @param {string} name - data parameter name
     */
    removeSocketDataParam(token, name) {

        checkToken(token);
        delete _sockets[token].data[name];
    },

    /*
     * Remove socket from pool
     *
     * @param {string} token - socket token
     */
    removeSocket(socket) {
        let _token = socket.handshake.query.token;
        delete _sockets[_token];
        console.log('Socket removed');
    },

    /*
     * Send message to specific socket
     *
     * @param {string} token - socket token
     * @param {object} data - data to send
     * @param {string} eventName - event name
     *
     */
    sendPrivate(token, data, eventName) {

        checkToken(token);

        _sockets[token].socket.emit(eventName, data);
    },

    /*
     * Get socket data from pool
     *
     * @param {string} token - socket token
     *
     * @return mix - data parameter value
     */
    getSocketData(token) {
        checkToken(token);
        return _sockets[token].data;
    },

    /*
     * Get socket header property
     *
     * @param {string} token - socket token
     * @param {string} name - header property name
     *
     * @return mix - header property value
     */
    getSocketHeaderProp(token, name) {

        checkToken(token);
        return _sockets[token].socket.handshake.headers[name];
    },

}







