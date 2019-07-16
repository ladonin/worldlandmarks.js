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

        this.fields = {
            code2: {
                'rules': ['required'],
            },
            local_code: {
                'rules': ['required'],
            }
        };

        this.snapshotFieldsData();
    }

    getTableName() {
        if (!this.tableName) {
            this.tableName = 'country';
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
    getCountryDataByCode(code, needResult = true) {
        let _data = this.getBySql("SELECT * FROM country WHERE local_code = ?", [code], needResult);
        return _data[0].id ? _data[0] : null;
    }

    /*
     * Get all countries codes
     *
     * @return {array of objects}
     */
    getAllCountriesCodes()
    {
        return this.getBySql("SELECT c.local_code FROM country");
    }

}

CountriesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountriesModel;