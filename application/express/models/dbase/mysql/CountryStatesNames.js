/*
 * File application/express/models/dbase/mysql/CountryStatesNames.js
 * const CountryStatesNamesModel = require('application/express/models/dbase/mysql/CountryStatesNames');
 *
 * Country states names MySql db model - how map api names states. Initially names were got from google map api.
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class CountryStatesNamesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            state_id:{
                'rules':['numeric', 'required'],
            },
            name:{
                'rules':['required'],
            },
            language:{
                'rules':[],
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
            this.tableName = 'country_states_names';
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
        if (data['state_id'] && data['name'] && data['language']) {
            let _result =  this.getByCondition(
                    "state_id = ? AND name = ? AND language = ?",
                    '',
                    '',
                    'count(*) as c',
                    [data['state_id'], data['name'], data['language']],
                    1,
                    false);
            if (_result[0]['c'] === 0) {
                return this.add(data);
            }
        }
        return false;
    }



    /*
     * Get state name by state code
     *
     * @param {string} code - state code
     * @param {string} language - in what language state name will be get
     * @param {boolean} needResult - is result required
     *
     * @return {string} - state name
     */
    getStateNameByCode(code, language, needResult = true){

        let _sql = `SELECT csn.name
                    FROM country_states cs
                    LEFT JOIN country_states_names csn on cs.id = csn.state_id
                    WHERE cs.url_code = ? AND csn.language = ?`;

        let _data = this.getBySql(_sql, [code, language], needResult);

        return _data[0].name ? _data[0].name : null;
    }











}

CountryStatesNamesModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesNamesModel;