/*
 * File application/express/controllers/Main.js
 *
 * Controller main/* pages
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Language = require('application/express/core/Language');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');

const CommonController = require('application/express/controllers/CommonController');



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

