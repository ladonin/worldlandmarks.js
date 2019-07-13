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

//    addArticle(data)
//    {
//        this.setValuesToFields(data);
//        return this.insert();
//    }
//
//    updateArticle(data)
//    {
//        let _id = data.id;
//        delete data.id;
//        this.setValuesToFields(data);
//        return this.update(_id);
//    }


    /*
     * Get country name by country code
     *
     * @param {string} code - country code
     * @param {string} language - in what language country name will be get
     * @param {boolean} needResult - is result required
     *
     * @return {string} - country name
     */
    getCountryNameByCode(code, language, needResult = true){

        let _sql = "SELECT cn.name as name FROM country c \n\
                    LEFT JOIN country_name cn on c.id = cn.country_id  \n\
                    WHERE c.local_code = '" + code + "' AND cn.language='" + language + "'";

        let _data = this.getBySql(_sql, undefined, needResult);

        if (!_data.length || !_data[0].name) {
            this.error(ErrorCodes.ERROR_COUNTRY_NAME_WAS_NOT_FOUND, 'country code [' + code + ']', undefined, false);
        }

        return _data[0].name;
    }


}

CountriesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountriesModel;