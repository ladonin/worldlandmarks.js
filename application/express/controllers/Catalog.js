/*
 * File application/express/controllers/Catalog.js
 *
 * Controller catalog/* pages
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Language = require('application/express/core/Language');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Seo = require('application/express/components/Seo');
const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
const Countries = require('application/express/components/Countries');

const CommonController = require('application/express/controllers/CommonController');

class Catalog extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {
        this.addDynamicData({
            'title':Seo.getInstance(this.requestId).getTitle('catalog/index'),
            'keywords':Seo.getInstance(this.requestId).getKeywords('catalog/index'),
            'description':Seo.getInstance(this.requestId).getDescription('catalog/index'),
            'data':Countries.getInstance(this.requestId).prepareCountriesNames(GeocodeCollectionModel.getInstance(this.requestId).getCountriesData(this.getLanguage())),
            'scroll_url':'/' + this.getControllerName() + '/scroll',
            'current_url':'/' + this.getControllerName() + '/'
        });

        this.sendMe('index');
    }


       // this.addDynamicData({errorMessage: 'errorMessageerrorMessageerrorMessageerrorMessage'});////ATTENTION - обратите внимание






}



Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;

