/*
 * File server/src/models/dbase/mysql/GeocodeCollection.js
 * const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');
 *
 * Geocode collection MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const CountryStatesCitiesTranslationsModel = require('server/src/models/dbase/mysql/CountryStatesCitiesTranslations');

class GeocodeCollectionModel extends DBaseMysql
{
    constructor()
    {
        super();

        this.tableNameInit = this.tableInitNames.GEOCODE_COLLECTION;

        this.fields = {
            map_data_id:{
                // Правила валидации значений поля
                rules:['numeric', 'required']
            },
            language:{
                rules:['required']
            },
            country_code:{
                rules:[],
                // If you pass an empty value then field will have the default value
                'default_value': Consts.UNDEFINED_VALUE,
                // If you don't pass any value to this field at all then field will have this initial value
                'value': Consts.UNDEFINED_VALUE
            },
            state_code:{
                rules:[],
                'default_value': Consts.UNDEFINED_VALUE,
                'value': Consts.UNDEFINED_VALUE
            },
            json_data:{
                rules:[]
            },
            formatted_address:{
                rules:[]
            },
            street:{
                rules:[]
            },
            country:{
                rules:[]
            },
            administrative_area_level_1:{
                rules:[]
            },
            administrative_area_level_2:{
                rules:[]
            },
            locality:{
                rules:[]
            }
        };

        this.snapshotFieldsData();
    }


    /*
     * Delete all records of placemark for all languages or only specific language
     *
     * @param {integer} id - placemark id
     * @param {string} language - language which data will be deleted
     */
    deleteAdresses(id, language = null)
    {
        if (!id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + id + ']');
        }

        let _condition = "map_data_id=" + id;
        if (language) {
            _condition += " AND language='" + language + "'";
        }
        let _results = this.getByCondition(_condition, '', '', '*', undefined, undefined, false);

        for (let _index in  _results) {
            let _result = _results[_index];
            this.delete(_result['id']);
        }
    }


    /*
     * Update placemark's geodata
     *
     * @param {object} coords - new coordinates
     * @param {integer} dataId - placemark id
     *
     * @return {boolean(false)} or {array of objects} - new geodata on all available languages
     */
    updateRecord(coords, dataId)
    {
        if (coords['x'] && coords['y']) {

            // Delete all old records for this placemark
            this.deleteAdresses(dataId);

            //Add new
            return this.add(coords, dataId);
        }
        return false;
    }


    /*
     * Return data of all countries
     *
     * @param {string} language
     *
     * @return {array of objects}
     */
    getCountriesData(language)
    {
        return this.getByCondition(
            /*condition*/"language=? AND country_code != ''",
            /*order*/'country ASC',
            /*group*/'country_code',
            /*select*/'country, country_code, state_code, COUNT(country_code) as placemarks_count',
            /*where_values*/[language],
            /*limit*/false,
            /*needresult*/false
        );
    }


    /*
     * Return all countries codes
     *
     * @return {array of objects}
     */
    getPlacemarksCountriesCodes()
    {
        return this.getByCondition(
            /*condition*/"1",
            /*order*/'',
            /*group*/'',
            /*select*/'DISTINCT country_code',
            /*where_values*/[],
            /*limit*/false,
            /*needresult*/false
        );
    }


    /*
     * Check placemark by set address
     *
     * @param {integer} id - placemark id
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     * @return {boolean}
     */
    checkPlacemark(id, countryCode, stateCode)
    {
        id = parseInt(id);

        let _condition = "map_data_id = ? AND country_code = ? ";
        let _whereValues = [id, countryCode];

        if (stateCode) {
            _condition += "AND state_code = ?";
            _whereValues.push(stateCode);
        }

        let _result = this.getByCondition(
            _condition,
            /*order*/'',
            /*group*/'',
            /*select*/'id',
            /*where_values*/_whereValues,
            /*limit*/1,
            /*needresult*/false
        );

        return _result[0]['id'] ? true : false;
    }


    /*
     * Return geodata by country and state codes
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {string} language
     * @param {boolean} needResult - whether result is required
     *
     * @return {object} - geodata of each found placemark
     */
    getPlacemarksData(countryCode, stateCode, language, needResult)
    {
        let _condition = "gc.language=?";
        let _whereArray = [language];

        if (countryCode) {
            _condition += " AND gc.country_code=?";
            _whereArray.push(countryCode);
        }
        if (stateCode) {
            _condition += " AND gc.state_code=?";
            _whereArray.push(stateCode);
        }

        let _sql = `SELECT DISTINCT
                gc.map_data_id as placemarks_id,
                gc.state_code, gc.country_code, gc.formatted_address,
                gc.country, gc.administrative_area_level_1 as state,
                gc.locality, cs.is_administrative_center
            FROM ${this.getTableName()} gc
            LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY_STATES)} cs on cs.url_code = gc.state_code
            WHERE ${_condition} ORDER by gc.id DESC`;

        return this.getBySql(_sql,_whereArray, needResult);
    }


    /*
     * Return placemarks ids of current country and, if set, state in current language
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {string} language
     *
     * @return {array of objects}
     */
    getPlacemarksIds(countryCode, stateCode, language)
    {
        let _condition = "(language=? OR language='" + Consts.LANGUAGE_EN + "') AND country_code=?";
        let _where_values = [language, countryCode];
        if (stateCode) {
            _condition += " AND state_code=?";
            _where_values.push(stateCode);
        }

        this.getByCondition(
            _condition,
            /*order*/'id DESC',
            /*group*/'',
            /*select*/'DISTINCT map_data_id as placemark_id',
            _where_values,
            /*limit*/false,
            /*needresult*/false
        );
    }


    /*
     * Return placemarks count in current country
     *
     * @param {string} countryCode - country code
     *
     * @return {integer}
     */
    getPlacemarksCountInCountry(countryCode)
    {
        return this.getByCondition(
            /*condition*/"language='" + Consts.LANGUAGE_EN + "' AND country_code = ?",
            /*order*/'',
            /*group*/'country_code',
            /*select*/'COUNT(country_code) as placemarks_count',
            /*where_values*/[countryCode],
            /*limit*/1,
            /*needresult*/false
        )[0]['placemarks_count'];
    }


    /*
     * Return all country states
     *
     * @param {string} countryCode - country code
     * @param {string} language
     *
     * @return {array of objects}
     */
    getStates(countryCode, language)
    {
        return this.getByCondition(
            /*condition*/"language=? AND country_code=? AND state_code !='" + Consts.UNDEFINED_VALUE + "'",
            /*order*/'state ASC',
            /*group*/'',
            /*select*/'DISTINCT administrative_area_level_1 as state, state_code',
            /*where_values*/[language, countryCode],
            /*limit*/false,
            /*needresult*/false
        );
    }


    /*
     * Return breadcrumbs for placemark page
     *
     * @param {integer} idPlacemark - placemark id
     * @param {string} language
     * @param {boolean} needResult - whether result is required
     *
     * @return  {array of objects}
     */
    getBreadcrumbsForPlacemarkPage(idPlacemark, language, needResult = true)
    {
        return this.getByCondition(
            /*condition*/"language=? AND map_data_id=?",
            /*order*/'',
            /*group*/'',
            /*select*/'country, country_code, administrative_area_level_1 as state, state_code',
            /*where_values*/[language, idPlacemark],
            /*limit*/1,
            needResult
        )[0];
    }


    /*
     * Return breadcrumbs for state page
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     * @param {string} language
     * @param {boolean} needResult - whether result is required
     *
     * @return  {array of objects}
     */
    getBreadcrumbsForStatePage(countryCode, stateCode, language, needResult = true)
    {
        return this.getByCondition(
            /*condition*/"country_code=? AND state_code=? AND language=?",
            /*order*/'',
            /*group*/'',
            /*select*/'country, country_code, administrative_area_level_1 as state, state_code',
            /*where_values*/[countryCode, stateCode, language],
            /*limit*/1,
            needResult
        )[0];
    }


    /*
     * Return breadcrumbs for country page
     *
     * @param {string} countryCode - country code
     * @param {string} language
     * @param {boolean} needResult - whether result is required
     *
     * @return  {array of objects}
     */
    getBreadcrumbsForCountryPage(countryCode, language, needResult = true)
    {
        return this.getByCondition(
            /*condition*/"country_code=? AND language=?",
            /*order*/'',
            /*group*/'',
            /*select*/'country, country_code, administrative_area_level_1 as state, state_code',
            /*where_values*/[countryCode, language],
            /*limit*/1,
            needResult
        )[0];
    }
}

GeocodeCollectionModel.instanceId = BaseFunctions.uniqueId();
module.exports = GeocodeCollectionModel;