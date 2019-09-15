/*
 * File server/src/models/dbase/mysql/CountryStatesCitiesTranslations.js
 * const CountryStatesCitiesTranslationsModel = require('server/src/models/dbase/mysql/CountryStatesCitiesTranslations');
 *
 * Country states cities translations MySql db model - collect translations for cities and stated
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');


class CountryStatesCitiesTranslationsModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.COUNTRY_STATES_CITIES_TRANSLATIONS;

        this.fields = {
            country_id:{
                'rules':['numeric', 'required'],
            },
            state_id:{
                'rules':['numeric', 'required'],
            },
            language:{
                'rules':['required'],
            },
            google_name:{
                'rules':['required'],
            },
            translate:{
                'rules':['required'],
            },
            only_for_state:{
                'rules':[],
            }
        };

        this.snapshotFieldsData();
    }


    /*
     * Get state translation
     *
     * @param {string} countryCode - country code
     * @param {string} stateName - state name
     * @param {string} language - on what language translate
     * @param {boolean} needResult - is result required
     *
     * @return {string} - translated state name
     */
    getStateTranslation(countryCode, stateName, language, needResult = true){

        let _sql = `SELECT ct.*, cs.url_code FROM ${this.getTableName(this.tableInitNames.COUNTRY)} c
                    LEFT JOIN ${this.getTableName()} ct on c.id = ct.country_id
                    LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY_STATES)} cs on cs.id = ct.only_for_state
                    WHERE c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=0`;

        return this.getBySql(_sql, [countryCode, stateName, language], needResult);
    }

    /*
     * Get translation of state name
     *
     * @param {string} language - on what language will be translated
     * @param {string} countryCode - country code
     * @param {string} stateName - state name
     * @param {string} stateCode - state code
     *
     * @return string - translated state name
     */
    getTranslationOfStateName(language, countryCode, stateName, stateCode)
    {
        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('translationsOfStateNames', _serviceName, _language)[language+'%'+countryCode+'%'+stateCode+'%'+stateName]) {
            return _result;
        }

        let _datas = this.getStateTranslation(countryCode, stateName, language, false);

        if (_datas.length === 1) {
            if ((!_datas[0]['url_code']) || (_datas[0]['url_code'] === stateCode)) {
                _result = _datas[0]['translate'];
            }
        } else {
            for (let _index in _datas) {

                let _data = _datas[_index];
                if (_data['url_code'] === stateCode) {
                    _result = _data['translate'];
                }
            }
        }
        if (!_result) {
            // Default
            _result = stateName;
        }

        this.cache.get('translationsOfStateNames', _serviceName, _language)[language+'%'+countryCode+'%'+stateCode+'%'+stateName] = _result;

        return _result;
    }


    /*
     * Get city translation
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     * @param {string} cityName - city name
     * @param {string} language - on what language translate
     * @param {boolean} countryHaveStates - is country have states or not (small country)
     * @param {boolean} needResult - is result required
     *
     * @return {string} - translated state name
     */
    getCityTranslation(countryCode, stateCode, cityName, language, countryHaveStates = true, needResult = true){
        if (countryHaveStates) {
        let _sql = `SELECT ct.translate
            FROM ${this.getTableName(this.tableInitNames.COUNTRY)} c
            LEFT JOIN ${this.getTableName()} ct on c.id = ct.country_id
            LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY_STATES)} cs on cs.id = ct.only_for_state
            WHERE cs.url_code = ? AND c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=1
            LIMIT 1`;

            return this.getBySql(_sql, [stateCode, countryCode, cityName, language], needResult)[0];
        } else {
            let _sql = `SELECT ct.translate
            FROM ${this.getTableName(this.tableInitNames.COUNTRY)} c
            LEFT JOIN ${this.getTableName()} ct on c.id = ct.country_id
            LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY_STATES)} cs on cs.id = ct.only_for_state
            WHERE c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=1
            LIMIT 1`;

            return this.getBySql(_sql, [countryCode, cityName, language], needResult)[0];
        }
    }

}

CountryStatesCitiesTranslationsModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesCitiesTranslationsModel;














