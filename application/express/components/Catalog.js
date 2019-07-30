/*
 * File application/express/components/Catalog.js
 * const Catalog = require('application/express/components/Catalog');
 *
 * Catalog component - compute catalog data
 */

const Component = require('application/express/core/abstract/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Countries = require('application/express/components/Countries');
const Accounts = require('application/express/components/Accounts');
const Service = require('application/express/core/Service');
const Users = require('application/express/core/Users');
const Cache = require('application/express/components/base/Cache');
const Categories = require('application/express/components/Categories');

class Catalog extends Component {

    constructor() {
        super();
    }




//ATTENTION - обратите внимание
//prepareAddress = > prepareAddressLink
//prepareAddressWithRoute => prepareAddressLinkWithRoute


    /*
     * Return full address as link in html
     *
     * @param {string} stateCode - state code
     * @param {string} countryCcode - country code
     * @param {string} administrativeAreaLevel2 - alternative city name (google maps termin)
     * @param {string} state - state name
     * @param {string} country - country name
     * @param {string} city - city name
     *
     * @return {string} - html link
     */
    prepareAddressLink(stateCode, countryCcode, administrativeAreaLevel2, state, country, city)
    {
        if (!countryCcode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'country code [' + countryCcode + ']', undefined, false);
          } else if (!state) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state [' + state + ']', undefined, false);
        }

        let _language = this.getLanguage();

        state = Countries.getInstance(this.requestId).getTranslationOfStateName(_language, countryCcode, state, stateCode);
        country = Countries.getInstance(this.requestId).prepareCountryName(country);

        country = '<img class="adress_country_flag" src="' + Consts.IMG_URL + 'flags/' + countryCcode + '.png">' + country;

        let _addres = '';
        if (Service.getInstance(this.requestId).whetherShowCatalogPages() === true) {
            _addres = "<a href='/" + Consts.CONTROLLER_NAME_CATALOG + "/" + countryCcode + "'>" + country + '</a>';
        } else {
            _addres = country;
        }
        if (Countries.getInstance(this.requestId).hasStates(countryCcode)) {
            if (!stateCode) {
                this.error(Consts.ERROR_FUNCTION_ARGUMENTS, 'state_code [' + stateCode + ']', undefined, false);
            }
            if (stateCode !== Consts.UNDEFINED_VALUE) {
                if (Service.getInstance(this.requestId).whetherShowCatalogPages() === true) {
//ATTENTION - обратите внимание - прямая ссылка
                    _addres += " &bull; <a href='/" + Consts.CONTROLLER_NAME_CATALOG + "/" + countryCcode + "/" + stateCode + "'>" + state + '</a>';
                } else {
                    _addres += " &bull; " + state;
                }

                if (Users.getInstance(this.requestId).isAdmin() && state){

                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_state.php?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(state)+"' title='перевод'>&equiv;</a>";


                }
            }
        }
        let _locality = ''
        let _localitySource = '';
        if (Countries.getInstance(this.requestId).isAdministrativeCenter(countryCcode, stateCode) == false) {
            _addres += '<span class="locality">';
            if (city) {
                _locality = Countries.getInstance(this.requestId).getTranslationOfCityName(countryCcode, city, stateCode, _language);
                _addres += ' &bull; ' + _locality;
                _localitySource = city;
            } else if (administrativeAreaLevel2) {
                _locality = Countries.getInstance(this.requestId).getTranslationOfCityName(countryCcode, administrativeAreaLevel2, stateCode, _language);
                _addres += ' &bull; ' + _locality;
                _localitySource = administrativeAreaLevel2;
            }
                if (Users.getInstance(this.requestId).isAdmin() && _localitySource){
//ATTENTION - обратите внимание - прямая ссылка
                    _addres += " <a style='color:#f00;' target='_blank' href='/admin/translate_locality.php?country_code="+countryCcode+"&state_code="+stateCode+"&name="+encodeURI(_locality)+"&locality_source="+encodeURI(_localitySource)+"' title='перевод'>&equiv;</a>";
                }
                _addres +='</span>';
        }

        return _addres;
    }






    /*
     * Return full address as link in html with route (more detail address)
     *
     * @param {string} stateCode - state code
     * @param {string} countryCcode - country code
     * @param {string} administrativeAreaLevel2 - alternative city name (google maps termin)
     * @param {string} state - state name
     * @param {string} country - country name
     * @param {string} city - city name
     * @param {string} route - address details: street (if exist) etc.
     *
     * @return {string} - html link
     */
    prepareAddressLinkWithRoute(stateCode, countryCcode, administrativeAreaLevel2, state, country, city, route)
    {
        let _address = this.prepareAddressLink(stateCode, countryCcode, administrativeAreaLevel2, state, country, city);

        if ((route !== Consts.ADDRESS_UNNAMED_ROAD_VALUE) && (route)) {
            _address += " &bull; " + route;
        }

        return _address;
    }


    /*
     * Return all available categories data according with controller name
     *
     * @return {array of objects}
     */
    getCategories()
    {

        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            _categories[_index]['title'] = this.getText('form/map_new_point/category/' + _categories[_index]['id']);
        }

        if (this.getControllerName() === Consts.CONTROLLER_NAME_ARTICLE){

            for (let _index in _categories) {
                _categories[index]['title'] = Categories.getInstance(this.requestId).prepareNameForArticles(_categories[index]['code'], _categories[index]['title']);
            }
        }

        return _categories;
    }

    /*
     * Return category id by code
     *
     * @param {string} code - category code
     *
     * @return {integer}
     */
    getCategoryId(code)
    {
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[index];

            if (_category['code'] === code) {
                return _category['id'];
            }
        }
        return 0;
    }

    /*
     * Return category data by id
     *
     * @param {integer} id - category id
     *
     * @return {object}
     */
    getCategory(id)
    {
        let _categories = this.getCategories();

        for (let _index in _categories) {
            let _category = _categories[index];

            if (_category['id'] === id) {
                return _category;
            }
        }
        return null;
    }






    public function get_category_dimentions()
    {
        return self::get_module(MY_MODULE_NAME_SERVICE)->get_baloon_dimentions();
    }


}

Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;







