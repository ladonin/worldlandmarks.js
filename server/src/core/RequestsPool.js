/*
 * File server/src/core/RequestsPool.js
 * const RequestsPool = require('server/src/core/RequestsPool');
 *
 * Request instances pool component
 * Each url request has its own collection of instances
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Config = require('server/src/settings/Config');
const Messages = require('server/src/settings/Messages');
const fs = require("fs");

let _instances_pool = {};


/*
 * Local error processor
 */
function errorProcess(errorCode, errorMessage = '', reqId = false)
{
    let _requestData = undefined;
    if (reqId) {
        _requestData = _instances_pool[reqId].request;
    }

    BaseFunctions.processError(errorCode, errorMessage, _requestData);
}


/*
 * Check request id
 *
 * @param {integer} reqId - request id
 * @param {string} errorMessage - message for adding to error message
 */
function checkReqId(reqId, errorMessage = '')
{
    if (!_instances_pool.hasOwnProperty(reqId)) {
        errorProcess(ErrorCodes.ERROR_REQUEST_ABSENT_IN_POOL,
                '!!dont use methods that use requestId in constructors!! ' + errorMessage + ': reqId[' + BaseFunctions.toString(reqId) + '], type of reqId[' + typeof (reqId) + ']');
    }
}


/*
 * Check object in request
 *
 * @param {integer} reqId - request id
 * @param {integer} objectId - object id
 * @param {string} errorMessage - message for adding to error message
 */
function checkObject(reqId, objectId, errorMessage = '')
{
    checkReqId(reqId, errorMessage);

    if (!_instances_pool[reqId].hasOwnProperty(objectId)) {
        errorProcess(ErrorCodes.ERROR_OBJECT_ABSENT_IN_REQUEST_POOL,
                errorMessage + ': objectId[' + BaseFunctions.toString(objectId) + '], type of objectId[' + typeof (objectId) + ']');
    }
}


module.exports = {
    /*
     * Create new request pool for instances
     *
     * @param {object} data - request data
     * @param {string} token - socket token of current request
     *
     * @return integer - key of object pool in which all objects (controller, models, other components) are keeped
     */
    init(data, token)
    {

        let _reqId = BaseFunctions.uniqueId();
        _instances_pool[_reqId] = {request: data, socketToken: token};
        return _reqId;
    },


    /*
     * Get copy of request data
     *
     * @param {integer} reqId - request id
     *
     * @return {object}
     */
    getRequestData(reqId)
    {
        checkReqId(reqId, 'for getRequestData');
        return BaseFunctions.clone(_instances_pool[reqId].request);
    },


    /*
     * Set prepared controller and action names for current request
     *
     * @param {integer} reqId - request id
     * @param {string} controllerName - controller name
     * @param {string} actionName - actoin name
     */
    setControllerAndActionNames(reqId, controllerName, actionName)
    {
        checkReqId(reqId, 'for setControllerAndAction');
        _instances_pool[reqId].controller = controllerName;
        _instances_pool[reqId].action = actionName;
    },


    /*
     * Get prepared controller name for current request
     *
     * @param {integer} reqId - request id
     *
     * @return {object} - controller and acion names
     */
    getControllerAndActionNames(reqId)
    {
        checkReqId(reqId, 'for getControllerAndActionNames');
        return {
            _controller:_instances_pool[reqId].controller,
            _action:_instances_pool[reqId].action
        }
    },


    /*
     * Get socket token of current request
     *
     * @param {integer} reqId - request id
     *
     * @return {string} - token
     */
    getSocketToken(reqId)
    {
        checkReqId(reqId, 'for getSocketToken');
        if (BaseFunctions.isUndefined(_instances_pool[reqId].socketToken)) {
            errorProcess(ErrorCodes.ERROR_SOCKET_TOKEN_ABSENT_IN_REQUEST_POOL, 'socket token[' + BaseFunctions.toString(_instances_pool[reqId].socketToken) + ']', reqId);
        }
        return _instances_pool[reqId].socketToken;
    },


    /*
     * Remove current request with all objects in it (usually in the end of request)
     *
     * @param {integer} reqId - request id
     */
    remove(reqId)
    {
        checkReqId(reqId, 'for clean');
        delete _instances_pool[reqId];
    },


    /*
     * Register one new object for current request
     *
     * @param {integer} reqId - request id
     * @param {object} object - object for register
     * @param {integer} objectId - object id
     */
    register(reqId, object, objectId)
    {
        let _message = 'for register object';

        checkReqId(reqId, _message);

        if (_instances_pool[reqId].hasOwnProperty(objectId)) {
            errorProcess(ErrorCodes.ERROR_POOL_INSTANCE_ALREADY_EXISTS,
                    _message + ': objectName[' + object.constructor.name + '], instanceId[' + BaseFunctions.toString(objectId) + ']', reqId);
        }
        if (!BaseFunctions.isObject(object)) {
            errorProcess(ErrorCodes.ERROR_POOL_INSTANCE_IS_NOT_OBJECT,
                    _message + ': object[' + BaseFunctions.toString(object) + '], type of object[' + typeof (object) + ']', reqId);
        }
        if (!BaseFunctions.isInteger(objectId) || !objectId) {
            errorProcess(ErrorCodes.ERROR_POOL_INSTANCE_ID_IS_WRONG,
                    _message + ': objectName[' + object.constructor.name + '], instanceId[' + BaseFunctions.toString(objectId) + '], type of instanceId[' + typeof (objectId) + ']', reqId);
        }
        //Set request id (only one time)
        if (BaseFunctions.is_not_empty(object.requestId)) {
            errorProcess(ErrorCodes.ERROR_DOUBLE_REQUEST_ID_ASSIGNMENT,
                    'first[' + BaseFunctions.toString(object.requestId) + '], second[' + BaseFunctions.toString(reqId) + ']', reqId);
        }
        object.requestId = reqId;
        _instances_pool[reqId][objectId] = object;
    },


    /*
     * Check is instance already exists or not
     *
     * @param {integer} reqId - request id
     * @param {integer} objectId - object id
     *
     * @return {boolean}
     */
    checkInstance(reqId, objectId)
    {
        checkReqId(reqId, 'check instance');
        if (!_instances_pool[reqId].hasOwnProperty(objectId)) {
            return false;
        }
        return true;
    },


    /*
     * Get current object of current request
     *
     * @param {integer} reqId - request id
     * @param {integer} objectId - object id
     *
     * @return {object}
     */
    getObject(reqId, objectId)
    {
        checkObject(reqId, objectId, 'for get object');
        return _instances_pool[reqId][objectId];
    }
};