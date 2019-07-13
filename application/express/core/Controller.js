/*
 * File application/express/core/Controller.js
 * const Controller = require('application/express/core/Controller');
 *
 * Basic controller
 */

const Component = require('application/express/core/Component');
const RequestsPool = require('application/express/core/RequestsPool');
const SocketsPool = require('application/express/core/SocketsPool');







class Controller extends Component {

    constructor() {
        super();
        /*
         * Data for response
         *
         * @type object
         */
        this.data = {};

    }

    /*
     * Flush result
     *
     * @return {object}
     */
    sendbySocket(eventName = 'api') {
        let _token = RequestsPool.getSocketToken(this.requestId);
        SocketsPool.sendPrivate(_token, this.data, eventName)
    }

}
module.exports = Controller;