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
const Map = require('application/express/components/Map');

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
                this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'state_code [' + stateCode + ']', undefined, false);
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
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'code[' + code + ']', log_type = undefined, writeToLog = false);
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
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'id[' + id + ']', log_type = undefined, writeToLog = false);
    }


//ATTENTION - обратите внимание
//get_category_dimentions => Service.getInstance(this.requestId).getBaloonDimentions()
//     get_category_dimentions()
//    {
//        return self::get_module(MY_MODULE_NAME_SERVICE)->get_baloon_dimentions();
//    }






    /*
     * Return category code by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryCode(id)
    {
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[index];

            if (_category['id'] === id) {
                return _category['code'];
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'id[' + id + ']', log_type = undefined, writeToLog = false);
    }

    /*
     * Return category title by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryTitle(id)
    {
        return this.getCategory(id)['title'];
    }

    /*
     * Return middle placemark data by id (without plain text, another and relevant placemarks)
     *
     * @param {integer} id - placemark id
     *
     * @return {object} - placemark data
     */
    getPointMiddleDataById(id)
    {
        return Map.getInstance(this.requestId).getPointsBigDataByIds([id], false)[id];
    }

//ATTENTION - обратите внимание
//get_subcategories => BaseFunctions.getArrayFromString
//getAnotherPlacemarksByCategory => getAnotherPlacemarksIdsByCategory
//
//    public function get_subcategories($string)
//    {
//
//        return my_get_array_from_string($string);
//    }



    /*
     * Return another placemarks ids related to category
     *
     * @param {integer} categoryId - category id
     * @param {integer} pointId - placemark id
     *
     * @return {array} - another placemarks ids
     */
    getAnotherPlacemarksIdsByCategory(categoryId, pointId)
    {
        let _placemarks = MapDataModel.getInstance(this.requestId).getAnotherPlacemarksIdsByCategory(categoryId, pointId);

        let _result = [];
        if (_placemarks.length) {
            for (let _index in _placemarks) {
                let _placemark = _placemarks[_index];
                _result.push(_placemark['id']);
            }
        }
        return _result;
    }


    /*
     * Return placemarks sublist data by their ids
     *
     * @param {integer/string/array} ids
     *
     * @return {array of objects}
     */
    getPlacemarksSublist(ids)
    {
        let _placemarksIds = [];
        if (BaseFunctions.isString(ids) && ids) {
            _placemarksIds = BaseFunctions.getArrayFromString(ids);
        } else if (BaseFunctions.isArray(ids) && ids.length) {
            _placemarksIds = ids;
        } else if (BaseFunctions.isInteger(ids) && ids) {
            _placemarksIds = [ids];
        } else {
            return [];
        }

        let _placemarks = Map.getInstance(this.requestId).getPointsBigDataByIds(_placemarksIds);

        for (let _index in _placemarks) {
            let _placemark = _placemarks[_index];

            let _state = '';
            if (_placemark['state_code'] && _placemark['state_code'] != Consts.UNDEFINED_VALUE) {
                _state = '/' + _placemark['state_code'];
            }

            if (this.isMapPage()) {
                _placemarks[_index]['url'] = '/' + this.getControllerName() + '/' + _placemark['id'];
            } else {
                _placemarks[_index]['url'] = '/' + this.getControllerName() + '/' + _placemark['country_code'] + _state + '/' + _placemark['id'];
            }
        }
        return _placemarks ? _placemarks : [];
    }

//ATTENTION - обратите внимание
//getPlacemarksCountByCategory => getPlacemarksCountByCategoryId

    /*
     * Return placemarks count by category id
     *
     * @param {integer} id
     *
     * @return {integer}
     */
    getPlacemarksCountByCategory(id)
    {
        return MapDataModel.getInstance(this.requestId).getPlacemarksCountByCategory(id);
    }

    /*
     * Return data of all countries
     *
     * @return {array of objects}
     */
    getCountriesData()
    {
        return GeocodeCollectionModel.getInstance(this.requestId).getCountriesData();
    }

    /*
     * Get placemarks of specified country
     *
     * @param {string} countryCode - country code
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     *
     * @return {array of objects}
     */
    getCountryPlacemarks(countryCode, offset, limit)
    {
        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code [' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        return MapDataModel.getInstance(this.requestId).getCountryPlacemarks(countryCode, offset, limit, this.getLanguage(), needResult = false);
    }

    /*
     * Get placemarks of specified category
     *
     * @param {integer} categoryId - category id
     * @param {integer} offset - selection offset
     * @param {integer} limit - selection limit
     *
     * @return {array of objects}
     */
    getCategoryPlacemarks(categoryId, offset, limit)
    {
        if (BaseFunctions.isUndefined(categoryId)) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'category id [' + categoryId + ']', log_type = undefined, writeToLog = false);
        }

        return MapDataModel.getInstance(this.requestId).getCategoryPlacemarks(categoryId, offset, limit, this.getLanguage(), needResult = false);
    }






