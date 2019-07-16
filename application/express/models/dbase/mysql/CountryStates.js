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

        this.tableName;

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
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = 'country_states';
        }
        return this.tableName;
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

}

CountryStatesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesModel;