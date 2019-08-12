/*
 * File application/express/models/dbase/mysql/CountryParams.js
 * const CountryParamsModel = require('application/express/models/dbase/mysql/CountryParams');
 *
 * Country parameters MySql db model - stores country data
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class CountryParamsModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            country_id: {
                'rules': ['numeric', 'required'],
            },
            has_states: {
                'rules': ['numeric', 'required'],
            }
        };

        this.snapshotFieldsData();
    }

    /*
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = 'country_params';
        }
        return this.tableName;
    }

    /*
     * Check if country has states
     *
     * @param {string} countryCode - country code
     *
     *@return {boolean}
     */
    hasStates(countryCode) {

        let _sql = `SELECT cp.has_states
                    FROM country c
                    LEFT JOIN country_params cp on c.id = cp.country_id
                    WHERE c.local_code = ?`;

        let _data = this.getBySql(_sql, [countryCode]);
        return _data[0].has_states === 1 ? true : false;
    }






    /*
     * Get country parameters by country id
     *
     * @param {integer} countryId - country id
     * @param {boolean} needResult - is result required
     *
     *@return {boolean}
     */
    getParams(countryId, needResult = true) {

        let _result = this.getByCondition(
                /*condition*/"cp.country_id = ?",
                /*order*/'',
                /*group*/'',
                /*select*/'*',
                /*whereValues*/[countryId],
                /*limit*/1,
                needResult);
        return _result[0];
    }

}

CountryParamsModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryParamsModel;