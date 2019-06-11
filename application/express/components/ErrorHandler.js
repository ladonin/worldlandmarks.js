/*
 * File application/express/components/ErrorHandler.js
 *
 * Error processor
 */


const fs = require("fs");
const ErrorCodes = require('application/settings/express/ErrorCodes');
const GetDate = require('modules/express/base_functions/BaseFunctions').getDate;
const Consts = require('application/settings/express/Constants');
const Messages = require('application/settings/express/Messages');


let _errorStatus = false;
let _errorCode = '';

module.exports = {
    process: (errorCode, message, log_type = Consts.LOG_APPLICATION_TYPE) => {
        _errorStatus = true;
        _errorCode = errorCode;

        message = errorCode + ': ';

        if (process.env.NODE_ENV === Consts.PROCESS_PROD) {
            let filename = 'error.log';
            if (log_type === Consts.LOG_MYSQL_TYPE) {
                filename = 'db.log';
            }
            fs.appendFileSync("log/" + filename, '#' + GetDate() + '# ' + message + "\r\n");
        }
        throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    },
    errorEnable:()=>{
        return _errorStatus;
    },
    getErrorCode:()=>{
        return _errorCode;
    }
};