<?php

namespace modules\app\catalog\classes;

use \components\app as components;

abstract class Catalog extends \vendor\Module
{

    protected $categories = array();




















    public function get_category_code($id = null)
    {

        $category = $this->get_category($id);

        return $category['code'];
    }


    public function get_category_title($id = null)
    {

        $category = $this->get_category($id);

        return $category['title'];
    }


    public function get_point_content_by_id($id)
    {

        $map_module = self::get_module(MY_MODULE_NAME_MAP);
        $result = $map_module->get_point_content_by_ids(array($id), false);
        return $result[$id];
    }


    public function get_subcategories($string)
    {

        return my_get_array_from_string($string);
    }


    public function get_another_placemarks_by_category($category_id, $self_id)
    {
        $category_id = (int) $category_id;
        $self_id = (int) $self_id;
        $data_db_model = components\Map::get_db_model('data');
        $config = self::get_config();

        $condition = "id!=" . $self_id . " AND (category = " . $category_id . " OR subcategories REGEXP '[[:<:]]" . $category_id . "[[:>:]]')";
        $order = "RAND()";
        $select = 'id';
        $limit = $config['allows']['max_items_at_sublist'];
        $need_result = false;

        $placemarks = $data_db_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);

        $result = array();
        if (my_array_is_not_empty(@$placemarks)) {
            foreach ($placemarks as $placemark) {
                $result[] = $placemark['id'];
            }
        }

