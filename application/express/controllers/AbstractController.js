/*
 * File application/express/controllers/AbstractController.js
 * const AbstractController = require('application/express/controllers/AbstractController');
 *
 * Common class for all controllers
 */
const Controller = require('application/express/vendor/Controller');
const Language = require('application/express/components/base/Language');
const Constants = require('application/express/settings/Constants');

class AbstractController extends Controller {

    constructor() {
        super();
    }

    /*
     * Flush result
     *
     * @return object
     */
    sendMe(actionName = null, eventName = 'api') {
        if (actionName) {
            this.addStaticText(actionName);
        }
        this.sendbySocket(eventName);
    }

    /*
     * Add dynamic data to controller's responce (data from dbase, etc)
     *
     * @param object data - added data
     */
    addDynamicData(data) {
        this.data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT] = {...this.data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT], ...data};
    }

    /*
     * Add additional static text to controller's responce according with controller and action name
     *
     * @param string actionName - controller's action name
     */
    addStaticText(actionName) {

        let _controllerName = this.constructor.name.toLowerCase();

        let _path = _controllerName + '_' + actionName;
        let _languageInstance = Language.getInstance(this.requestId);
        let _mergedObjectStaticText = {};

        if ((_path === 'errors_error404')
                || (_path === 'main_index')
                || (_path === 'catalog_index')
                ) {

            _mergedObjectStaticText[Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT] = {
                'domain_name': _languageInstance.get_text('domain_name'),
                'hat/logo/under_text': _languageInstance.get_text('hat/logo/under_text'),
            }

        }
        this.data = {...this.data, ..._mergedObjectStaticText};
    }

}
module.exports = AbstractController;