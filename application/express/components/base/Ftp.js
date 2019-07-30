/*
 * File application/express/components/base/Ftp.js
 * const Ftp = require('application/express/components/base/Ftp');
 *
 * Ftp component
 */

const Deasync = require('deasync');
const jsftp = require("jsftp");

const FtpServersConfig = require('application/express/settings/gitignore/FtpServers');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const ErrorCodes = require('application/express/settings/ErrorCodes');

let _config = FtpServersConfig[Consts.FTP_DEFAULT_SERVER_NAME];
const Ftp = new jsftp({
    host: _config.url,
    user: _config.userName,
    pass: _config.userPassword
});
Ftp.keepAlive(5000);

// Set root directory at the ftp server
let _finished = false;
Ftp.raw("cwd", _config.rootDirectory, (err, data) => {
    _finished = true;
    if (err) {
        BaseFunctions.processError(ErrorCodes.ERROR_FTP_CHANGE_ROOT_DIRECTORY, 'err[' + BaseFunctions.toString(err) + '], new dir[' + _config.rootDirectory + ']')
    }
    console.log('FTP OK');
});
// Wait for process to be finished
Deasync.loopWhile(function () {
    return !_finished;
});


module.exports = {

    /*
     * Upload a file to ftp server synchronously
     *
     * @param {string} source - file path to be uploaded
     * @param {string} destination - destination path
     */
    putFileSync(source, destination) {
        let _finished = false;
        Ftp.put(source, destination, err => {
            _finished = true;
            if (err) {
                BaseFunctions.processError(ErrorCodes.ERROR_FTP_LOAD_FILE, 'err[' + BaseFunctions.toString(err) + '], source[' + source + '], destination[' + destination + ']')
            }
        });
        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });
    },
    /*
     * Create a directory in ftp server synchronously
     *
     * @param {string} dirName - directory name
     */
    createDirSync(dirName) {
        let _finished = false;
        Ftp.raw("mkd", dirName, (err, data) => {
            _finished = true;
            if (err) {
                BaseFunctions.processError(ErrorCodes.ERROR_FTP_CREATE_DIR, 'err[' + BaseFunctions.toString(err) + '], dirName[' + dirName + ']')
            }
        });
        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });
    },
    /*
     * Remove a directory from ftp server synchronously
     *
     * @param {string} dirName - directory name
     */
    removeDirSync(dirName) {
        let _finished = false;
        Ftp.raw("rmd", dirName, (err, data) => {
            _finished = true;
            if (err) {
                BaseFunctions.processError(ErrorCodes.ERROR_FTP_REMOVE_DIR, 'err[' + BaseFunctions.toString(err) + '], dirName[' + dirName + ']')
            }
        });
        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });
    },
    /*
     * Remove a file from ftp server synchronously
     *
     * @param {string} fileName - file name
     */
    removeFileSync(fileName) {
        let _finished = false;
        Ftp.raw("dele", fileName, (err, data) => {
            _finished = true;
            if (err) {
                BaseFunctions.processError(ErrorCodes.ERROR_FTP_REMOVE_FILE, 'err[' + BaseFunctions.toString(err) + '], fileName[' + fileName + ']')
            }
        });
        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });
    },
    /*
     * Get ftp config
     *
     * @return {object} - copy of config
     */
    getConfig(){
        return BaseFunctions.clone(_config);
    }
}