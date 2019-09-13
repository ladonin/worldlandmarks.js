/*
 * File server/src/models/dbase/mysql/Countries.js
 * const CountriesModel = require('server/src/models/dbase/mysql/Countries');
 *
 * Countries MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');

class CountriesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.COUNTRY;

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


    /*
     * Get country data by country code
     *
     * @param {string} code - country code
     * @param {boolean} needResult - is result required
     *
     * @return {object} - country data
     */
    getCountryDataByCode(code, needResult = true) {
        let _data = this.getBySql("SELECT * FROM " + this.getTableName(this.tableInitNames.COUNTRY) + " WHERE local_code = ?", [code], needResult);
        return _data[0].id ? _data[0] : null;
    }

    /*
     * Get all countries codes
     *
     * @return {array of objects}
     */
    getAllCountriesCodes()
    {
        return this.getBySql("SELECT c.local_code FROM " + this.getTableName(this.tableInitNames.COUNTRY));
    }

    /*
     * Check country code
     *
     * @param {string} code - country code
     *
     * @return {boolean}
     */
    checkCountryCode(code)
    {
        let _result = this.getBySql("SELECT 1 as exist FROM " + this.getTableName(this.tableInitNames.COUNTRY) + " c WHERE c.local_code = ?", [code]);

        return _result.length ? true : false;
    }




    /*
     * Get all countries
     *
     * @return {array of objects}
     */
    getCountries()
    {
        let _language = this.getLanguage();

        return this.getByCondition(
                "language = ? AND country_code!=? AND country_code!=''",
                'country',
                '',
                'DISTINCT country, country_code',
                [_language, Consts.UNDEFINED_VALUE],
                undefined,
                false);
    }







}

CountriesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountriesModel;