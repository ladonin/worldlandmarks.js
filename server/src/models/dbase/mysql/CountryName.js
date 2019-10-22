/*
 * File server/src/models/dbase/mysql/CountryName.js
 * const CountryNameModel = require('server/src/models/dbase/mysql/CountryName');
 *
 * Country name MySql db model - country names in all available languages
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');


class CountryNameModel extends DBaseMysql
{
    constructor()
    {
        super();

        this.tableNameInit = this.tableInitNames.COUNTRY_NAME;

        this.fields = {
            country_id:{
                'rules':['numeric', 'required'],
            },
            name:{
                'rules':['required'],
            },
            language:{
                'rules':['required'],
            },
        };

        this.snapshotFieldsData();
    }


    /*
     * Get country name by country code
     *
     * @param {string} code - country code
     * @param {string} language - in what language country name will be get
     * @param {boolean} needResult - whether result is required
     *
     * @return {string} - country name
     */
    getCountryNameByCode(code, language, needResult = true)
    {
        let _sql = `SELECT cn.name as name FROM ${this.getTableName(this.tableInitNames.COUNTRY)} c
                    LEFT JOIN ${this.getTableName()} cn on c.id = cn.country_id
                    WHERE c.local_code = ? AND cn.language = ?`;

        let _data = this.getBySql(_sql, [code, language], needResult);

        return _data[0].name ? _data[0].name : null;
    }
}

CountryNameModel.instanceId = BaseFunctions.uniqueId();
module.exports = CountryNameModel;