//ATTENTION - обратите внимание
//process_country_data => processCountryData


    /*
     * Return view data for countries page
     *
     * @return {array of objects}
     */
    processCountryPageData()
    {
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromUrl();

        // If country has states
        if (Countries.getInstance(this.requestId).hasStates(_countryCode)) {
            return this.getStates(_countryCode, this.getLanguage());
        } else {
            return null;
        }
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

        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        return GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksCountInCountry(countryCode);
    }



//ATTENTION - обратите внимание
//get_placemarks_count => MapDataModel.getInstance(this.requestId).getPlacemarksCount()
//getPhotosData => getPlacemarksPhotos
//getStateData => getStatePlacemarksByUrl
    /*
     * Return photos data of current country
     *
     * @param {string} countryCode - country code
     *
     * @return {array of objects}
     */
    getCountryPhotosData(countryCode)
    {
        if (!countryCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + ']', log_type = undefined, writeToLog = false);
        }

        let _placemarksData = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksData(countryCode, null, true);
        return this.getPhotosData(_placemarksData['ids'], _placemarksData['data']);
    }


    /*
     * Return photos data of current state
     *
     * @param {string} countryCode - country code
     * @param {string} stateCode - satte code
     *
     * @return {array of objects}
     */
    getStatePhotosData(countryCode, stateCode)
    {
        if (!countryCode || !stateCode) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, message = 'country code[' + countryCode + '], state code[' + stateCode + ']', log_type = undefined, writeToLog = false);
        }

        let _placemarksData = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksData(countryCode, stateCode, true);

        return this.getPhotosData(_placemarksData['ids'], _placemarksData['data']);
    }





    /*
     * Extract photos data from placemarks data
     *
     * @param {array} placemarksIds - placemarks ids
     * @param {array of objects} placemarksData - placemarks data
     *
     * @return {array of objects} - photos data
     */
    getPlacemarksPhotosData(placemarksIds, placemarksData)
    {
        let _photosData = MapDataModel.getInstance(this.requestId).getPlacemarksPhotos(placemarksIds);

        let _photosResult = [];
        if (_photosResult.length) {

            for (let _index in _photosData) {
                let _photo = _photosData[_index];

                if (my_array_is_empty(placemarksData[_photo['c_id']])) {
                    this.error(ErrorCodes.ERROR_VARIABLE_EMPTY, message = '_placemarksData[\'data\'][_photo[\'c_id\']], _photo[\'c_id\'] =' + _photo['c_id']);
                }

                let _placemarkTitle = _photo['c_title'];
                delete(_photosData[_index]['c_title']);

                _photosResult[_photo['ph_id']]['photo'] = _photo;
                _photosResult[_photo['ph_id']]['photo']['dir'] = Map.getInstance(this.requestId).getPhotoDir(_photo['c_id'], _photo['ph_path']);
                _photosResult[_photo['ph_id']]['placemark'] = placemarksData[_photo['c_id']];
                _photosResult[_photo['ph_id']]['placemark']['title'] = _placemarkTitle;
            }
        }

        return _photosResult;
    }




    /*
     * Return placemarks data of current state
     *
     * @return {array of objects}
     */
    getStatePlacemarksByUrl()
    {
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromUrl();

        let _stateCode = this.getFromRequest(Consts.ACTION_NAME_STATE, required = true);

        if (Countries.getInstance(this.requestId).hasStates(_countryCode)) {
            return this.getPlacemarks(_countryCode, _stateCode, this.getLanguage());
        } else {
            this.error(
                ErrorCodes.ERROR_WRONG_ADRESS,
                message = 'country code[' + _countryCode + '], state code[' + _stateCode + ']',
                log_type = undefined,
                writeToLog = false
            );
        }
    }

    /*
     * Return placemarks data of current coutry and, if set, state in current language
     *
     * @param {string} countryCode
     * @param {string} stateCode
     * @param {string} language
     *
     * @return {array of objects}
     */
    getPlacemarks(countryCode, stateCode, language)
    {
        let _placemarksIds = GeocodeCollectionModel.getInstance(this.requestId).getPlacemarksIds(countryCode, stateCode, language)
        let _ids = [];

        for (let _index in _placemarksIds) {
            _ids.push(_placemarksIds[_index]['placemark_id']);
        }

        let _result = Map.getInstance(this.requestId).getPointsBigDataByIds(_ids, false, 'c_title ASC');

        for (let _index in _result) {

            let _placemark = _result[_index];

            if (!_placemark['title']) {
                _result[_index]['title'] = this.getText('map/default_title_part/value') + ' ' + _placemark['id'];
            }

            _result[_index]['comment'] = BaseFunctions.getCroppedText(_placemark['comment'], Config['restrictions']['max_cropped_text_length']);
        }
        return _result;
    }













}

Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;




















































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
