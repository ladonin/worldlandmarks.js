/*
 * File application/express/settings/gitignore/FtpServers.js
 *
 * Ftp servers connection parameters
 */

const Consts = require('application/express/settings/Constants');

module.exports = {
    [Consts.FTP_DEFAULT_SERVER_NAME]: {
        url: '140706.selcdn.ru',
        user_name: '40679',
        user_password: 'XrhbDnXv',
        root_directory: 'mapstore'
    }
};