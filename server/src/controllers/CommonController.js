/*
 * File server/src/controllers/CommonController.js
 * const CommonController = require('server/src/controllers/CommonController');
 *
 * Common class for all controllers
 */
const Controller = require('server/src/core/parents/Controller');
const Language = require('server/src/core/Language');
const Constants = require('server/src/settings/Constants');
const Users = require('server/src/core/Users');
const Catalog = require('server/src/components/Catalog');
const Articles = require('server/src/components/Articles');

class CommonController extends Controller {

    constructor() {
        super();
    }

    /*
     * Add additional static data to controller's responce according with controller and action name
     *
     * @param {boolean} isBackground - whether request is background (like ajax)
     */
    addStaticData(isBackground = false) {

        if (isBackground) {
            return null;
        }

        let _controllerName = this.getFromRequest(Constants.CLIENT_CONTROLLER_VAR_NAME);
        let _actionName = this.getFromRequest(Constants.CLIENT_ACTION_VAR_NAME);

        let _path = _controllerName + '_' + _actionName;
        let _staticData = {};

        if ((_path === 'errors_error404')
                || (_controllerName === Constants.CONTROLLER_NAME_MAIN)
                || (_controllerName === Constants.CONTROLLER_NAME_CATALOG)
                ) {

            _staticData = {..._staticData,
                'domain_name': this.getText('domain_name'),
                'hat_logo_under_text': this.getText('hat/logo/under_text'),
                'catalog_placemark_link_to_map_text':this.getText('catalog/placemark/link_to_map/text')
            }
        }

        if (_path === 'catalog_index') {
            _staticData = {..._staticData,
                'placemarks_count': this.getText('placemarks_count/2/text'),
            }
        }

        if (_path === 'catalog_country') {
            _staticData = {..._staticData,
                'catalog_states_regions_list_title': this.getText('catalog/states/regions/list/title'),
                'catalog_photoalbum_title_text': this.getText('catalog/country/photoalbum_title/text')
            }
        }
        if (_path === 'catalog_state') {
            _staticData = {..._staticData,
                'catalog_photoalbum_title_text': this.getText('catalog/state/photoalbum_title/text')
            }
        }

        if ((_path === 'catalog_country') ||  (_path === 'catalog_state')) {
            _staticData = {..._staticData,
                'default_title_part': this.getText('map/default_title_part/value'),
            }
        }


        if (_controllerName === Constants.CONTROLLER_NAME_CATALOG) {
            _staticData = {..._staticData,
                'last_articles_text': this.getText('last_articles/text'),
            }
        }


        // Always
        _staticData = {..._staticData,
            'category_info_title_text': this.getText('category/info/title/text'),
            'is_admin': Users.getInstance(this.requestId).isAdmin(),
            'see_all': this.getText('see_all'),
            'controller': this.getFromRequest(Constants.CLIENT_CONTROLLER_VAR_NAME),
            'action': this.getFromRequest(Constants.CLIENT_ACTION_VAR_NAME),
            'bottom':{
                '1': this.getText('page_bottom/column_1/header/text'),
                '2': this.getText('page_bottom/catalog/text'),
                '3': this.getText('page_bottom/map/text'),
                '4': this.getText('page_bottom/search/text'),
                '5': this.getText('page_bottom/sitemap_countries/text'),
                '6': this.getText('page_bottom/sitemap_categories/text'),
                '7': this.getText('page_bottom/articles_countries/text'),
                '8': this.getText('page_bottom/articles_categories/text'),
                '9': this.getText('page_bottom/rights/text')
            }
        }

        this.data = {...this.data, [Constants.STATIC_DATA]:_staticData};
    }
}
module.exports = CommonController;