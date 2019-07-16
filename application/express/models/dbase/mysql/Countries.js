/*
 * File application/express/models/dbase/mysql/Countries.js
 * const CountriesModel = require('application/express/models/dbase/mysql/Countries');
 *
 * Countries MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const StrictFunctions = require('application/express/functions/StrictFunctions');
const ErrorCodes = require('application/express/settings/ErrorCodes');

class CountriesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

 /*       this.fields = {
            title:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            content:{
                'rules':['required'],
                'processing':['strip_tags', 'new_line', 'urls', 'spec_tags'],
            },
            content_plain:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            seo_description:{
                'rules':[],
                'processing':['strip_tags'],
            },
            country_id:{
                'rules':['required', 'numeric'],
            },
            categories:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            keywords:{
                'rules':[],
                'processing':['strip_tags'],
            },
        };
*/
        this.snapshotFieldsData();
    }

    getTableName() {
        if (!this.tableName) {
           ///////////////// this.tableName = this.getServiceName() + '_articles';
        }
        return this.tableName;
    }




    /*
     * Get country data by country code
     *
     * @param {string} code - country code
     * @param {boolean} needResult - is result required
     *
     * @return {object} - country data
     */
    getCountryDataByCode(code, needResult = true){
        let _data = this.getBySql("SELECT * FROM country WHERE local_code = ?", [code], needResult);
        return _data[0].id ? _data[0] : null;
    }

}

CountriesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountriesModel;