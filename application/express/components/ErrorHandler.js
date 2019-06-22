/*
 * File application/express/components/ErrorHandler.js
 * const ErrorHandler = require('application/express/components/ErrorHandler');
 *
 * Error processor
 */
const fs = require("fs");
const ErrorCodes = require('application/settings/express/ErrorCodes');
const GetDate = require('modules/express/base_functions/BaseFunctions').getDate;
const Consts = require('application/express/settings/Constants');
const Messages = require('application/settings/express/Messages');
const Config = require('application/express/settings/Config');

let _errorCode = '';
let _logMessage = '';

module.exports = {
    process(errorCode, message = '', log_type = Consts.LOG_APPLICATION_TYPE) {

        _errorCode = errorCode;

        message = errorCode + ': ' + message;

        // Add stack trace
        let trace = new Error().stack;
        // Crop unnecessary lines
        trace = trace.replace(/at Module\._compile(?:.*?[\n\r]?)*/i,'');
        _logMessage = '#####' + GetDate() + ':  ' + message + "\r\n" + trace + "\r\n\r\n\r\n";

        // If debug is turned off then write error messages into file, otherwise show them in browser
        if (Config.debug === 0) {
            let filename = 'error.log';
            if (log_type === Consts.LOG_MYSQL_TYPE) {
                filename = 'db.log';
            }
            fs.appendFileSync("log/" + filename, _logMessage);
        }


        throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    },
    getErrorCode(){
        return _errorCode;
    },
    getLogMessage(){
        return _logMessage;
    },
    reset(){
        _errorCode = '';
        _logMessage = '';
    }
};