/*
 * File application/express/settings/gitignore/FtpServers.js
 * const FtpServersConfig = requie('application/express/settings/gitignore/FtpServers');
 *
 * Ftp servers config
 */

const Consts = require('application/express/settings/Constants');

module.exports = {
    [Consts.FTP_DEFAULT_SERVER_NAME]: {
        url: '140706.selcdn.ru',
        userName: '40679',
        userPassword: 'XrhbDnXv',
        rootDirectory: 'mapstore'
    }
};