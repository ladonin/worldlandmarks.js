/*
 * File application/express/components/Countries.js
 * const Countries = require('application/express/components/Countries');
 *
 * Countries component - compute countries data
 */

const Component = require('application/express/core/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const CountriesNamesReplaces = require('application/express/settings/countries/CountriesNamesReplaces');
const CountriesModel = require('application/express/models/dbase/mysql/Countries');
const CountryNameModel = require('application/express/models/dbase/mysql/CountryName');
const CountryStatesModel = require('application/express/models/dbase/mysql/CountryStates');
const CountryStatesCitiesTranslationsModel = require('application/express/models/dbase/mysql/CountryStatesCitiesTranslations');

class Countries extends Component {

    constructor() {
        super();

        /*
         * Countries names to be replaced (with long names, for example United States of America -> USA)
         */
        this.countriesNamesReplaces = CountriesNamesReplaces;
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
     * Get country name from request
     *
     * @return {string}
     */
    getCountryNameFromRequest()
    {
        let _country = this.getFromRequest(Consts.CATALOG_COUNTRY_VAR_NAME)
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

        if (!BaseFunctions.isString(code) || !code) {
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

//get_all_countries_list getAllCountriesList => this.getCountries
////ATTENTION - обратите внимание
//сначала назывался get_all_countries_list,
// запрашивал MY_MODEL_NAME_DB_GEOCODE_COLLECTION.get_countries, там делал запрос в таблицу countries
// в итоге все запросы (MY_MODEL_NAME_DB_GEOCODE_COLLECTION.get_countries и this.getAllCountriesList) идут в новый метод this.getCountries
//getAllCountriesList() => this.getCountries



    /*
     * Get all countries
     *
     * @return {array of objects}
     */
    getCountries()
    {
        let _language = this.getLanguage();

        return this.getByCondition(
                "language = ? AND country_code!=? AND country_code!=''",
                'country',
                '',
                'DISTINCT country, country_code',
                [_language, Consts.UNDEFINED_VALUE],
                undefined,
                false);
    }

// //ATTENTION - обратите внимание get_all_countries_codes => CountriesModel.getAllCountriesCodes


// //ATTENTION - обратите внимание translateStateNames => translateStateName

// //ATTENTION - обратите внимание translateStateName => getTranslationOfStateName
// //ATTENTION - обратите внимание translateCityNames => getTranslationOfCityName



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

        if (_result = this.cache.get('countriesTranslateStates', _serviceName, _language)[language][countryCode][stateCode][stateName]) {
            return _result;
        }

        let _datas = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getStateTranslation(countryCode, stateName, language, false);

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

        this.cache.get('countriesTranslateStates', _serviceName, _language)[language][countryCode][stateCode][stateName] = _result;

        return _result;
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

        if (_result = this.cache.get('countriesTranslateCities', _serviceName, _language)[language][countryCode][stateCode][cityName]) {
            return _result;
        }

        let _data = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getCityTranslation(countryCode, stateCode, cityName, language, true, false);

        if (!_data['translate']) {
            // It means that country have no states (small country) (or API thinks so)
            // Then try to get translation for city without relation to state
            _data = CountryStatesCitiesTranslationsModel.getInstance(this.requestId).getCityTranslation(countryCode, stateCode, cityName, language, false, false);
        }

        if (_data['translate']) {
            _result = _data['translate'];
        }

        if (!_result) {
            // Default
            _result = cityName;
        }

        this.cache.get('countriesTranslateCities', _serviceName, _language)[language][countryCode][stateCode][cityName] = _result;

        return _result;
    }

}

Countries.instanceId = BaseFunctions.unique_id();
module.exports = Countries;


/*






 <?php

 namespace components\app;

 use \core\component;
 use \components\app as components;

 final class Countries extends Component
 {

 use \core\traits\patterns\t_singleton;

 // можно искать через базу данных адресов, но лучше не насиловать базу и явно прописать их, это ведь константы
 protected $countries_data;
 protected $countries_names_replaces;





 private function __construct()
 {

 }




























 public function is_administrative_center($country_code, $state_code)
 {
 if (($country_code == MY_UNDEFINED_VALUE) || ($state_code == MY_UNDEFINED_VALUE)) {
 // например в случае, если гугл не знает местопложения и country_code или state_code от этого стал undefined
 return false;
 }

 if (my_is_not_empty($result = @$this->countries_states_is_administrative_center_requested_data[$country_code][$state_code])) {
 return $result;
 }

 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT cs.is_administrative_center
 FROM country c
 LEFT JOIN country_states cs on c.id = cs.country_id
 WHERE c.local_code = '".$country_code."' AND cs.url_code='".$state_code."'";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

 $result = isset($data['is_administrative_center']) ? (boolean)$data['is_administrative_center'] : false;
 $this->countries_states_is_administrative_center_requested_data[$country_code][$state_code] = $result;

 return $result;
 }








 public function has_states($country_code)
 {
 if ($country_code == MY_UNDEFINED_VALUE) {
 // например в случае, если гугл не знает местопложения и country_code от этого стал undefined
 return false;
 }

 if (my_is_not_empty($result = @$this->countries_has_states_requested_data[$country_code])) {
 return $result;
 }

 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT cp.has_states
 FROM country c
 LEFT JOIN country_params cp on c.id = cp.country_id
 WHERE c.local_code = '".$country_code."'";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

 $result = isset($data['has_states']) ? (boolean)$data['has_states'] : false;
 $this->countries_has_states_requested_data[$country_code] = $result;

 return $result;
 }


 public function get_country_code_from_url()
 {

 $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);

 if ($country_code == MY_UNDEFINED_VALUE) {
 return $country_code;
 }

 if (my_is_not_empty($result = @$this->countries_code_requested_data[$country_code])) {
 return $result;
 }

 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT count(*) as count
 FROM country c
 WHERE c.local_code = '".$country_code."'";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

 if ($data['count'] > 0) {
 $this->countries_code_requested_data[$country_code] = $country_code;
 return $country_code;
 }

 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
 }


 public function get_country_params_by_code($country_code)
 {
 if (my_is_not_empty($result = @$this->countries_params_requested_data[$country_code])) {
 return $result;
 }

 $country_data = $this->get_country_data_by_code($country_code);
 $country_id = $country_data['id'];


 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT *
 FROM country_params cp
 WHERE cp.country_id = '".$country_id."'";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

 if ($data) {
 $this->countries_params_requested_data[$country_code] = $data;
 return $data;
 }
 }






 public function get_state_name_by_get_var($need_result = true)
 {
 $state = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);
 $language_component = components\Language::get_instance();
 $language = $language_component->getLanguage();
 $result = $this->get_state_name_by_code($state, $need_result);
 return $result;
 }


 public function get_state_and_country_name_by_code($country_code = null, $state_code = null)
 {
 if (my_is_empty(@$state_code)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'state_code:' . $state_code));
 }
 if (my_is_empty(@$country_code)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
 }
 return array(
 'state' => $this->get_state_name_by_code($state_code),
 'country' => $this->get_country_name_by_code($country_code),
 );
 }


 }










 public function get_country_data_by_id($id = null)
 {

 if (my_is_empty((int)$id)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id:' . $id));
 }

 $id = (int)$id;

 if (my_is_not_empty($result = @$this->countries_data_by_id_requested_data[$id])) {
 return $result;
 }

 $data = self::get_model(MY_MODEL_NAME_DB_COUNTRY)->get_by_id($id);

 $result = isset($data['id']) ? $data : null;

 if (my_is_empty($result)) {
 self::concrete_error(array(MY_ERROR_COUNTRY_DATA_WAS_NOT_FOUND, 'id:' . $id));
 }

 $this->countries_data_by_id_requested_data[$id] = $result;
 return $result;
 }









 public function get_state_name_by_code($state_code = null, $need_result = true)
 {

 if (my_is_empty(@$state_code)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'state_code:' . $state_code));
 }


 if (my_is_not_empty($result = @$this->countries_state_name_by_code_requested_data[$state_code])) {
 return $result;
 }


 $language_component = components\Language::get_instance();
 $language = $language_component->getLanguage();
 $connect = \core\DBase_Mysql::model()->get_connect();
 $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);


 $sql = "SELECT csgn.name
 FROM country_states cs
 LEFT JOIN country_states_names csgn on cs.id = csgn.state_id
 WHERE cs.url_code = '".$state_code."' AND csgn.language = '".$language."'";

 $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();

 $result = isset($data['name']) ? $data['name'] : null;

 if (my_is_empty($result) && $need_result) {
 self::concrete_error(array(MY_ERROR_COUNTRY_STATE_NAME_WAS_NOT_FOUND, 'state_code:' . $state_code));
 }

 $result = $this->translate_state_names($language, $country_code, $result, $state_code);
 $this->countries_state_name_by_code_requested_data[$state_code] = $result;
 return $result;
 }
 }
 */