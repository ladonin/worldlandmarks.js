/*
 * File application/express/models/dbase/mysql/CountryStates.js
 * const CountryStatesModel = require('application/express/models/dbase/mysql/CountryStates');
 *
 * Country states MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');


class CountryStatesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.COUNTRY_STATES;

        this.fields = {
            url_code: {
                'rules': ['required'],
            },
            country_id: {
                'rules': ['numeric', 'required'],
            }
        };

        this.snapshotFieldsData();
    }


    /*
     * Add unique record
     *
     * @param {object} - new record data
     *
     * @return {integer or false} - new record id or false if record already exist or has wrong data
     */
    addOnce(data)
    {
        if (data['url_code'] !== Consts.UNDEFINED_VALUE) {
            if (data['url_code'] && data['country_id']) {
                let _result = this.getByCondition(
                        "url_code = ? AND country_id = ?",
                        '',
                        '',
                        'count(*) as c',
                        [data['url_code'],data['country_id']],
                        1,
                        false);
                if (_result[0]['c'] === 0) {
                    return this.add(data);
                }
            }
        }
        return false;
    }

    /*
     * Get state id by state code
     *
     * @param {string} code - state code
     *
     * @return {integer}
     */
    getStateIdByCode(code, needResult = true)
    {
        let _data = this.getBySql("SELECT id FROM country_states WHERE url_code = ?", [code], needResult);
        return _data[0].id ? _data[0].id : null;
    }







    /*
     * Check - is the state administrative center. For example - Moscow, Saint Perersburg, Wien, Bern, London.
     * It is not state but stands on one level
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     * @return {boolean}
     */
    isAdministrativeCenter(countryCode, stateCode)
    {
        let _sql = `SELECT cs.is_administrative_center
                    FROM country c
                    LEFT JOIN country_states cs on c.id = cs.country_id
                    WHERE c.local_code = ? AND cs.url_code=?`;

        let _data = this.getBySql(_sql, [countryCode, stateCode]);
        return _data[0].is_administrative_center === 1 ? true : false;
    }



}

CountryStatesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesModel;