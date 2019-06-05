/*
 * File application/express/components/base/Request.js
 *
 * Request component - access to all request data
 */

const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');

let requestData = {};
module.exports = {
    setAll(data) {
        // Only once
        if (!requestData) {
            requestData = data;
        }
    },
    get(name) {
        if (requestData.hasOwnProperty(name)) {
            return requestData[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_REQUEST_VARIABLE + ': [' + name + ']');
    }
}