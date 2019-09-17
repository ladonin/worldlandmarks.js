/*
 * File server/src/models/dbase/mysql/CountryParams.js
 * const CountryParamsModel = require('server/src/models/dbase/mysql/CountryParams');
 *
 * Country parameters MySql db model - stores country data
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');


class CountryParamsModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.COUNTRY_PARAMS;

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
     * Check if country has states
     *
     * @param {string} countryCode - country code
     *
     *@return {boolean}
     */
    hasStates(countryCode) {

        let _sql = `SELECT cp.has_states
                    FROM ${this.getTableName(this.tableInitNames.COUNTRY)} c
                    LEFT JOIN ${this.getTableName()} cp on c.id = cp.country_id
                    WHERE c.local_code = ?`;

        let _data = this.getBySql(_sql, [countryCode]);
        return _data[0].has_states === 1 ? true : false;
    }






    /*
     * Get country parameters by country id
     *
     * @param {integer} countryId - country id
     * @param {boolean} needResult - whether result is required
     *
     *@return {boolean}
     */
    getParams(countryId, needResult = true) {

        let _result = this.getByCondition(
                /*condition*/"country_id = ?",
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