/*
 * File server/src/components/base/Mailer.js
 * const Mailer = require('server/src/components/base/Mailer');
 *
 * Mailer component
 */

const Nodemailer = require("nodemailer");

const BaseFunctions = require('server/src/functions/BaseFunctions');
const MailConfig = require('server/src/settings/gitignore/Mail');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const MapDataModel = require('server/src/models/dbase/mysql/MapData');
const EmailsSendsModel = require('server/src/models/dbase/mysql/EmailsSends');
const Component = require('server/src/core/parents/Component');


let _config = MailConfig[Consts.DEFAULT];
let _transporter = Nodemailer.createTransport(_config.smtp);

/*
 * Verify mailer authorization
 */
_transporter.verify(function (error, success) {
    if (error) {
        BaseFunctions.processError(ErrorCodes.ERROR_MAILER_CONNECTION, 'err[' + error.response + ']', undefined, undefined, true, true);
    } else {
        console.log('Mailer OK');
    }
});

/*
 * Send email
 *
 * @param {string} to - recipient email
 * @param {string} subject - message title
 * @param {string} plainText - brief content of message without html
 * @param {string} html - body message
 */
function sendEmail(to, subject, plainText, html)
{
    _transporter.sendMail({
        from: '"' + _config.fromName + '" <' + _config.smtp.auth.user + '>',
        to: to,
        subject: subject,
        text: plainText,
        html: html
    }, function (error, info) {
        if (error) {
            BaseFunctions.processError(ErrorCodes.ERROR_SEND_EMAIL, console.log(error.response));
            // TODO: create a function to resend emails in case if mail server is unavailable
        }
    });
}


// Example:
//        _transporter.sendMail({
//            from: 'info@world-landmarks.ru', // sender address
//            to: "aladonin1985@gmail.com", // list of receivers
//            subject: "Hello ✔", // Subject line
//            text: "Hello world?", // plain text body
//            html: "<b>Hello world?</b>" // html body
//        });

class Mailer extends Component
{
    constructor()
    {
        super();
    }


    /*
     * Prepare message data
     *
     * @param {object} data - data to be included into the message
     * @param {string} type - message type
     *
     * @return {object} - prepared subject, body and plainText
     */
    prepareMessage(data, type)
    {
        if (type === 'afterCreationPlacemark') {
            let _data = data['data'];
            return {
                subject: this.getText('email/send_password_after_create_placemark/subject'),
                body: '<div style="font-family:Arial;font-size:13px;color:#515151;line-height:21px;">'
                        + this.getText('email/send_password_after_create_placemark/body', {'password': _data['password']})
                        + '</div>',
                plainText: this.getText('email/send_password_after_create_placemark/alt_body')
            };
        }

        this.error(ErrorCodes.ERROR_WRONG_EMAIL_TYPE, 'type [' + type + ']');
    }


    /*
     * Send specific email with logging sending in db - after placemark will be created
     *
     * @param {object} data - specific message data
     * @param {string} type - message type
     * @param {integer} dataId - placemark id
     */
    sendAfterCreationPlacemark(data, type, dataId)
    {
        let _mailData = this.prepareMessage(data, type);
        sendEmail(data.to, _mailData.subject, _mailData.plainText, _mailData.body);

        // Write log of sending
        let _dataLog = {
            'map_table': MapDataModel.getInstance(this.requestId).getTableName(),
            'data_id': dataId,
            'from_email': _config.smtp.auth.user,
            'from_name': _config.fromName,
            'recipient_email': data.pecipient,
            'is_html': 1,
            'subject': _mailData.subject,
            'body': _mailData.body,
            'plain_text': _mailData.plainText
        };

        EmailsSendsModel.getInstance(this.requestId).add(_dataLog);
    }
}

Mailer.instanceId = BaseFunctions.uniqueId();
module.exports = Mailer;