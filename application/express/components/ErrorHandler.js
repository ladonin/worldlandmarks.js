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


let errorStatus = false;


module.exports = {
    process: (message) => {
        errorStatus = true;
        if (process.env.NODE_ENV === Consts.PROCESS_PROD) {
            fs.appendFileSync("log/error.log", '#' + GetDate() + '# ' + message + "\r\n");
        }
        throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    },
    errorEnable:()=>{
        return errorStatus;
    }
};