/*
 * File application/express/controllers/Main.js
 *
 * Controller main/* pages
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Language = require('application/express/components/base/Language');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');

const AbstractController = require('application/express/controllers/AbstractController');



class Errors extends AbstractController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_error404() {

        this.addDynamicData({errorMessage: 'errorMessageerrorMessageerrorMessageerrorMessage'});////ATTENTION - обратите внимание
        this.sendMe('error404');



    }

}




Errors.instanceId = BaseFunctions.unique_id();
module.exports = Errors;

