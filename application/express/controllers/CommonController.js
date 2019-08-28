/*
 * File application/express/controllers/CommonController.js
 * const CommonController = require('application/express/controllers/CommonController');
 *
 * Common class for all controllers
 */
const Controller = require('application/express/core/parents/Controller');
const Language = require('application/express/core/Language');
const Constants = require('application/express/settings/Constants');
const Users = require('application/express/core/Users');

class CommonController extends Controller {

    constructor() {
        super();
    }

    /*
     * Add additional static data to controller's responce according with controller and action name
     *
     * @param {string} actionName - controller's action name
     */
    addStaticData(actionName) {

        let _controllerName = this.constructor.name.toLowerCase();

        let _path = _controllerName + '_' + actionName;
        let _staticData = {};

        if ((_path === 'errors_error404')
                || (_path === 'main_index')
                || (_path === 'catalog_index')
                ) {

            _staticData = {..._staticData,
                'domain_name': this.getText('domain_name'),
                'hat/logo/under_text': this.getText('hat/logo/under_text'),
                'catalog/placemark/link_to_map/text':this.getText('catalog/placemark/link_to_map/text')
            }
        }

        if (_path === 'catalog_index') {
            _staticData = {..._staticData,
                'placemarks_count': this.getText('placemarks_count/2/text'),
                'last_articles': this.getText('last_articles/text'),
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
                'last_articles_text': this.getText('last_articles/text'),
            }
        }



        // Always
        _staticData = {..._staticData,
            'category_info_title_text': this.getText('category/info/title/text'),
            'is_admin': Users.getInstance(this.requestId).isAdmin(),
            'see_all': this.getText('see_all')
        }

        this.data = {...this.data, [Constants.STATIC_DATA]:_staticData};
    }
}
module.exports = CommonController;