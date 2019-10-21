/*
 * File server/src/controllers/Catalog.js
 *
 * Controller catalog/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
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
const Categories = require('server/src/components/Categories');
const ConfigRestrictions = require('server/common/settings/Restrictions');

const CommonController = require('server/src/controllers/CommonController');

class Catalog extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {
        let _seoPath = 'catalog/index';
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath),
            'keywords':Seo.getInstance(this.requestId).getKeywords(_seoPath),
            'description':Seo.getInstance(this.requestId).getDescription(_seoPath),
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
        let _stateCode = this.getFromRequest(Consts.STATE_VAR_NAME);

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
        let _idStart = parseInt(this.getFromRequest(Consts.ID_VAR_NAME, false));

        this.addBackgroundData({
            catalog_placemarksData: CatalogComponent.getInstance(this.requestId).getPlacemarksList(_idStart).reverse()
        });

        this.sendMe(true);
    }

    /*
     * Action placemark
     */
    action_placemark()
    {
        let _placemarkId = parseInt(this.getFromRequest(Consts.ID_VAR_NAME));
        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _stateName = Countries.getInstance(this.requestId).getStateNameFromRequest(false);
        let _stateCode = this.getFromRequest(Consts.STATE_VAR_NAME, false);

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

    /*
     * Action search
     */
    action_search()
    {
        let _seoPath = 'catalog/search';
        let _formData = this.getFromRequest(Consts.REQUEST_FORM_DATA);
        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle(_seoPath),
            'keywords': Seo.getInstance(this.requestId).getKeywords(_seoPath),
            'description': Seo.getInstance(this.requestId).getDescription(_seoPath),
            'breadcrumbs': CatalogComponent.getInstance(this.requestId).getBreadcrumbsData(),
            'whetherToUseTitles': Service.getInstance(this.requestId).whetherToUseTitles(),
            'formData': _formData,
            'countries': Countries.getInstance(this.requestId).getCountriesData(true)
        });
        this.sendMe();
    }

    /*
     * Action sitemap categories
     */
    action_sitemap_categories() {
        let _seoPath = 'catalog/sitemap_categories/index';
        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle(_seoPath),
            'categoriesData':Categories.getInstance(this.requestId).getCategories()
        });

        this.sendMe();
    }



    /*
     * Action sitemap countries
     */
    action_sitemap_countries() {
        let _seoPath = 'catalog/sitemap_countries/index';
        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle(_seoPath),
            'countriesData':Countries.getInstance(this.requestId).getCountriesData(true)
        });

        this.sendMe();
    }




    /*
     * Action sitemap country
     */
    action_sitemap_country() {
        let _countriesData = Countries.getInstance(this.requestId).getCountriesData(true);
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _currentPage = this.getFromRequest(Consts.PAGE_NUMBER_VAR_NAME);
        let _limit = ConfigRestrictions['max_pager_rows'];
        let _placemarksCount = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksCountInCountry(_countryCode);

        let _pagesCount =  Math.ceil(_placemarksCount/_limit);
        let _offset = (_currentPage - 1) * _limit;
        let _seoPath = 'catalog/sitemap_countries/country';

        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle(_seoPath, {'country':_countryName}),
            'countryName':_countryName,
            'countryCode':_countryCode,
            'countriesData':_countriesData,
            'placemarksData': CatalogComponent.getInstance(this.requestId).getCountryPlacemarks(_countryCode, _offset, _limit),
            'currentPage':_currentPage,
            'pagesCount':_pagesCount,
        });

        this.sendMe();
    }



    /*
     * Action sitemap category
     */
    action_sitemap_category() {
        let _categoriesData = Categories.getInstance(this.requestId).getCategories();

        let _categoryCode = this.getFromRequest(Consts.CATEGORY_VAR_NAME);
        let _categoryData = Categories.getInstance(this.requestId).getCategoryByCode(_categoryCode);

        let _currentPage = this.getFromRequest(Consts.PAGE_NUMBER_VAR_NAME);
        let _limit = ConfigRestrictions['max_pager_rows'];
        let _placemarksCount = CatalogComponent.getInstance(this.requestId).getPlacemarksCountByCategory(_categoryData.id);

        let _pagesCount =  Math.ceil(_placemarksCount/_limit);
        let _offset = (_currentPage - 1) * _limit;

        let _seoPath = 'catalog/sitemap_categories/category';
        this.addActionData({
            'title': Seo.getInstance(this.requestId).getTitle(_seoPath, {'category':_categoryData.title}),
            'categoryTitle':_categoryData.title,
            'categoryId':_categoryData.id,
            'categoryCode':_categoryCode,
            'categoriesData':_categoriesData,
            'placemarksData': CatalogComponent.getInstance(this.requestId).getCategoryPlacemarks(_categoryData.id, _offset, _limit),
            'currentPage':_currentPage,
            'pagesCount':_pagesCount,
        });

        this.sendMe();
    }


}


Catalog.instanceId = BaseFunctions.uniqueId();
module.exports = Catalog;