        return $result;
    }


    public function get_placemarks_sublist($ids = null)
    {
        if (!is_null($ids)) {
            if (is_string($ids) && $ids) {
                $placemarks_ids = my_get_array_from_string($ids);
            } else if (my_array_is_not_empty($ids)) {
                $placemarks_ids = $ids;
            } else {
                $ids = (int) $ids;
                if ($ids) {
                    $placemarks_ids = array($ids);
                } else {
                    return array();
                }
            }
        } else {
            return array();
        }

        $security = \modules\base\Security\Security::get_instance();

        $module = self::get_module(MY_MODULE_NAME_MAP);

        $placemarks = $module->get_point_content_by_ids($placemarks_ids);

        foreach ($placemarks as $key => &$placemark) {
            if ($placemark['country_code']) {
                $state = '';
                if ($placemark['state_code'] && $placemark['state_code'] != MY_UNDEFINED_VALUE) {
                    $state = '/' . $placemark['state_code'];
                }

                if (is_map_page()) {
                    $placemark['url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $placemark['id'];
                } else {

                    $placemark['url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $placemark['country_code'] . $state . '/' . $placemark['id'];
                }
            } else {
                unset($placemarks[$key]);
            }
        }
        return prepare_to_array($placemarks);
    }





    public function get_placemarks_count_by_category($category_id)
    {
        $data_db_model = components\Map::get_db_model('data');
        $connect = $data_db_model->get_connect();

        $condition = "category = " . (int)$category_id . " OR subcategories REGEXP '[[:<:]]" . (int)$category_id . "[[:>:]]'";
        $group = "";
        $select = 'COUNT(*) as placemarks_count';
        $limit = 1;
        $need_result = true;

        $result = $data_db_model->get_by_condition($condition, $order = '', $group, $select, $limit, $need_result);
        return $result['placemarks_count'];
    }









    public function get_countries_data()
    {

        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $language_component = components\Language::get_instance();

        $language = $language_component->get_language();

        $condition = "language='" . $language . "' AND country_code != ''";
        $order = "country ASC";
        $group = "country_code";
        $select = 'country, country_code, state_code, COUNT(country_code) as placemarks_count';
        $limit = false;
        $need_result = false;

        $countries = $db_model_adress->get_by_condition($condition, $order, $group, $select, $limit, $need_result);
        return prepare_to_array($countries);
    }


    public function get_country_placemarks($country_code = null, $offset = null, $limit = null)
    {
        if (my_is_empty(@$country_code)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
        }


            $map_db_model_geocode = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
            $data_db_model = components\Map::get_db_model('data');
            $language_model = components\Language::get_instance();
            $language = $language_model->get_language();
            $conn = $data_db_model->get_connect();

            $config = self::get_config();

            $sql = "SELECT
                c.id as id,
                    c.title as title,
                    geo.country_code as country_code,
                    geo.state_code as state_code


                    FROM " . $data_db_model->get_table_name() . " c "
                    . "LEFT JOIN " . $map_db_model_geocode->get_table_name() . " geo on geo.map_data_id = c.id AND geo.language='" . $language . "' "
                    . "WHERE geo.country_code = " . $conn->quote($country_code);

            $sql .= " ORDER by c.id DESC";
            if (!is_null($offset) && !is_null($limit)) {
                $sql .= " LIMIT ".(int) $offset . ', ' . (int) $limit;
            }

            $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

            if (!my_array_is_not_empty(@$result)) {
                self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
            }

            return $result;
    }





    public function get_category_placemarks($category_id = null, $offset = null, $limit = null)
    {
        if (is_null($category_id)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'category_id:' . $category_id));
        }



        $category_id = (int) $category_id;

            $map_db_model_geocode = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
            $data_db_model = components\Map::get_db_model('data');
            $language_model = components\Language::get_instance();
            $language = $language_model->get_language();
            $conn = $data_db_model->get_connect();

            $config = self::get_config();

            $sql = "SELECT
                c.id as id,
                    c.title as title,
                    geo.country_code as country_code,
                    geo.country as country,
                    geo.state_code as state_code


                    FROM " . $data_db_model->get_table_name() . " c "
                    . "LEFT JOIN " . $map_db_model_geocode->get_table_name() . " geo on geo.map_data_id = c.id AND geo.language='" . $language . "' "
                    . "WHERE category = " . $category_id . " OR subcategories REGEXP '[[:<:]]" . $category_id . "[[:>:]]'";

            $sql .= " ORDER by c.id DESC";
            if (!is_null($offset) && !is_null($limit)) {
                $sql .= " LIMIT ".(int) $offset . ', ' . (int) $limit;
            }

            $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();



            return $result;
    }













    public function process_country_data()
    {

        $country = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);

        if (my_is_empty(@$country)) {
            self::concrete_error(array(MY_ERROR_CATALOG_WRONG_GET_VALUE, 'country:' . $country));
        }
        $data_db_model = components\Map::get_db_model('data');
        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $language_component = components\Language::get_instance();
        $countries_component = components\Countries::get_instance();

        $language = $language_component->get_language();

        $country_code = $countries_component->get_country_code_from_url($country);

