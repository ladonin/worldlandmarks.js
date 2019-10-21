/*
 * File server/src/controllers/Errors.js
 *
 * Controller errors/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');

const CommonController = require('server/src/controllers/CommonController');


class Errors extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_error404() {
        this.addActionData({errorMessage: '404'});
        this.sendMe();
    }
}


Errors.instanceId = BaseFunctions.uniqueId();
module.exports = Errors;