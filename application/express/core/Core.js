/*
 * File application/express/core/Core.js
 * const Core = require('application/express/core/Core');
 *
 * Base component
 * Available validation rules see in 'application/express/core/Model.js'
 */

const RequestsPool = require('application/express/core/RequestsPool');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const ErrorCodes = require('application/express/settings/ErrorCodes');


class Core {

    constructor() {
        /*
         * Request id for instances pool
         *
         * @type {integer}
         */
        this.requestId;
    }

    /*
     * Get object from pool
     * If absent - create and return
     * NOTE: this.instanceId - is a static property of a class inheriting Component
     *
     * @param {integer} reqId - request id
     *
     * @returns {object} - instance of requested class
     */
    static getInstance(reqId) {
        let _instanceId = this.instanceId;
        if (RequestsPool.checkInstance(reqId, _instanceId) === false) {
            RequestsPool.register(reqId, new this(), _instanceId);
        }
        return RequestsPool.getObject(reqId, _instanceId);
    }

    /*
     * @return {object} - copy of request query data {name1:value1, name2:value2}
     */
    getData() {
        let _data = RequestsPool.getRequestData(this.requestId);
        return BaseFunctions.clone(_data)
    }

    /*
     * @return {string} - string presentation of request object
     */
    getStringData() {
        return BaseFunctions.toString(this.getData());
    }




    /*
     * Call error with request url in message
     *
     * @param {object} errorCode - error data {code, name}
     * @param {string} message - error message
     * @param {string} log_type - type of error (application or db) - where error log will be saved
     * @param {boolean} writeToLog - some errors must not be written to log to avoid error spaming
     *
     */
    error(errorCode, message = '', log_type = Consts.LOG_APPLICATION_TYPE, writeToLog = true) {
        BaseFunctions.processError(errorCode, message, RequestsPool.getRequestData(this.requestId), log_type, writeToLog);
    }


    /*
     * Get variable from request
     *
     * @param {string} name -  variable name
     * @param {boolean} required - is value should not be required (not empty)?
     *
     * @return {string} - value of specific query variable
     */
    getFromRequest(name, required = true) {
        let _data = RequestsPool.getRequestData(this.requestId);
        if (_data.hasOwnProperty(name)) {
            return BaseFunctions.toString(_data[name]);
        } else if (required === false) {
            return undefined;
        } else {
            this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, '[' + name + ']');
        }
    }
}

module.exports = Core;