// если в этой стране есть области, штаты и т.д. - то возвращаем их
        if ($countries_component->has_states($country_code)) {
            return $this->get_states($country_code, $language);
        } else {
// сменим view и layout файлы - выводим метки, поскольку в этой стране нет штатов
            $security = \modules\base\Security\Security::get_instance();
            $security->change_view_file('catalog', 'state');
            $security->change_layout_file('catalog', 'state');
            //return $this->get_placemarks($country_code, '', $language);-нигде не используются
        }
    }


    public function get_placemarks_count_in_country($country_code)
    {

        if (my_is_empty(@$country_code)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
        }

        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $data_db_model = components\Map::get_db_model('data');
        $connect = $db_model_adress->get_connect();

        $condition = "language='" . MY_LANGUAGE_EN . "' AND country_code = " . $connect->quote($country_code);
        $group = "country_code";
        $select = 'COUNT(country_code) as placemarks_count';
        $limit = 1;
        $need_result = false;

        $result = $db_model_adress->get_by_condition($condition, $order = '', $group, $select, $limit, $need_result);
        return $result['placemarks_count'];
    }


    public function get_placemarks_count()
    {
        $data_db_model = components\Map::get_db_model('data');


        $select = 'COUNT(*) as placemarks_count';
        $limit = 1;
        $need_result = false;
        $result = $data_db_model->get_by_condition('', '', '', $select, $limit, $need_result);
        return $result['placemarks_count'];
    }


    public function get_country_photos($country_code)
    {
        if (my_is_empty($country_code)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
        }
    }


    public function get_country_photos_data($country_code)
    {
        if (my_is_empty($country_code)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
        }
//берем id меток страны
        $placemarks_data = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION)->get_placemarks_data($country_code, null, true);
        return $this->get_photos_data($placemarks_data['ids'], $placemarks_data['data']);
    }


    public function get_state_photos_data($country_code, $state_code)
    {
        if (my_is_empty($country_code) || my_is_empty($state_code)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code . ',' . 'state_code:' . $state_code));
        }

//берем id меток страны
        $placemarks_data = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION)->get_placemarks_data($country_code, $state_code, true);

        return $this->get_photos_data($placemarks_data['ids'], $placemarks_data['data']);
    }


    protected function get_photos_data(array $placemarks_ids, array $placemarks_data)
    {

        $map_module = self::get_module(MY_MODULE_NAME_MAP);
        $photos_db_model = components\Map::get_db_model('photos');
        $data_db_model = components\Map::get_db_model('data');
        $conn = $photos_db_model->get_connect();
// берем фотки этих меток
        $sql = "SELECT
                    c.id as c_id,
                    c.title as c_title,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM " . $data_db_model->get_table_name() . " c "
                . "JOIN " . $photos_db_model->get_table_name() . " ph on ph.map_data_id = c.id "
                . "WHERE c.id IN (" . implode(',', $placemarks_ids) . ") "
//. "GROUP by c_id "
                . "ORDER by ph_id DESC";

        $photos_data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

        if (!my_array_is_not_empty($photos_data)) {
            self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
        }

        $photos_result = array();
        if (my_array_is_not_empty(@$photos_data)) {
            foreach ($photos_data as $photo) {
                if (my_array_is_empty($placemarks_data[$photo['c_id']])) {
                    self::concrete_error(array(MY_ERROR_VARIABLE_EMPTY, '$placemarks_data[\'data\'][$photo[\'c_id\']], $photo[\'c_id\'] =' . $photo['c_id']));
                }

                $placemark_title = $photo['c_title'];
                unset($photo['c_title']);
                $photos_result[$photo['ph_id']]['photo'] = $photo;
                $photos_result[$photo['ph_id']]['photo']['dir'] = $map_module->get_photo_dir($photo['c_id'], $photo['ph_path']);
                $photos_result[$photo['ph_id']]['placemark'] = $placemarks_data[$photo['c_id']];
                $photos_result[$photo['ph_id']]['placemark']['title'] = $placemark_title;
            }
        }

        return $photos_result;
    }


    public function get_state_data()
    {

        $country = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);

        if (my_is_empty(@$country)) {
            self::concrete_error(array(MY_ERROR_CATALOG_WRONG_GET_VALUE, 'country:' . $country));
        }
        if (my_is_empty(@$state_code)) {
            self::concrete_error(array(MY_ERROR_CATALOG_WRONG_GET_VALUE, 'state_code:' . $state_code));
        }
        $data_db_model = components\Map::get_db_model('data');
        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $language_component = components\Language::get_instance();
        $countries_component = components\Countries::get_instance();

        $language = $language_component->get_language();

        $country_code = $countries_component->get_country_code_from_url($country);

