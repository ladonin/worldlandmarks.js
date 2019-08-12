/*
 * File application/express/core/parents/Controller.js
 * const Controller = require('application/express/core/parents/Controller');
 *
 * Basic controller
 */

const Component = require('application/express/core/parents/Component');
const RequestsPool = require('application/express/core/RequestsPool');
const SocketsPool = require('application/express/core/SocketsPool');
const Constants = require('application/express/settings/Constants');



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
     * Flush result
     *
     * @param {string} actionName - controller action name
     * @param {string} eventName - socket event name
     */
    sendMe(actionName = null, eventName = 'api') {
        if (actionName) {
            this.addStaticText(actionName);
        }
        this.sendbySocket(eventName);
    }

    /*
     * Add dynamic data to controller's responce (data from dbase, etc)
     *
     * @param {object} data - added data
     */
    addDynamicData(data) {
        this.data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT] = {...this.data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT], ...data};
    }









}
module.exports = Controller;