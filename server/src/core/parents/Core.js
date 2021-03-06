/*
 * File server/src/core/parents/Core.js
 * const Core = require('server/src/core/parents/Core');
 *
 * Base component
 * Available validation rules see in 'server/src/core/parents/Model.js'
 */

const RequestsPool = require('server/src/core/RequestsPool');
const Consts = require('server/src/settings/Constants');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const SocketsPool = require('server/src/core/SocketsPool');

class Core
{

    constructor()
    {
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
    static getInstance(reqId)
    {
        let _instanceId = this.instanceId;
        if (RequestsPool.checkInstance(reqId, _instanceId) === false) {
            RequestsPool.register(reqId, new this(), _instanceId);
        }
        return RequestsPool.getObject(reqId, _instanceId);
    }


    /*
     * Get request data in object or string type
     *
     * @param {boolean} string - return the data either in string or object type
     *
     * @return {object} - copy of request query data {name1:value1, name2:value2}
     */
    getRequestData(string = false)
    {
        let _data = BaseFunctions.clone(RequestsPool.getRequestData(this.requestId));
        return string === true ? BaseFunctions.toString(_data) : _data
    }


    /*
     * Get socket data from pool
     *
     * @return {object}
     */
    getSocketData()
    {
        return SocketsPool.getSocketData(RequestsPool.getSocketToken(this.requestId));
    }


    /*
     * Remove socket data parameter
     *
     * @param {string} name - data parameter name
     */
    removeSocketDataParameter(name)
    {
        SocketsPool.removeSocketDataParam(RequestsPool.getSocketToken(this.requestId), name);
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
    error(errorCode, message = '', log_type = Consts.LOG_APPLICATION_TYPE, writeToLog = true)
    {
        BaseFunctions.processError(errorCode, message, RequestsPool.getRequestData(this.requestId), log_type, writeToLog);
    }


    /*
     * Get variable from request
     *
     * @param {string} name -  variable name
     * @param {boolean} required - wherher value should be required
     *
     * @return {mix} - value of specific query variable
     */
    getFromRequest(name, required = true)
    {
        let _data = RequestsPool.getRequestData(this.requestId);
        if (_data.hasOwnProperty(name)) {
            return _data[name];
        } else if (required === false) {
            return undefined;
        } else {
            this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, '[' + name + ']', undefined, false);
        }
    }


    /*
     * Get form data from request
     *
     * @param {boolean} required - wherher value should be required
     *
     * @return {object}
     */
    getRequestFormData(required = false)
    {
        let _result = this.getFromRequest(Consts.REQUEST_FORM_DATA, required);
        return _result ? _result : {};
    }


    /*
     * Determine device type - desctop or mobile
     *
     * @return {boolean}
     */
    isMobile()
    {
        return this.getFromRequest(Consts.ISMOBILE_CODE_VAR_NAME);
    }


    /*
     * Determine whether page is 'map'
     *
     * @return {boolean}
     */
    isMapPage()
    {
        return this.getFromRequest(Consts.CONTROLLER_VAR_NAME) === Consts.CONTROLLER_NAME_MAP;
    }


    /*
     * Return device type - mobile or desctop
     *
     * @return {string}
     */
    getDeviceType()
    {
        return this.getFromRequest(Consts.ISMOBILE_CODE_VAR_NAME) ? Consts.MOBILE : Consts.DESCTOP;
    }


    /*
     * Return controller name
     *
     * @return {string}
     */
    getControllerName()
    {
        return this.getFromRequest(Consts.CONTROLLER_VAR_NAME);
    }


    /*
     * Return action name
     *
     * @return {string}
     */
    getActionName()
    {
        return this.getFromRequest(Consts.ACTION_VAR_NAME);
    }


    /*
     * Return a value with guarantee it is not empty
     *
     * @param {string/number/float} value
     *
     * @return {string}
     */
    passThrough(value)
    {
        return BaseFunctions.passThrough(value, this);
    }

}

module.exports = Core;