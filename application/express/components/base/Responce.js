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
    init(res) {
        responceData = res;
    },

    getResponce() {
        return responceData;
    },

    get(name) {
        if (responceData.hasOwnProperty(name)) {
            return responceData[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_RESPONCE_VARIABLE, '[' + name + ']');
    },
    
    sendJson(json){
        responceData.json(json);
    }
}