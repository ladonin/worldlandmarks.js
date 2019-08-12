/*
 * File application/express/controllers/CommonController.js
 * const CommonController = require('application/express/controllers/CommonController');
 *
 * Common class for all controllers
 */
const Controller = require('application/express/core/parents/Controller');
const Language = require('application/express/core/Language');
const Constants = require('application/express/settings/Constants');

class CommonController extends Controller {

    constructor() {
        super();
    }

    /*
     * Add additional static text to controller's responce according with controller and action name
     *
     * @param {string} actionName - controller's action name
     */
    addStaticText(actionName) {

        let _controllerName = this.constructor.name.toLowerCase();

        let _path = _controllerName + '_' + actionName;
        let _staticText = {};

        if ((_path === 'errors_error404')
                || (_path === 'main_index')
                || (_path === 'catalog_index')
                ) {

            _staticText = {..._staticText,
                'domain_name': this.getText('domain_name'),
                'hat/logo/under_text': this.getText('hat/logo/under_text'),
                'see_all': this.getText('see_all'),
            }
        }

        if (_path === 'catalog_index') {
            _staticText = {..._staticText,
                'placemarks_count': this.getText('placemarks_count/2/text'),
                'last_articles': this.getText('last_articles/text'),
            }
        }

        this.data = {...this.data, [Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT]:_staticText};
    }
}
module.exports = CommonController;