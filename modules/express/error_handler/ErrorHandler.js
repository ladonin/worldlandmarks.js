const fs = require("fs");
const ErrorCodes = require('settings/express/ErrorCodes');
const GetDate = require('modules/express/base_functions/BaseFunctions').getDate;
const Consts = require('settings/express/Constants');
const Messages = require('settings/express/Messages');

module.exports = {
    process: (message) => {
        if (process.env.NODE_ENV === Consts.PROCESS_PROD) {
            fs.appendFileSync("log/error.log", '#' + GetDate() + '# ' + message + "\r\n");
        }
        throw new Error('#' + Messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    }
};