// только, если в этой стране есть области, штаты и т.д.
        if ($countries_component->has_states($country_code)) {
            return $this->get_placemarks($country_code, $state_code, $language);
        } else {
            self::concrete_error(array(MY_ERROR_WRONG_ADRESS, 'country_code="' . $country_code . '", state_code="' . $state_code . '"'));
        }
    }


    protected function get_placemarks($country_code, $state_code, $language)
    {

        $config = self::get_config();


        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $condition = "(language='" . $language . "' OR language='" . MY_LANGUAGE_EN . "') AND country_code='" . $country_code . "'";

        if ($state_code) {
            $connect = $db_model_adress->get_connect();
            $condition .= " AND state_code=" . $connect->quote($state_code);
        }

        $order = "id DESC";
        $select = 'DISTINCT map_data_id as placemarks_id';
        $limit = false;
        $need_result = false;
        $placemarks_ids = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);

        if (!$placemarks_ids) {
            self::concrete_error(array(MY_ERROR_WRONG_ADRESS, 'country_code="' . $country_code . '", state_code="' . $state_code . '"'));
        }

        $ids = array();
        foreach ($placemarks_ids as $value) {
            $ids[] = $value['placemarks_id'];
        }

        $map_module = self::get_module(MY_MODULE_NAME_MAP);
        $result = $map_module->get_point_content_by_ids($ids, false, 'c_title ASC');

        foreach ($result as &$value) {

            if (!$value['title']) {
                $value['title'] = my_pass_through(@self::trace('map/default_title_part/value')) . ' ' . $value['id'];
            }

            $value['comment'] = get_cutted_text($value['comment'], $config['allows']['max_cropped_text_length']);//self
        }
        return $result;
    }


    protected function get_states($country_code, $language)
    {

        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $condition = "language='" . $language . "' AND country_code='" . $country_code . "' AND state_code !='" . MY_UNDEFINED_VALUE . "'";
        $order = "state ASC";
        $select = 'DISTINCT administrative_area_level_1 as state, state_code';
        $limit = false;
        $need_result = false;
        $states = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);
