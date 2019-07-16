/*
 * File application/express/models/dbase/mysql/CountryStatesCitiesTranslations.js
 * const CountryStatesCitiesTranslationsModel = require('application/express/models/dbase/mysql/CountryStatesCitiesTranslations');
 *
 * Country states cities translations MySql db model - collect translations for cities and stated
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class CountryStatesCitiesTranslationsModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

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
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = 'country_states_cities_translations';
        }
        return this.tableName;
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

        let _sql = "SELECT ct.*, cs.url_code FROM country c \n\
                    LEFT JOIN country_states_cities_translations ct on c.id = ct.country_id \n\
                    LEFT JOIN country_states cs on cs.id = ct.only_for_state \n\
                    WHERE c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=0";

        return this.getBySql(_sql, [countryCode, stateName, language], needResult);
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
        let _sql = "SELECT ct.translate \n\
            FROM country c \n\
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id \n\
            LEFT JOIN country_states cs on cs.id = ct.only_for_state \n\
            WHERE cs.url_code = ? AND c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=1 \n\
            LIMIT 1";

            return this.getBySql(_sql, [stateCode, countryCode, cityName, language], needResult)[0];
        } else {
            let _sql = "SELECT ct.translate \n\
            FROM country c \n\
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id \n\
            LEFT JOIN country_states cs on cs.id = ct.only_for_state \n\
            WHERE c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=1 \n\
            LIMIT 1";

            return this.getBySql(_sql, [countryCode, cityName, language], needResult)[0];
        }
    }

}

CountryStatesCitiesTranslationsModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesCitiesTranslationsModel;














