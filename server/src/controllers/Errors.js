/*
 * File server/src/controllers/Main.js
 *
 * Controller main/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const Language = require('server/src/core/Language');
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

        this.addActionData({errorMessage: 'errorMessageerrorMessageerrorMessageerrorMessage'});////ATTENTION - обратите внимание
        this.sendMe();



    }

}




Errors.instanceId = BaseFunctions.unique_id();
module.exports = Errors;

