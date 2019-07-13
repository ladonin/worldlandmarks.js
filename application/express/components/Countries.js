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

const Cache = require('application/express/components/base/Cache');

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

        if (_result = Cache.get('countriesNameByCode', _serviceName, _language)[code]) {
            return _result;
        }

        let _countryName = CountriesModel.getInstance(this.requestId).getCountryNameByCode(code, _language, false);

        Cache.get('countriesNameByCode', _serviceName, _language)[code] = _countryName;

        return _countryName;
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


 public function get_all_countries_codes()
 {
 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT c.local_code FROM country";
 return $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
 }


 public function get_all_countries_list()
 {
 $result = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION)->get_countries();

 return $result;
 }





 public function translate_state_names($language, $country_code, $state_name, $state_code)
 {
 if (my_is_not_empty($result = @$this->countries_translate_states_requested_data[$language][$country_code][$state_code][$state_name])) {
 return $result;
 }

 // Дефолтное значение
 $result = $state_name;

 $conn = \core\DBase_Mysql::model()->get_connect();
 $sql = "SELECT ct.*, cs.url_code
 FROM country c
 LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
 LEFT JOIN country_states cs on cs.id = ct.only_for_state
 WHERE c.local_code = \"".$country_code."\" AND ct.google_name = \"".$state_name."\" AND language = '".$language."' AND is_city=0";
 $datas = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
 if (count($datas) === 1) {
 if ((!$datas[0]['url_code']) || ($datas[0]['url_code'] === $state_code)) {
 $result = $datas[0]['translate'];
 }
 } else {
 foreach($datas as $data) {
 if ($data['url_code'] === $state_code) {
 $result = $data['translate'];
 }
 }
 }


 if (!$result) {
 // Дефолтное значение
 $result = $city_name;
 }


 $this->countries_translate_states_requested_data[$language][$country_code][$state_code][$state_name] = $result;

 return $result;
 }










 * Подготавливает имя города:
 * Пример (если у пользователя русский язык):
 *     'Matale' (преобразует в)=> 'Матале'
 *
 * @param {string} $country_code - код страны
 * @param {string} $state_name - имя города
 * @param {string} $state_code - код региона
 * @param {string} $language - язык
 *
 * @return {string} - подготовленное имя города

 public function translate_city_names($country_code, $city_name, $state_code, $language)
 {
 if (my_is_not_empty($result = @$this->countries_translate_cities_requested_data[$language][$country_code][$state_code][$city_name])) {
 return $result;
 }

 // Дефолтное значение
 $result = $city_name;

 $conn = \core\DBase_Mysql::model()->get_connect();



 $sql = "SELECT ct.translate
 FROM country c
 LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
 LEFT JOIN country_states cs on cs.id = ct.only_for_state
 WHERE cs.url_code = '" . $state_code . "' AND c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();


 if (!$data['translate']) {
 // значит страна без штатов (или гугл думает что в ней нет штатов) и надо подобрать перевод для города не относящегося к штату
 $sql = "SELECT ct.translate
 FROM country c
 LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
 LEFT JOIN country_states cs on cs.id = ct.only_for_state
 WHERE c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";

 $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

 }


 if ($data['translate']) {
 $result = $data['translate'];
 } else {
 // Дефолтное значение
 $result = $city_name;
 }

 $this->countries_translate_cities_requested_data[$language][$country_code][$state_code][$city_name] = $result;
 return $result;
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







 public function get_country_data_by_code($country_code = null)
 {

 if (my_is_empty(@$country_code)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
 }

 if (my_is_not_empty($result = @$this->countries_data_by_code_requested_data[$country_code])) {
 return $result;
 }

 $connect = \core\DBase_Mysql::model()->get_connect();

 $sql = "SELECT *
 FROM country
 WHERE local_code = ".$connect->quote($country_code);
 $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
 $result = isset($data['id']) ? $data : null;

 if (my_is_empty($result)) {
 self::concrete_error(array(MY_ERROR_COUNTRY_DATA_WAS_NOT_FOUND, 'country_code:' . $country_code));
 }

 $this->countries_data_by_code_requested_data[$country_code] = $result;
 return $result;
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



 public function get_state_id_by_code($state_code = null, $need_result = true)
 {

 if ($state_code == MY_UNDEFINED_VALUE) {
 return null;
 }

 if (my_is_empty(@$state_code)) {
 self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'state_code:' . $state_code));
 }


 if (my_is_not_empty($result = @$this->countries_state_id_by_code_requested_data[$state_code])) {
 return $result;
 }

 $connect = \core\DBase_Mysql::model()->get_connect();

 $sql = "SELECT id
 FROM country_states
 WHERE url_code = ".$connect->quote($state_code);

 $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();

 $result = isset($data['id']) ? $data['id'] : null;

 if (my_is_empty($result) && $need_result) {
 self::concrete_error(array(MY_ERROR_COUNTRY_STATE_ID_WAS_NOT_FOUND, 'state_code:' . $state_code));
 }

 $this->countries_state_id_by_code_requested_data[$state_code] = $result;
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
 LEFT JOIN country_states_google_names csgn on cs.id = csgn.state_id
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