//$result = $this->prepare_country_data($states, $country_code);
        return $states;
    }
    /* когда добавим новый язык, тогда пройдемся по всем записям и будем впоследствии добавлять их и на новом языке
      protected function prepare_country_data(array $data, $country_code) {
      $language_component = components\Language::get_instance();
      $language = $language_component->get_language();
      $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);


      foreach ($data as $value) {
      $countries[$value['map_data_id']][$value['language']]['state'] = $value['state'];
      $countries[$value['map_data_id']][$value['language']]['state_code'] = $value['state_code'];
      }

      // подготавливаем данные, чтобы были все
      foreach ($countries as $data_id => &$value) {
      // если нет названия штата (области) на таком языке, то просим гугл дать нам информацию на нем - запишем её в базу и отобразим
      if (my_array_is_empty(@$value[$language])) {

      $data = $db_model_adress->add_one_language($data_id, $language, array('country' => $country_code, 'administrative_area_level_1' => $value[MY_LANGUAGE_EN]['state']));
      $value[$language]['state'] = $data['administrative_area_level_1'];
      $value[$language]['state_code'] = $value[MY_LANGUAGE_EN]['state_code'];
      }
      }

      // убираем ненужные (английский, например, теперь он нам не нужен)
      $result = array();
      $helper = array();
      foreach ($countries as $country) {
      // области не должны повторяться и только на нужном языке
      if (!in_array($country[$language]['state_code'], $helper)) {
      $helper[] = $country[$language]['state_code'];
      $result[] = $country[$language];
      }
      }

      return $result;
      }

     */


    public function get_points_list($id_start = 0)
    {
        $map_db_model_geocode = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $map_db_model_data = components\Map::get_db_model('data');
        $map_module = self::get_module(MY_MODULE_NAME_MAP);
        $language_model = components\Language::get_instance();
        $language = $language_model->get_language();
        $connect = $map_db_model_data->get_connect();

        $config = self::get_config();
        $condition = '1';
        $limit = $config['allows']['max_rows_per_scroll_load'];


        $is_search = (int) @$_POST['is_search'];
//для поиска добавляем условия
        if ($is_search) {

            $order = 'c.id DESC';
            if ($id_start) {
                $condition .= ' AND c.id < ' . $id_start;
            }

            $category = isset($_SESSION['search']['category']) ? $_SESSION['search']['category'] : null;
            $country = isset($_SESSION['search']['country']) ? $_SESSION['search']['country'] : null;
            $state = isset($_SESSION['search']['state']) ? $_SESSION['search']['state'] : null;


            $keywords = isset($_SESSION['search']['keywords']) ? $_SESSION['search']['keywords'] : null;

            if (!is_null($category) && (($category === '0') || $category)) {
                $condition .= " AND (c.category = " . (int) $category . " OR c.subcategories REGEXP '[[:<:]]" . (int) $category . "[[:>:]]')";
            }
            if (!is_null($country) && $country) {
                $condition .= ' AND LOWER(geo.country_code) = LOWER(' . $connect->quote($country) . ')';
            }
            if (!is_null($state) && $state) {
                $condition .= ' AND LOWER(geo.state_code) = LOWER(' . $connect->quote($state) . ')';
            }
            if (!is_null($keywords) && $keywords) {
                $condition .= ' AND LOWER(c.title) LIKE' . $connect->quote(strtolower('%' . $keywords . '%'));
            }
            $sql = "SELECT
                    c.id as c_id
                    FROM " . $map_db_model_data->get_table_name() . " c "
                    . "LEFT JOIN " . $map_db_model_geocode->get_table_name() . " geo on geo.map_data_id = c.id AND geo.language='" . $language . "' "
                    . "WHERE " . $condition . " "
                    . "ORDER by " . $order . " "
                    . " LIMIT " . $limit;
            $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
            $ids = array();
            foreach ($result as $value) {
                $ids[] = $value['c_id'];
            }
        } else {
            $order = 'id DESC';
            if ($id_start) {
                $condition .= ' AND id < ' . $id_start;
            }
            $result = $map_db_model_data->get_by_condition($condition, $order, '', $select = 'id', $limit, $need_result = false);
            $ids = array();
            foreach ($result as $value) {
                $ids[] = $value['id'];
            }
        }



        $result = $map_module->get_point_content_by_ids($ids, false);

        foreach ($result as &$value) {

            if (!$value['title']) {
                $value['title'] = my_pass_through(@self::trace('map/default_title_part/value')) . ' ' . $value['id'];
            }

            $value['comment'] = get_cutted_text($value['comment'], $config['allows']['max_cropped_text_length']);//self
        }
        return $result;
    }


    public function get_breadcrumbs_data()
    {

        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $data_db_model = components\Map::get_db_model('data');
        $language_component = components\Language::get_instance();
        $country_component = components\Countries::get_instance();

        $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);
        $id_placemark = (int) $this->get_get_var(MY_ID_VAR_NAME);

        $language = $language_component->get_language();

        $connect = $data_db_model->get_connect();
        $return = array();
        $countries_url = MY_DOMEN . '/' . get_controller_name();
        $countries_name = self::trace('breadcrumbs/' . get_controller_name() . '/text');
        $countries = array(
            'url' => $countries_url,
            'name' => $countries_name,
        );
        $placemarks = array();

        $controller_name=get_controller_name();
        $action_name=get_action_name();

        // В этом случае не показываем breadcrumbs
        if (($controller_name===MY_CONTROLLER_NAME_CATALOG) && (($action_name===MY_ACTION_NAME_SITEMAP_COUNTRIES) || ($action_name==MY_ACTION_NAME_SITEMAP_CATEGORIES))){
            return array();
        }

        if ($id_placemark) {

            $condition = "language='" . $language . "' AND map_data_id=" . $id_placemark;
            $order = null;
            $select = 'country, country_code, administrative_area_level_1 as state, state_code';
            $limit = 1;
            $need_result = true;
            $result = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);


            $states = array(
                'url' => MY_DOMEN . '/' . get_controller_name() . '/' . $result['country_code'],
                'name' => $country_component->prepare_country_name($result['country'])
            );
            if ($country_component->has_states($result['country_code'])) {
                $placemarks = array(
                    'url' => MY_DOMEN . '/' . get_controller_name() . '/' . $result['country_code'] . '/' . $result['state_code'],
                    'name' => $country_component->translate_state_names($language, $country_code, $result['state'], $result['state_code'])
                );
            }

