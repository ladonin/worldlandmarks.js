/*
 * File application/express/vendor/Controller.js
 * const Controller = require('application/express/vendor/Controller');
 *
 * Basic controller
 */

const Component = require('application/express/vendor/Component');
const RequestsPool = require('application/express/vendor/RequestsPool');
const SocketsPool = require('application/express/vendor/SocketsPool');







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
     * @return object
     */
    sendbySocket(eventName = 'api') {
        let _token = RequestsPool.getSocketToken(this.requestId);
        SocketsPool.sendPrivate(_token, this.data, eventName)
    }

}
module.exports = Controller;