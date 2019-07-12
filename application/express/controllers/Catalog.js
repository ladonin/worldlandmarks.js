/*
 * File application/express/controllers/Catalog.js
 *
 * Controller catalog/* pages
 */
const Deasync = require('deasync');


const BaseFunctions = require('application/express/functions/BaseFunctions');
const Language = require('application/express/components/base/Language');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');

const AbstractController = require('application/express/controllers/AbstractController');

class Catalog extends AbstractController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {
        console.log('+++' + this.requestId);
        console.log('index action ' + Language.getInstance(this.requestId).get_text('site/description/catalog/sitemap_categories/category', {category: '111111111111111'}));
        //this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, 'action_index111111111111');


        this.data = {};

        this.sendMe('index');



    }




}



Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;

