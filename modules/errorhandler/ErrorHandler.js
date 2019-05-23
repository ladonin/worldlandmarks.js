const fs = require("fs");
const ErrorCodes = require('settings/ErrorCodes');
const getDate = require('modules/helper/BaseFunctions').getDate;
const consts = require('settings/Constants');
const messages = require('settings/Messages');

module.exports = {
    process: (message) => {
        if (process.env.NODE_ENV === consts.MY_PROCESS_PROD) {
            fs.appendFileSync("log/error.log", '#' + getDate() + '# ' + message + "\r\n");
        }
        throw new Error('#' + messages.ERROR_SYNTHETIC_STATUS + ': ' + message);
    }
};