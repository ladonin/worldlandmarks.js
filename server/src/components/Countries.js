/*
 * File server/src/components/Countries.js
 * const Countries = require('server/src/components/Countries');
 *
 * Countries component - compute countries data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const CountriesModel = require('server/src/models/dbase/mysql/Countries');
const CountryNameModel = require('server/src/models/dbase/mysql/CountryName');
const CountryStatesModel = require('server/src/models/dbase/mysql/CountryStates');
const CountryStatesCitiesTranslationsModel = require('server/src/models/dbase/mysql/CountryStatesCitiesTranslations');
const CountryParamsModel = require('server/src/models/dbase/mysql/CountryParams');
const CountryStatesNamesModel = require('server/src/models/dbase/mysql/CountryStatesNames');
const CountriesNamesReplaces = require('server/src/settings/CountriesNamesReplaces');
const GeocodeCollectionModel = require('server/src/models/dbase/mysql/GeocodeCollection');

class Countries extends Component
{

    constructor()
    {
        super();

        /*
         * Countries names to be replaced (with long names, for example United States of America -> USA)
         */
        this.countriesNamesReplaces = CountriesNamesReplaces;
    }


    /*
     * return all countries data
     *
     * @param {boolean} withPlacemarks - select countries with only placemarks or all
     *
     * @return {array of objects}
     */
    getCountriesData(withPlacemarks = false)
    {
        let _result = [];

        let _countriesCodes = withPlacemarks === false
            ? CountriesModel.getInstance(this.requestId).getAllCountriesCodes()
            : GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksCountriesCodes();

        for (let _index in _countriesCodes) {
            let _code = _countriesCodes[_index].local_code
                ? _countriesCodes[_index].local_code
                : _countriesCodes[_index].country_code;
            _result.push({
                code:_code,
                name:this.getCountryNameByCode(_code)
            });
        }
        return _result;
    }


    /*
     * Prepare country name
     *
     * @param {string} name - country name
     *
     * @return {string} - prepared name
     */
    prepareCountryName(name)
    {
        if (!name) {
            return this.getText('countries/undefined/name');
        }

        for (let _replacedName in this.countriesNamesReplaces) {

            let _replace = this.countriesNamesReplaces[_replacedName];
            if (name === _replacedName) {
                return _replace;
            }
        }

        return name;
    }


    /*
     * Prepare name for all countries
     *
     * @param {array of objects} countries - countries data
     *
     * @return {array of objects} - prepared countries data
     */
    prepareCountriesNames(countries)
    {

        for (let _index in countries) {
            countries[_index]['country'] = this.prepareCountryName(countries[_index]['country']);
        }
        return countries;
    }


    /*
     * Get country name from request
     *
     * @return {string}
     */
    getCountryNameFromRequest()
    {
        let _country = this.getFromRequest(Consts.COUNTRY_VAR_NAME)
        return this.getCountryNameByCode(_country);
    }


    /*
     * Get country name by country code
     *
     * @param {string} code - country code
     *
     * @return {string}
     */
    getCountryNameByCode(code)
    {
        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (!BaseFunctions.isString(code, this) || !code) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + code + ']', undefined, false);
        }

        if (code === Consts.UNDEFINED_VALUE) {
            return this.getText('countries/undefined/name');
        }

        if (_result = this.cache.get('countriesNameByCode', _serviceName, _language)[code]) {
            return _result;
        }

        let _countryName = CountryNameModel.getInstance(this.requestId).getCountryNameByCode(code, _language, false);

        if (!_countryName) {
            this.error(ErrorCodes.ERROR_COUNTRY_NAME_WAS_NOT_FOUND, 'country code [' + code + ']');
        }

        this.cache.get('countriesNameByCode', _serviceName, _language)[code] = _countryName;

        return _countryName;
    }


    /*
     * Get country data by country code
     *
     * @param {string} code - country code
     *
     * @return {object}
     */
    getCountryDataByCode(code)
    {
        if (!code) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + code + ']');
        }

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('countriesDataByCode', _serviceName, _language)[code]) {
            return _result;
        }

        let _countryData = CountriesModel.getInstance(this.requestId).getCountryDataByCode(code, false);
        if (!_countryData) {
            this.error(ErrorCodes.ERROR_COUNTRY_DATA_WAS_NOT_FOUND, 'country code [' + code + ']');
        }

        this.cache.get('countriesDataByCode', _serviceName, _language)[code] = _countryData;

        return _countryData;
    }


    /*
     * Get translation of city name
     * Example: (for russian language):
     *     'Matale' (translates to)=> 'Матале'
     *
     * @param {string} countryCode - country code
     * @param {string} cityName - city name
     * @param {string} stateCode - state code
     * @param {string} language - on what language will be translated
     *
     * @return {string} - подготовленное имя города
     */
    getTranslationOfCityName(countryCode, cityName, stateCode, language)
    {
        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('countriesTranslateCities', _serviceName, _language)[language+'%'+countryCode+'%'+stateCode+'%'+cityName]) {
            return _result;
        }

        let _data = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getCityTranslation(countryCode, stateCode, cityName, language, true, false);

        if (!_data || !_data['translate']) {
            // It means that country have no states (small country) (or API thinks so)
            // Then try to get translation for city without relation to state
            _data = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getCityTranslation(countryCode, stateCode, cityName, language, false, false);
        }

        if (_data && _data['translate']) {
            _result = _data['translate'];
        }

        if (!_result) {
            // Default
            _result = cityName;
        }

        this.cache.get('countriesTranslateCities', _serviceName, _language)[language+'%'+countryCode+'%'+stateCode+'%'+cityName] = _result;

        return _result;
    }


    /*
     * Check - is the state administrative center. For example - Moscow, Saint Perersburg, Wien, Bern, London.
     * It is not state but stands on one level
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     *@return {boolean}
     */
    isAdministrativeCenter(countryCode, stateCode)
    {
        if ((countryCode === Consts.UNDEFINED_VALUE) || (stateCode === Consts.UNDEFINED_VALUE)) {
            return false;
        }
        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('administrativeCenters', _serviceName, _language)[countryCode+'%'+stateCode]) {
            return _result;
        }

        _result = CountryStatesModel.getInstance(this.requestId).isAdministrativeCenter(countryCode, stateCode);

        this.cache.get('administrativeCenters', _serviceName, _language)[countryCode+'%'+stateCode] = _result;

        return _result;
    }


    /*
     * Check if country has states
     *
     * @param {string} countryCode - country code
     *
     *@return {boolean}
     */
    hasStates(countryCode)
    {
        if (countryCode === Consts.UNDEFINED_VALUE) {
            return false;
        }

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('countriesHaveStates', _serviceName, _language)[countryCode]) {
            return _result;
        }

        _result = CountryParamsModel.getInstance(this.requestId).hasStates(countryCode);

        this.cache.get('countriesHaveStates', _serviceName, _language)[countryCode] = _result;

        return _result;
    }


    /*
     * Get country code from request url
     *
     * @return {string}
     */
    getCountryCodeFromRequest()
    {
        let _countryCode = this.getFromRequest(Consts.ACTION_NAME_COUNTRY);
        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_countryCode === Consts.UNDEFINED_VALUE) {
            return _countryCode;
        }

        if (_result = this.cache.get('countriesCodes', _serviceName, _language)[_countryCode]) {
            return _result;
        }

        let _exist = CountriesModel.getInstance(this.requestId).checkCountryCode(_countryCode);

        if (_exist === true) {
            this.cache.get('countriesCodes', _serviceName, _language)[_countryCode] = _countryCode;
            return _countryCode;
        }
        this.error(ErrorCodes.ERROR_WRONG_GET_VALUE, 'country [' + _countryCode + ']', undefined, false);
    }


    /*
     * Get country parameters by country code
     *
     * @param {string} countryCode - country code
     *
     *@return {object}
     */
    getCountryParamsByCode(countryCode)
    {

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('countriesParams', _serviceName, _language)[countryCode]) {
            return _result;
        }

        let _countryData = this.getCountryDataByCode(countryCode);
        let _countryId = _countryData['id'];

        let _data = CountryParamsModel.getInstance(this.requestId).getParams(_countryId, false);

        if (_data) {
            this.cache.get('countriesParams', _serviceName, _language)[countryCode] = _data;
            return _data;
        }

        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + countryCode + ']', undefined, false);
    }


    /*
     * Get state name from request url
     *
     * @param {boolean} needResult - whether result is required
     *
     * @return {string}
     */
    getStateNameFromRequest(needResult = true)
    {

        let _stateCode = this.getFromRequest(Consts.STATE_VAR_NAME, needResult);
        if (!_stateCode && needResult === false) {
            return null;
        }
        return this.getStateNameByCode(_stateCode, needResult);
    }


    /*
     * Get state name by state code
     *
     * @param {string} stateCode - state code
     * @param {boolean} needResult - whether result is required
     *
     * @return {string}
     */
    getStateNameByCode(stateCode, needResult = true)
    {
        if (!stateCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state code [' + stateCode + ']', undefined, false);
        }

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('stateNameByCode', _serviceName, _language)[stateCode]) {
            return _result;
        }

        let _countryCode = this.getFromRequest(Consts.COUNTRY_VAR_NAME);
        let _stateName = CountryStatesNamesModel.getInstance(this.requestId).getStateNameByCode(stateCode, _language, false)

        if (!_stateName && needResult) {
            this.error(ErrorCodes.ERROR_COUNTRY_STATE_NAME_WAS_NOT_FOUND, 'state code [' + stateCode + ']', undefined, false);
        }

        _stateName = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getTranslationOfStateName(_language, _countryCode, _stateName, stateCode);

        this.cache.get('stateNameByCode', _serviceName, _language)[stateCode] = _stateName;

        return _stateName;
    }


    /*
     * Get state and country names by their codes
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     * @return {string}
     */
    getStateAndCountryNameByCode(countryCode, stateCode)
    {
        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + countryCode + ']', undefined, false);
        }
        if (!stateCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state code [' + stateCode + ']', undefined, false);
        }

        return {
            'state': this.getStateNameByCode(stateCode),
            'country': this.getCountryNameByCode(countryCode),
        };
    }


    /*
     * Get state and country names by their codes
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - state code
     *
     * @return {string}
     */
    getСountryDataById(id)
    {
        id = parseInt(id);

        if (!id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country id [' + id + ']', undefined, false);
        }

        let _result;
        let _language = this.getLanguage();
        let _serviceName = this.getServiceName();

        if (_result = this.cache.get('countriesDataById', _serviceName, _language)[id]) {
            return _result;
        }

        _result = CountriesModel.getInstance(this.requestId).getById(id);

        if (!_result) {
            this.error(ErrorCodes.ERROR_COUNTRY_DATA_WAS_NOT_FOUND, 'country id [' + id + ']', undefined, false);
        }

        this.cache.get('countriesDataById', _serviceName, _language)[id] = _result;
        return _result;
    }


    /*
     * Return country code by id
     *
     * @param {integer} id - country id
     *
     * @return {string}
     */
    getСountryCodeById(id)
    {
        return this.getСountryDataById(id)['local_code'];
    }
}

Countries.instanceId = BaseFunctions.uniqueId();
module.exports = Countries;