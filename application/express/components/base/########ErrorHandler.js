/*
 * File application/express/components/base/ErrorHandler.js
 * 
 *
 * Error processor
 */
const fs = require("fs");
const GetDate = require('application/express/functions/BaseFunctions').getDate;
const Consts = require('application/express/settings/Constants');
const Messages = require('application/express/settings/Messages');
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

        message = errorCode[1] + ': ' + message;

        // Add stack trace
        let trace = new Error().stack;
        // Crop unnecessary lines
        trace = trace.replace(/at Module\._compile(?:.*?[\n\r]?)*/i,'');
        let logMessage = '##' + Messages.ERROR_SYNTHETIC_STATUS + '## ' + GetDate() + ':  ' + message + "\r\n" + trace + "\r\n\r\n\r\n";

        // If debug is turned off then write error messages into file, otherwise show them in browser
        if (Config.debug === 0) {
            let filename = 'error.log';
            if (log_type === Consts.LOG_MYSQL_TYPE) {
                filename = 'db.log';
            }
            fs.appendFileSync("log/" + filename, logMessage);
        }
        message = '#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message;
        throw {code: errorCode[0], message};
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