// в списке стран bredcrumbs будут пустые
//смотрим штаты
            $return[0] = $countries; // возврат в список стран
//смотрим метки штата
            $return[1] = $states; // возврат в список штатов (или меток, если штатов нет в стране)
//смотрим метку
            if ($placemarks) {
                $return[2] = $placemarks; // возврат в список меток - уровень штата (если он есть, иначе элемент [1] будет отсутствовать - уровень страны)
            }
            return $return;
        }


        if ($state_code) {

            $condition = "state_code=" . $connect->quote($state_code) . " AND language='" . $language . "'";
            $order = null;
            $select = 'country, country_code, administrative_area_level_1 as state, state_code';
            $limit = 1;
            $need_result = true;
            $result = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);






            if ($country_component->has_states($result['country_code'])) {
                $states = array(
                    'url' => MY_DOMEN . '/' . get_controller_name() . '/' . $result['country_code'],
                    'name' => $country_component->prepare_country_name($result['country'])
                );
                $placemarks = array(
                    'url' => null,
                    'name' => $country_component->translate_state_names($language, $country_code, $result['state'], $result['state_code'])
                );
            } else {
                $states = array(
                    'url' => null,
                    'name' => $country_component->prepare_country_name($result['country'])
                );
            }




// в списке стран bredcrumbs будут пустые
//смотрим штаты
            $return[0] = $countries; // возврат в список стран
//смотрим метки штата
            $return[1] = $states; // возврат в список штатов (или меток, если штатов нет в стране)
            if ($placemarks) {
                $return[2] = $placemarks; // возврат в список меток - уровень штата (если он есть, иначе элемент [1] будет отсутствовать - уровень страны)
            }



            return $return;
        }


        if ($country_code) {




            $condition = "country_code=" . $connect->quote($country_code) . " AND language='" . $language . "'";
            $order = null;
            $select = 'country, country_code, administrative_area_level_1 as state, state_code';
            $limit = 1;
            $need_result = true;
            $result = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);



            $states = array(
                'url' => null,
                'name' => $country_component->prepare_country_name($result['country'])
            );


// в списке стран bredcrumbs будут пустые
//смотрим штаты
            $return[0] = $countries; // возврат в список стран
//смотрим метки штата
            $return[1] = $states; // возврат в список штатов (или меток, если штатов нет в стране)
            return $return;
        }

        if (get_action_name() === MY_MODULE_NAME_SEARCH) {

            $return[0] = $countries;

            $return[1] = array(
                'name' => my_pass_through(@self::trace('site/title/catalog/search/title'))
            );
        }


        return $return;
    }


    public function get_placemarks_title()
    {
        $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);

        $country_component = components\Countries::get_instance();
        if ($state_code) {
            return $country_component->get_state_name_by_get_var();
        }

        if ($country_code) {
            return $country_component->get_country_name_by_get_var();
        }
    }






}
