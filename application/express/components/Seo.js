/*
 * File application/express/components/Seo.js
 * const Seo = require('application/express/components/Seo');
 *
 * Seo component - compute seo data
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Language = require('application/express/core/Language');
const Countries = require('application/express/components/Countries');
const RequestsPool = require('application/express/core/RequestsPool');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const Articles = require('application/express/components/Articles');
const Config = require('application/express/settings/Config');

class Seo extends Component {

    constructor(){
        super();
    }

    /*
     * Get page title
     *
     * $param {string} address - text address
     * $param object params - values to insert into the title
     *
     * @return {string}
     */
    getTitle(address, params = {})
    {
        return  this.getText('site/title/' + address, params);
    }

    /*
     * Get page keywords
     *
     * $param {string} address - text address
     *
     * @return {string}
     */
    getKeywords(address)
    {
        let {_controller, _action} = RequestsPool.getControllerAndActionNames(this.requestId);

        if (_controller === Consts.CONTROLLER_NAME_CATALOG) {

            if (_action === Consts.ACTION_NAME_COUNTRY) {
                return Countries.getInstance(this.requestId).getCountryNameFromRequest();
            } else if (_action === Consts.ACTION_NAME_STATE) {

                let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
                let _stateCode = this.getFromRequest(Consts.CATALOG_STATE_VAR_NAME);
                let _countryData = Countries.getInstance(this.requestId).getStateAndCountryNameByCode(_countryCode, _stateCode);
                return _countryData['country'] + ',' + _countryData['state'];

            } else if (_action === Consts.ACTION_NAME_PLACEMARK) {

                let _placemark = MapDataModel.getInstance(this.requestId).getById(this.getFromRequest(Consts.ID_VAR_NAME), ['seo_keywords','title']);
                return _placemark['seo_keywords'] ? _placemark['seo_keywords'] : BaseFunctions.clearSpecialSymbols(_placemark['title']);
            }
        }

        return this.getText('site/keywords/' + address);
    }


    /*
     * Get page description
     *
     * $param {string} address - text address
     * $param {object} params - parameters for building the description
     *
     * @return {string}
     */
    getDescription(address, params)
    {
        let {_controller, _action} = RequestsPool.getControllerAndActionNames(this.requestId);

        if (_controller === Consts.CONTROLLER_NAME_CATALOG) {

            if (_action === Consts.ACTION_NAME_COUNTRY) {
                return '';
            } else if (_action === Consts.ACTION_NAME_STATE) {
                return '';
            } else if (_action === Consts.ACTION_NAME_PLACEMARK) {

                let _placemark = MapDataModel.getInstance(this.requestId).getById(this.getFromRequest(Consts.ID_VAR_NAME), ['comment_plain','seo_description']);

                return _placemark['seo_description']
                    ? _placemark['seo_description']
                    : BaseFunctions.getCroppedText(_placemark['comment_plain'], Config['restrictions']['max_cropped_seo_description_length'], dots = true, this);
            }
        } else if (_controller === Consts.CONTROLLER_NAME_ARTICLE) {

            if (_action === Consts.ACTION_NAME_VIEW) {

                let _article = Articles.getInstance(this.requestId).getById(this.getFromRequest(Consts.ID_VAR_NAME), ['content_plain','seo_description']);

                return _article['seo_description']
                    ? _article['seo_description']
                    : BaseFunctions.getCroppedText(_article['content_plain'], Config['restrictions']['max_cropped_seo_description_length'], dots = true, this);
            }
        }

        return this.getText('site/description/' + address, params);
    }
}


Seo.instanceId = BaseFunctions.unique_id();

module.exports = Seo;