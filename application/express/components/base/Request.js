/*
 * File application/express/components/base/Request.js
 *
 * Request component
 */

const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');

let requestData = {};
module.exports = {
    init(data) {
        // Only once
        if (!requestData) {
            requestData = data;
        }
    },

    // Use with caution!
    getRequest:()=>requestData,

    get(name) {
        if (requestData.hasOwnProperty(name)) {
            return requestData[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_REQUEST_VARIABLE, '[' + name + ']');
    }
}