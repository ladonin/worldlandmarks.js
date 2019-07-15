/*
 * File application/express/models/dbase/mysql/GeocodeCollection.js
 * const GeocodeCollectionModel = require('application/express/models/dbase/mysql/GeocodeCollection');
 *
 * Geocode collection MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const StrictFunctions = require('application/express/functions/StrictFunctions');
const Consts = require('application/express/settings/Constants');
const MapDataModel = require('application/express/models/dbase/mysql/MapData');
const Language = require('application/express/components/base/Language');
const Map = require('application/express/components/Map');
const ErrorCodes = require('application/express/settings/ErrorCodes');


class GeocodeCollectionModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

        this.fields = {
            title:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
        };

        this.fields = {
            map_data_id:{
                // Правила валидации значений поля
                rules:['numeric', 'required'],
            },
            language:{
                rules:['required'],
            },
            country_code:{
                rules:[],
                // If you pass an empty value then field will have the default value
                'default_value': Consts.UNDEFINED_VALUE,
                // If you don't pass any value to this field at all then field will have this initial value
                'value': Consts.UNDEFINED_VALUE,
            },
            state_code:{
                rules:[],
                'default_value': Consts.UNDEFINED_VALUE,
                'value': Consts.UNDEFINED_VALUE,
            },
            json_data:{
                rules:[],
            },
            formatted_address:{
                rules:[],
            },
            street:{
                rules:[],
            },
            country:{
                rules:[],
            },
            administrative_area_level_1:{
                rules:[],
            },
            administrative_area_level_2:{
                rules:[],
            },
            locality:{
                rules:[],
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
            this.tableName = this.getServiceName() + '_geocode_collection';
        }
        return this.tableName;
    }


    /*
     * Add record for placemark on one language
     *
     * @param {integer} id - placemark id
     * @param {string} language - language
     * @param {object} enData - data of current placemark in english
     *
     * @return {object} - added data
     */
    addOnOneLanguage(id, language, enData)
    {
        let _data = MapDataModel.getById(id);

        _data = this.prepareAddress(
                {
                    'x':_data['x'],
                    'y':_data['y']
                },
                id,
                language,
                {
                    'country':enData['country'],
                    'administrative_area_level_1':enData['administrative_area_level_1']
                });
        // Delete possibly already existed record
        this.deleteAdresses(id, language);

        // Now record
        this.setValuesToFields(_data);
        this.insert();

        return _data;
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
            condition += " AND language='" + language + "'";
        }
        let _results = this.getByCondition(_condition, '', '', '*', false, false);

        for (let _index in  _results) {
            let _result = _results[_index];
            this.delete(_result['id']);
        }
    }






    /*
     * Prepare geodata
     *
     * @param {object} data - data to be prepared
     * @param {integer} id - placemark id
     * @param {string} language - language on which geodata will be prepared
     * @param {object} enData - the sample in english
     *
     * @return {object} - added data
     */
    prepareAddress(data, id, language, enData = {})
    {
        if ((language !== Consts.LANGUAGE_EN) && (!enData['country'] || !enData['administrative_area_level_1'])) {
            this.error(ErrorCodes.ERROR_MAP_API_HAS_NOT_ENGLISH, 'for language [' + language + ']');
        }
        if (!data.x || !data.y) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'data [' + BaseFunctions.toString(data) + ']');
        }
        if (!id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'placemark id [' + id + ']');
        }
        if (!language) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'language [' + language + ']');
        }

        Language.getInstance(this.requestId).checkLanguage(language);

        let _adress = Map.getInstance(this.requestId).getAdressByCoords(data, language);

        let _adressJson = JSON.stringify(_adress);

        let _data = {
            'map_data_id':id,
            'language':language,
            'json_data':_adressJson,
            'formatted_address':_adress['formattedAdress']
        };

        for (var index in _adress['address_components']['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components']) {
            let _component = _adress['address_components']['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components'][index];

            if (_component['kind'] === 'street') {

                _data['street'] = _component['name'];

            } else if (_component['kind'] === 'country') {

                _data['country'] = _component['name'];

                /*
                 * 1. _component['name'] - only when 'data' argument passed in English, enData['country'] is empty in this case.
                 *
                 * 2. When _component['name'] and enData['country'] are empty - _data['country_code']
                 *    will have string 'undefined' value (specified in prepareToOneWord()).
                 *    Case for english language with no country location (Antarctida, Pacific ocean, etc).
                 */
                _data['country_code'] = BaseFunctions.prepareToOneWord(enData['country'],_component['name']);

            } else if (_component['kind'] === 'province') {

                _data['administrative_area_level_1'] = _component['name'];

                /*
                 * 1. _component['name'] - only when 'data' argument passed in English, enData['administrative_area_level_1'] is empty in this case.
                 *
                 * 2. When _component['name'] and enData['administrative_area_level_1'] are empty - _data['state_code']
                 *    will have string 'undefined' value (specified in prepareToOneWord()).
                 *    Case for english language with no country location (Antarctida, Pacific ocean, etc).
                 */
                _data['state_code'] = BaseFunctions.prepareToOneWord(enData['administrative_area_level_1'],_component['name']);

            } else if (_component['kind'] === 'area') {

                _data['administrative_area_level_2'] = _component['name'];

            } else if (_component['kind'] === 'locality') {

                _data['locality'] = _component['name'];
            }
        }
         if (!_data['state_code']) {
            _data['administrative_area_level_1'] = Consts.UNDEFINED_VALUE;
            _data['state_code'] = Consts.UNDEFINED_VALUE;
        }

        return _data;
    }




















    /*
     * Добавляем записи одной метки на всех доступных языках
     *
     * @param array $coords - координаты метки
     * @param integer $data_id - id метки
     *
     * @return array - добавленные данные
     */
    public function add($coords, $data_id)
    {

        $result = array();

        $languages_data = self::get_module(MY_MODULE_NAME_SERVICE)->get_languages();
        $country_component = components\Countries::get_instance();
        $country_states_google_names_model = self::get_model(MY_MODEL_NAME_DB_COUNTRY_STATES_GOOGLE_NAMES);
        $country_states_model = self::get_model(MY_MODEL_NAME_DB_COUNTRY_STATES);

        //английский язык нужен обязательно вначале, чтобы подготовить данные для кода страны и т.д. неанглийских языков
        $data_en = $this->prepare_address($coords, $data_id, MY_LANGUAGE_EN);
        $this->set_values_to_fields($data_en);
        $result[] = $this->insert();

        $administrative_area_level_1_en = isset($data_en['administrative_area_level_1']) ? $data_en['administrative_area_level_1'] : MY_UNDEFINED_VALUE;
        $country_en = isset($data_en['country']) ? $data_en['country'] : MY_UNDEFINED_VALUE;
        $country_code_en = isset($data_en['country_code']) ? $data_en['country_code'] : MY_UNDEFINED_VALUE;
        $country_id = $country_component->get_country_data_by_code($country_code_en);
        $country_id = $country_id['id'];

        if ($data_en['state_code'] != MY_UNDEFINED_VALUE) {
            // Новый код области/штата, undefined не пишется
            $country_states_model->add_once(array(
                'url_code' => $data_en['state_code'],
                'country_id' => $country_id
                )
            );

            $state_id = $country_component->get_state_id_by_code($data_en['state_code']);

            // Названия областей - добавляются данные только существующей области - для английского языка
            $country_states_google_names_model->add_once(array(
                'state_id' => $state_id,
                'name' => $administrative_area_level_1_en,
                'language' => MY_LANGUAGE_EN
                )
            );
        }

        //берем все языки, что указали для сервиса
        foreach ($languages_data as $language_data) {

            $language = $language_data['code'];
            // передаем остальным языкам английские данные, чтобы из них сформировать код страны и штата
            if ($language !== MY_LANGUAGE_EN) {
                $data = $this->prepare_address($coords, $data_id, $language, array(
                    'country' => $country_en,
                    'administrative_area_level_1' => $administrative_area_level_1_en));


                  $this->set_values_to_fields($data);


                $result[] = $this->insert();

                if ($data_en['state_code'] != MY_UNDEFINED_VALUE) {
                    // Названия областей - добавляются данные только существующей области - для других языков


                    if ($data['administrative_area_level_1'] == MY_UNDEFINED_VALUE) {
                        $data['administrative_area_level_1'] = $administrative_area_level_1_en;
                    }


                    $country_states_google_names_model->add_once(array(
                        'state_id' => $state_id,
                        'name' => $data['administrative_area_level_1'],
                        'language' => $language
                        )
                    );
                }

            }
        }

        return $result;
    }












    /*
     * Add new article
     *
     * @param {object} data - new article data
     *
     * @return {integer} - new record id
     */
    add(data)
    {
        this.setValuesToFields(data);
        return this.insert();
    }

    /*
     * Update existed article
     *
     * @param {object} data - article's new data with id
     */
    update(data)
    {
        let _id = data.id;
        delete data.id;
        this.setValuesToFields(data);
        this.update(_id);
    }
}

