/*
 * File application/express/models/dbase/mysql/CountryStatesCitiesTranslations.js
 * const CountryStatesCitiesTranslationsModel = require('application/express/models/dbase/mysql/CountryStatesCitiesTranslations');
 *
 * Country states and cities translations MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');



class CountryStatesCitiesTranslationsModel extends DBaseMysql
{
    constructor()
    {
        super();

        this.tableName;

        this.fields = {
            country_id: {
                'rules': ['numeric', 'required'],
            },
            state_id: {
                'rules': ['numeric', 'required'],
            },
            language: {
                'rules': ['required'],
            },
            google_name: {
                'rules': ['required'],
            },
            translate: {
                'rules': ['required'],
            },
            only_for_state: {
                'rules': [],
            },
        };

        this.snapshotFieldsData();
    }

    /*
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName()
    {
        if (!this.tableName) {
            this.tableName = 'country_states_cities_translations';
        }
        return this.tableName;
    }

    /*
     * Translate state name
     *
     * @param {string} language - in what language country name will be get
     * @param {string} countryCode - country code
     * @param {string} stateName - state name
     *
     * @return {string}
     */
    translateStateName(language, countryCode, stateName)
    {
        let _sql = "SELECT ct.*, cs.url_code \n\
            FROM country c \n\
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id \n\
            LEFT JOIN country_states cs on cs.id = ct.only_for_state \n\
            WHERE c.local_code = ? AND ct.google_name = ? AND language = ? AND is_city=0";

        return this.getBySql(_sql, [countryCode, stateName, language], false);
    }

}

CountryStatesCitiesTranslationsModel.instanceId = BaseFunctions.unique_id();

module.exports = CountryStatesCitiesTranslationsModel;