/*
 * File server/src/components/base/Ftp.js
 * const Ftp = require('server/src/components/base/Ftp');
 *
 * Ftp component
 */

const Deasync = require('deasync');
const jsftp = require("jsftp");

const FtpServersConfig = require('server/src/settings/gitignore/FtpServers');
const Consts = require('server/src/settings/Constants');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const DebugSettings = require('server/src/settings/DebugSettings');
const Config = require('server/src/settings/Config');


const Ftp = new jsftp({
    host: FtpServersConfig.url,
    user: FtpServersConfig.userName,
    pass: FtpServersConfig.userPassword
});
Ftp.keepAlive(5000);

// Check the need to call this slow operation during debug
if (Config.debug === 1 && DebugSettings.ftp === 0) {
    console.log('WARNING! FTP directory is NOT set. Reason: debug setting turned it off.');
} else {
    // Set root directory at the ftp server
    let _finished = false;
    Ftp.raw("cwd", FtpServersConfig.rootDirectory, (err, data) => {
        _finished = true;
        if (err) {
            BaseFunctions.processError(ErrorCodes.ERROR_FTP_CHANGE_ROOT_DIRECTORY, 'err[' + BaseFunctions.toString(err) + '], new dir[' + FtpServersConfig.rootDirectory + ']')
        }
        console.log('FTP OK');
        console.log('FTP directory is set');
    });
    // Wait for process to be finished
    Deasync.loopWhile(function () {
        return !_finished;
    });
}




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
    }
}