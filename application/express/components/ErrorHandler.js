/*
 * File application/express/components/ErrorHandler.js
 * const ErrorHandler = require('application/express/components/ErrorHandler');
 *
 * Error processor
 */
const fs = require("fs");
const ErrorCodes = require('application/settings/express/ErrorCodes');
const GetDate = require('application/express/functions/BaseFunctions').getDate;
const Consts = require('application/express/settings/Constants');
const Messages = require('application/settings/express/Messages');
const Config = require('application/express/settings/Config');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Component = require('application/express/vendor/Component');






class ErrorHandler extends Component {

    constructor(){
        super();
        this._errorCode = '';
        this._logMessage = '';
    }



    process(errorCode, message = '', log_type = Consts.LOG_APPLICATION_TYPE) {

        this._errorCode = errorCode;

        message = errorCode + ': ' + message;

        // Add stack trace
        let trace = new Error().stack;
        // Crop unnecessary lines
        trace = trace.replace(/at Module\._compile(?:.*?[\n\r]?)*/i,'');
        this._logMessage = '#####' + GetDate() + ':  ' + message + "\r\n" + trace + "\r\n\r\n\r\n";

        // If debug is turned off then write error messages into file, otherwise show them in browser
        if (Config.debug === 0) {
            let filename = 'error.log';
            if (log_type === Consts.LOG_MYSQL_TYPE) {
                filename = 'db.log';
            }
            fs.appendFileSync("log/" + filename, this._logMessage);
        }


        throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    }
    getErrorCode(){
        return this._errorCode;
    }
    getLogMessage(){
        return this._logMessage;
    }
    reset(){
        this._errorCode = '';
        this._logMessage = '';
    }
}


ErrorHandler.instanceId = BaseFunctions.unique_id();
module.exports = ErrorHandler;