GeocodeCollectionModel.instanceId = BaseFunctions.unique_id();

module.exports = GeocodeCollectionModel;
















<?php
/*
 * Db модель geocode_collection
 */
namespace models\dbase\mysql\geocode_collection;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{


    ######
    #   Пояснение:
    #   данные, возвращаемые https://maps.googleapis.com/maps/api/geocode:
    #####
    /*
      street_address – указывает точный почтовый адрес.
      route – указывает шоссе с названием (например, "US 101").
      intersection – указывает крупные перекрестки, как правило, пересечения двух крупных дорог.
      political – указывает политическую единицу. Чаще всего такой тип используется для обозначения некоторых административных объектов.
      country – указывает государственную политическую единицу и обычно представляет собой тип наивысшего порядка, который возвращается геокодировщиком.
      administrative_area_level_1 – указывает гражданскую единицу первого порядка ниже уровня страны. В США такими административными уровнями являются штаты. Эти административные уровни используются не во всех странах.
      administrative_area_level_2 – указывает гражданскую единицу второго порядка ниже уровня страны. В США такими административными уровнями являются округи. Эти административные уровни используются не во всех странах.
      administrative_area_level_3 – указывает гражданскую единицу третьего порядка ниже уровня страны. Такой тип представляет меньшее административное подразделение. Эти административные уровни используются не во всех странах.
      administrative_area_level_4 – указывает гражданскую единицу четвертого порядка ниже уровня страны. Такой тип представляет меньшее административное подразделение. Эти административные уровни используются не во всех странах.
      administrative_area_level_5 – указывает гражданскую единицу пятого порядка ниже уровня страны. Такой тип представляет меньшее административное подразделение. Эти административные уровни используются не во всех странах.
      colloquial_area – указывает общепринятое альтернативное название единицы.
      locality – указывает политическую единицу в составе города.
      ward – указывает определенный тип округа в Японии, чтобы установить различие между несколькими частями населенного пункта в японском адресе.
      sublocality – указывает гражданскую единицу первого порядка ниже уровня населенного пункта. Для некоторых местоположений возможно предоставление одного из дополнительных типов: от sublocality_level_1 до sublocality_level_5. Каждый уровень ниже населенного пункта является гражданской единицей. Большее значение указывает меньшую географическую область.
      neighborhood – указывает именованный район.
      premise – указывает именованное местоположение, обычно одно или несколько зданий с общепринятым названием.
      subpremise – указывает единицу первого порядка ниже именованного местоположения, обычно одно здание в границах комплекса зданий с общепринятым названием.
      postal_code – указывает почтовый индекс в том виде, в котором он используется в стране для обработки почты.
      natural_feature – указывает важный природный объект.
      airport – указывает аэропорт.
      park – указывает парк с названием.
      point_of_interest – указывает достопримечательность с названием. Как правило, такие достопримечательности являются важными местными единицами, которые не подходят для других категорий, например, небоскреб "Эмпайр-стейт-билдинг" или статуя Свободы.
     */
    /*
     * Поля таблицы
     *
     * @var array
     */




