/*
 * File application/express/components/base/Responce.js
 * const Responce = require('application/express/components/base/Responce');
 *
 * Responce component
 */

const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');

let responceData = {};
module.exports = {
    init(data) {
        // Only once
        if (!responceData) {
            responceData = data;
        }
    },

    // Use with caution!
    getResponce:()=>responceData,

    get(name) {
        if (responceData.hasOwnProperty(name)) {
            return responceData[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_RESPONCE_VARIABLE, '[' + name + ']');
    }
}