/*
 * File server/src/core/parents/Controller.js
 * const Controller = require('server/src/core/parents/Controller');
 *
 * Basic controller
 */

const Component = require('server/src/core/parents/Component');
const RequestsPool = require('server/src/core/RequestsPool');
const SocketsPool = require('server/src/core/SocketsPool');
const Constants = require('server/src/settings/Constants');



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
     * @param {string} - socket event name
     */
    sendbySocket(eventName = 'api') {
        let _token = RequestsPool.getSocketToken(this.requestId);
        SocketsPool.sendPrivate(_token, this.data, eventName)
    }

    /*
     * Send result to client who send this request
     *
     * @param {boolean} isBackground - whether request is background (like ajax)
     * @param {string} eventName - socket event name
     */
    sendMe(isBackground = false, eventName = 'api') {
        this.addStaticData(isBackground);
        this.sendbySocket(eventName);
    }

    /*
     * Add action data to controller's responce (data from dbase, etc)
     * Data for action component on client side
     *
     * @param {object} data - added data
     */
    addActionData(data) {
        this.data[Constants.ACTION_DATA] = {...this.data[Constants.ACTION_DATA], ...data};
    }

    /*
     * Add background data
     * Data for block component on client side (like ajax request)
     *
     * @param {object} data - added data
     */
    addBackgroundData(data) {
        this.data[Constants.BACKGROUND_DATA] = {...this.data[Constants.BACKGROUND_DATA], ...data};
    }
}
module.exports = Controller;