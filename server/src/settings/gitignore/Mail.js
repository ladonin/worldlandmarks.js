/*
 * File server/src/settings/gitignore/Mail.js
 * const MailConfig = require('server/src/settings/gitignore/Mail');
 *
 * Mail settings
 */

const Consts = require('server/src/settings/Constants');

module.exports = {
    [Consts.DEFAULT]: {
        smtp: {
            host: "smtp.spaceweb.ru",
            port: 25,
            secure: false,
            auth: {
                user: "info@world-landmarks.ru",
                pass: "silver2007"
            }
        },
        fromName: 'Mapstore'
    }
}