    /*
     * Проверяем есть ли такая метка по указанному адресу
     *
     * @param integer $id - id метки
     * @param string $country_code - код страны
     * @param array $state_code - код региона
     *
     * @return boolean
     */
    public function check_placemark($id, $country_code, $state_code)
    {
        $id = (int) $id;
        $country = self::$connect->quote($country_code);
        $data_db_model = components\Map::get_db_model('data');

        $condition = "map_data_id = $id AND country_code = $country ";
        if ($state_code) {
            $state = self::$connect->quote($state_code);
            $condition .= "AND state_code = $state";
        }
        $result = $this->get_by_condition($condition, '', '', 'id', 1, false);
        return my_is_not_empty(@$result['id']) ? true : false;
    }


    /*
     * Возвращает все существующие в сервисе страны
     *
     * @return array
     */
    public function get_countries()
    {
        $data_db_model = components\Map::get_db_model('data');

        $language_model = components\Language::get_instance();
        $language = $language_model->get_language();

        $condition = "language = '" . $language . "' AND country_code!='" . MY_UNDEFINED_VALUE . "' AND country_code!=''";
        $result = $this->get_by_condition($condition, 'country', '', 'DISTINCT country, country_code');
        return $result;
    }

    /*
     * Обновляет все геоданные метки
     *
     * @param array $coords - кординаты новые данные метки
     * @param integer $data_id - id обновляемой метки
     *
     * @return boolean(false)/array - новые геоданные метки на всех языках
     */
    public function update_record($coords, $data_id)
    {

        if (my_is_not_empty(@$coords['x']) && my_is_not_empty(@$coords['y'])) {

            // только если координаты сменились
            //$data_db_model = components\Map::get_db_model('data');
            //$result = $data_db_model->get_by_id($data_id);
            //если мы не меняли местоположение, то x,y в форме придут пустыми
            /////if (($result['x'] !== $data['x']) || ($result['y'] !== $data['y'])) {
            //удалим ВСЕ старые записи для этой метки
            $this->delete_adresses($data_id);
            //добавляем новые
            return $this->add($coords, $data_id);
            /////}
        }
        return false;
    }





