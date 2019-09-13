/*
 * File server/src/controllers/Catalog.js
 *
 * Controller catalog/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const Language = require('server/src/core/Language');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Seo = require('server/src/components/Seo');
const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');
const Countries = require('server/src/components/Countries');
const CatalogComponent = require('server/src/components/Catalog');
const ArticlesModel = require('server/src/models/dbase/mysql/Articles');
const Config = require('server/src/settings/Config');
const Service = require('server/src/core/Service');
const Placemarks = require('server/src/components/Placemarks');

const CommonController = require('server/src/controllers/CommonController');

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

    /*
     * Background action that returns a list of placemarks according to the passed parameters
     */
    action_get_placemarks_list()
    {
        let _idStart = BaseFunctions.toInt(this.getFromRequest(Consts.ID_VAR_NAME, false));

        this.addBackgroundData({
            placemarksData: CatalogComponent.getInstance(this.requestId).getPlacemarksList(_idStart).reverse()
        });

        this.sendMe(true);
    }

    /*
     * Action placemark
     */
    action_placemark()
    {
        let _placemarkId = BaseFunctions.toInt(this.getFromRequest(Consts.ID_VAR_NAME));
        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _stateName = Countries.getInstance(this.requestId).getStateNameFromRequest(false);
        let _stateCode = this.getFromRequest(Consts.CATALOG_STATE_VAR_NAME, false);

        if (!GeocodeCollectionModel.getInstance(this.requestId).checkPlacemark(_placemarkId, _countryCode, _stateCode)){
            this.error(ErrorCodes.ERROR_CATALOG_WRONG_PLACEMARK_ADDRESS_OR_ID);
        }
        let _placemarkData = Placemarks.getInstance(this.requestId).getPlacemarkPageData(_placemarkId);
        let _title = _placemarkData['title'] ? _placemarkData['title'] : (this.getText('map/default_title_part/value') + ' ' + _placemarkId);;

        if (_stateCode) {
            this.addActionData({
                'title': Seo.getInstance(this.requestId).getTitle('catalog/placemark', {'country':_countryName, 'state': _stateName, 'title': _title}),
                'keywords': Seo.getInstance(this.requestId).getKeywords('catalog/placemark'),
                'description': Seo.getInstance(this.requestId).getDescription('catalog/placemark')
            });
        } else {
            this.addActionData({
                'title': Seo.getInstance(this.requestId).getTitle('catalog/placemark_no_states', {'country':_countryName, 'title': _title}),
                'keywords': Seo.getInstance(this.requestId).getKeywords('catalog/placemark_no_states'),
                'description': Seo.getInstance(this.requestId).getDescription('catalog/placemark_no_states')
            });
        }

        this.addActionData({
            'data': _placemarkData,
            'country': _countryName,
            'country_code': _countryCode,
            'state': _stateName,
            'state_code': _stateCode,
            'current_url': '/' + this.getControllerName() + '/' + _countryCode + '/' + (_stateCode ? (_stateCode + '/') : ''),
            'breadcrumbs': CatalogComponent.getInstance(this.requestId).getBreadcrumbsData()
        });
        this.sendMe();
    }

}


Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;