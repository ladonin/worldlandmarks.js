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
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle('catalog/index'),
            'keywords':Seo.getInstance(this.requestId).getKeywords('catalog/index'),
            'description':Seo.getInstance(this.requestId).getDescription('catalog/index'),
            'data':Countries.getInstance(this.requestId).prepareCountriesNames(GeocodeCollectionModel.getInstance(this.requestId).getCountriesData(this.getLanguage())),
            'scroll_url':'/' + this.getControllerName() + '/scroll',
            'current_url':'/' + this.getControllerName() + '/',
            'articles':ArticlesModel.getInstance(this.requestId).getLastArticles(Service.getInstance(this.requestId).getMaxLastArticlesList())
        });

        this.sendMe();
    }

    /*
     * Action country
     */
    action_country()
    {

        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();

        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle('catalog/country', {'country':_countryName}),
            'keywords': Seo.getInstance(this.requestId).getKeywords('catalog/country'),
            'description': Seo.getInstance(this.requestId).getDescription('catalog/country'),
            'data': {
                states:CatalogComponent.getInstance(this.requestId).processCountryPageData(),
                photos:CatalogComponent.getInstance(this.requestId).getCountryPhotosData(_countryCode),
                articles:ArticlesModel.getInstance(this.requestId).getLastCountryArticles(_countryCode)
            },
            'country': _countryName,
            'country_code': _countryCode,
            'current_url': '/' + this.getControllerName() + '/' + _countryCode + '/',
            'has_states': Countries.getInstance(this.requestId).hasStates(_countryCode) ? true : false,
            'breadcrumbs': CatalogComponent.getInstance(this.requestId).getBreadcrumbsData(),
        });

        this.sendMe();
    }

    /*
     * Action state
     */
    action_state()
    {

        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _stateName = Countries.getInstance(this.requestId).getStateNameFromRequest();
        let _stateCode = this.getFromRequest(Consts.CATALOG_STATE_VAR_NAME);

        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle('catalog/state', {'country':_countryName, 'state': _stateName}),
            'keywords': Seo.getInstance(this.requestId).getKeywords('catalog/state'),
            'description': Seo.getInstance(this.requestId).getDescription('catalog/state'),
            'data': {
                photos:CatalogComponent.getInstance(this.requestId).getStatePhotosData(_countryCode, _stateCode)
            },
            'country': _countryName,
            'country_code': _countryCode,
            'state': _stateName,
            'state_code': _stateCode,
            'current_url': '/' + this.getControllerName() + '/' + _countryCode + '/' + _stateCode + '/',
            'breadcrumbs': CatalogComponent.getInstance(this.requestId).getBreadcrumbsData(),
        });

        this.sendMe();
    }

    action_get_placemarks_list()
    {
        let _idStart = BaseFunctions.toInt(this.getFromRequest(Consts.ID_VAR_NAME, false));

        this.addBackgroundData({
            placemarks_data: CatalogComponent.getInstance(this.requestId).getPlacemarksList(_idStart).reverse()
        });

        this.sendMe(true);
    }
}


Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;