    /*
     * Получаем геоданные (и их ids) по коду страны и региона
     *
     * @param string $country_code - код страны
     * @param string $state_code - код региона
     * @param boolean $need_result - обязателен ли возвращаемый результат (или можно пустой, если не найдено ничего)
     *
     * @return array
     */
    public function get_placemarks_data($country_code = null, $state_code = null, $need_result = false)
    {
        $connect = $this->get_connect();
        $data_db_model = components\Map::get_db_model('data');
        $country_component = components\Countries::get_instance();

        $config = self::get_config();
        $language_component = components\Language::get_instance();
        $language = $language_component->get_language();

        $condition = "gc.language='" . $language . "'";
        if ($country_code) {
            $condition .= " AND gc.country_code=" . $connect->quote($country_code);
        }
        if ($state_code) {
            $condition .= " AND gc.state_code=" . $connect->quote($state_code);
        }

        $sql = "SELECT DISTINCT
                gc.map_data_id as placemarks_id,
                gc.state_code, gc.country_code, gc.formatted_address,
                gc.country, gc.administrative_area_level_1 as state,
                gc.locality, cs.is_administrative_center
            FROM ".$this->get_table_name()." gc
            LEFT JOIN country_states cs on cs.url_code = gc.state_code
            WHERE ".$condition." ORDER by gc.id DESC";
        $placemarks_data = $this->get_by_sql($sql,$need_result);

        $result = array();
        if (my_array_is_not_empty(@$placemarks_data)) {
            foreach ($placemarks_data as $placemark) {
                if (($placemark['state']) && ($placemark['state_code']) && ($placemark['country_code'])) {
                    $placemark['state'] = $country_component->translate_state_names($language, $placemark['country_code'], $placemark['state'], $placemark['state_code']);
                }
                // массив id для implode
                $result['ids'][] = $placemark['placemarks_id'];
                $result['data'][$placemark['placemarks_id']] = $placemark;
            }
        }

        return $result;
    }
}
