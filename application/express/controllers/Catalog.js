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
const CatalogComponent = require('application/express/components/Catalog');
const ArticlesModel = require('application/express/models/dbase/mysql/Articles');
const Config = require('application/express/settings/Config');
const Service = require('application/express/core/Service');

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
            'current_url':'/' + this.getControllerName() + '/',
            'articles':ArticlesModel.getInstance(this.requestId).getLastArticles(Service.getInstance(this.requestId).getMaxLastArticlesList())
        });

        this.sendMe('index');
    }

    /*
     * Action country
     */
    action_country()
    {

        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();

        this.addDynamicData({
            'title': Seo.getInstance(this.requestId).getTitle('catalog/country', {'country':_countryName}),
            'keywords': Seo.getInstance(this.requestId).getKeywords('catalog/country'),
            'description': Seo.getInstance(this.requestId).getDescription('catalog/country'),
            'data': CatalogComponent.getInstance(this.requestId).processCountryPageData(),
            'country': _countryName,
            'country_params': Countries.getInstance(this.requestId).getCountryParamsByCode(_countryCode),
            'country_code': _countryCode,
            'scroll_url': '/' + this.getControllerName() + '/scroll',
            'back_url': '/' + this.getControllerName() + '/',
            'current_url': '/' + this.getControllerName() + '/' + _countryCode + '/',
            'has_states': Countries.getInstance(this.requestId).hasStates(_countryCode) ? true : false,
            'placemarks_count': CatalogComponent.getInstance(this.requestId).getPlacemarksCountInCountry(_countryCode),
            'photos': CatalogComponent.getInstance(this.requestId).getCountryPhotosData(_countryCode)
        });

        this.sendMe('country');
    }










       // this.addDynamicData({errorMessage: 'errorMessageerrorMessageerrorMessageerrorMessage'});////ATTENTION - обратите внимание






}



Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;

