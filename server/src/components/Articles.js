/*
 * File server/src/components/Articles.js
 * const Articles = require('server/src/components/Articles');
 *
 * Articles component - compute articles data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const ArticlesModel = require('server/src/models/dbase/mysql/Articles');
const Countries = require('server/src/components/Countries');

class Articles extends Component
{

    constructor()
    {
        super();
    }


    /*
     * Return articles breadcrumbs
     *
     * @param {object} data - article data
     *
     * @return {array of objects}
     */
    getBreadcrumbsData(data = false)
    {
        let _result = [{
                    'url': '/' + Consts.CONTROLLER_NAME_ARTICLES,
                    'name': this.getText('breadcrumbs/' + this.getControllerName() + '/text')
                }];

        if (data) {
            let _countryCode = Countries.getInstance(this.requestId).getСountryCodeById(data['country_id']);
            _result.push({
                    'url': '/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRIES + '/' + _countryCode + '/1',
                    'name': Countries.getInstance(this.requestId).getCountryNameByCode(_countryCode)
                });
        }
        return _result
    }
}

Articles.instanceId = BaseFunctions.uniqueId();

module.exports = Articles;