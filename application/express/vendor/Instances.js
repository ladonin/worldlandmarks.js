/*
 * File application/express/vendor/Instances.js
 * const Instances = require('application/express/vendor/Instances');
 *
 * Request instances pool component
 * Each url request has its own collection of instances
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Request = require('application/express/components/base/Request');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');

let instances_pool = {};

/*
 * Check request id
 *
 * @param integer reqId - request id
 * @param string errorMessage - message for adding to error message
 */
function checkReqId(reqId, errorMessage = '') {
    if (!instances_pool.hasOwnProperty(reqId)) {
        ErrorHandler.process(ErrorCodes.ERROR_REQUEST_ABSENT_IN_POOL,
                errorMessage + ': reqId[' + BaseFunctions.toString(reqId) + '], type of reqId[' + typeof (reqId) + ']');
    }
}

/*
 * Check object in request
 *
 * @param integer reqId - request id
 * @param integer objectId - object id
 * @param string errorMessage - message for adding to error message
 */
function checkObject(reqId, objectId, errorMessage = '') {

    checkReqId(reqId, errorMessage);

    if (!instances_pool[reqId].hasOwnProperty(objectId)) {
        ErrorHandler.process(ErrorCodes.ERROR_OBJECT_ABSENT_IN_REQUEST_POOL,
                errorMessage + ': objectId[' + BaseFunctions.toString(objectId) + '], type of objectId[' + typeof (objectId) + ']');
    }
}

module.exports = {
    /*
     * Create new request pool for instances
     *
     * @return integer - key of object pool in which all objects (controller, models, other components) are keeped
     */
    init() {
        let reqId = BaseFunctions.unique_id();
        instances_pool[reqId] = {};
        return reqId;
    },
    /*
     * Delete (clean) all objects of current request (in the end of request, before sending response)
     *
     * @param integer reqId - request id
     */
    clean(reqId) {
        checkReqId(reqId, 'for clean');
        delete instances_pool[reqId];
    },
    /*
     * Register one new object for current request
     *
     * @param integer reqId - request id
     * @param object object - object for register
     * @param integer objectId - object id
     */
    register(reqId, object, objectId) {
        let message = 'for register object';

        if (instances_pool[reqId].hasOwnProperty(objectId)) {
            ErrorHandler.process(ErrorCodes.ERROR_POOL_INSTANCE_ALREADY_EXISTS,
                message + ': objectName[' + object.constructor.name + '], instanceId[' + BaseFunctions.toString(objectId) + ']');
        }

        if (!BaseFunctions.isObject(object)) {
            ErrorHandler.process(ErrorCodes.ERROR_POOL_INSTANCE_IS_NOT_OBJECT,
                message + ': object[' + BaseFunctions.toString(object) + '], type of object[' + typeof (object) + ']');
        }
        if (!BaseFunctions.isInteger(objectId) || !objectId) {
            ErrorHandler.process(ErrorCodes.ERROR_POOL_INSTANCE_ID_IS_WRONG,
                message + ': objectName[' + object.constructor.name + '], instanceId[' + BaseFunctions.toString(objectId) + '], type of instanceId[' + typeof (objectId) + ']');
        }

        checkReqId(reqId, message);
        object.setRequestId(reqId);
        instances_pool[reqId][objectId] = object;
    },
    /*
     * Check is instance already exists or not
     *
     * @param integer reqId - request id
     * @param integer objectId - object id
     *
     * @return boolean
     */
    checkInstance(reqId, objectId){
        checkReqId(reqId, 'check instance');
        if (!instances_pool[reqId].hasOwnProperty(objectId)) {
            return false;
        }
        return true;
    },
    /*
     * Get current object of current request
     *
     * @param integer reqId - request id
     * @param integer objectId - object id
     *
     * @return object
     */
    getObject(reqId, objectId) {
        checkObject(reqId, objectId, 'for get object');
        return instances_pool[reqId][objectId];
    }
};