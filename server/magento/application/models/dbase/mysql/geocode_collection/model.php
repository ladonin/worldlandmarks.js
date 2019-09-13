<?php
/*
 * Db модель geocode_collection
 */
namespace models\dbase\mysql\geocode_collection;

use \components\app as components;

abstract class Model extends \vendor\DBase_Mysql
{
    /*
     * Имя таблицы
     */
    public function get_table_name()
    {
        if (!$this->table_name) {
            $this->table_name = get_service_name() . '_geocode_collection';
        }
        return $this->table_name;
    }

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
    protected $fields = array(
        'map_data_id' => array(
            // Правила валидации значений поля
            'rules' => array('numeric', 'required'),
        ),
        'language' => array(
            'rules' => array('required'),
        ),
        'country_code' => array(
            'rules' => array(), //теперь required не нужен, раз есть  default_value
            // Дефолтное значение поля
            'default_value' => MY_UNDEFINED_VALUE, // если сюда передается пустое значение, то оно будет заменено на это
            // Текущее значение поля
            'value' => MY_UNDEFINED_VALUE, // если это поле вообще не передалось с данными извне, то поле будет иметь такое значение
        ),
        'state_code' => array(
            'rules' => array(), //теперь required не нужен, раз есть  default_value
            'default_value' => MY_UNDEFINED_VALUE,
            'value' => MY_UNDEFINED_VALUE, // если это поле вообще не передалось с данными извне, то поле будет иметь такое значение
        ),
        'json_data' => array(
            'rules' => array(),
        ),
        'formatted_address' => array(
            'rules' => array(),
        ),
        'street' => array(
            'rules' => array(),
        ),
        'country' => array(
            'rules' => array(),
        ),
        'administrative_area_level_1' => array(
            'rules' => array(),
        ),
        'administrative_area_level_2' => array(
            'rules' => array(),
        ),
        'locality' => array(
            'rules' => array(),
        )
    );

    /*
     * Добавляем запись одной метки на одном языке
     *
     * @param integer $data_id - id метки
     * @param string $language - язык
     * @param array $en_data - данные этой же метки на английском
     *
     * @return array - добавленные данные
     */
    public function add_one_language($data_id, $language, array $en_data)
    {
        $db_model_data = components\Map::get_db_model('data');

        $data = $db_model_data->get_by_id($data_id);
        $data = $this->prepare_address(array('x' => $data['x'], 'y' => $data['y']), $data_id, $language, array('country' => $en_data['country'], 'administrative_area_level_1' => $en_data['administrative_area_level_1']));

        //перед этим удалим возможно уже существующую запись
        $this->delete_adresses($data_id, $language);

        //теперь пишем


                if ($data['country_code'] == MY_UNDEFINED_VALUE) {
                    // Если ответ на неанглийском языке не пришел от гугла (санкции по обычным людям хули)
                    $data = $en_data;
                    $data['language'] = $language;
                }
$this->set_values_to_fields($data);







        $this->insert();

        return $data;
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

                if ($data['country_code'] == MY_UNDEFINED_VALUE) {
                    // Если ответ на неанглийском языке не пришел от гугла (санкции по обычным людям хули)
                    $data = $data_en;
                    $data['language'] = $language;
                }
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
     * Удаляем геоданные метки
     *
     * @param integer $data_id - id обновляемой метки
     * @param string $language - язык, данные которого удаляем (если не указан, то удаляем данные на всех языках)
     */
    public function delete_adresses($data_id, $language = null)
    {
        $data_id = (int) $data_id;

        if (my_is_empty(@$data_id)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data_id:' . $data_id));
        }
        $data_db_model = components\Map::get_db_model('data');

        // Берем ids
        $condition = "map_data_id=" . $data_id;
        if ($language) {
            $condition.=" AND language='" . $language . "'";
        }
        $results = $this->get_by_condition($condition, '', '', '*', false, false);

        foreach ($results as $result) {
            $this->delete($result['id']);
        }
    }

    /*
     * Подготавливаем геоданные
     *
     * @param array $data - подготавливаемые геоданные
     * @param integer $data_id - id метки
     * @param string $language - язык, данные на котором подготавливаем
     * @param array $en_data - образец данных на английском языке
     *
     * @return array - подготовленные геоданные
     */
    public function prepare_address($data, $data_id, $language, $en_data = array())
    {

        if ((my_is_empty(@$data['x'])) || (my_is_empty(@$data['y']))) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data:' . @json_encode($data)));
        }
        if (my_is_empty(@$data_id)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data_id:' . $data_id));
        }
        if (my_is_empty(@$language)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'language:' . $language));
        }


        $language_model = components\Language::get_instance();
        $language_model->is_available_language($language);

        $map_module = self::get_module(MY_MODULE_NAME_MAP);
        $adress = $map_module->get_adress_by_coords($data, $language);
        $adress_json = json_encode($adress);
        $data_db_model = components\Map::get_db_model('data');


        $data = array(
            'map_data_id' => $data_id,
            'language' => $language,
            'json_data' => $adress_json,
            'formatted_address' => $adress['formatted_adress']
        );
        foreach ($adress['address_components']['GeoObject']['metaDataProperty']['GeocoderMetaData']['Address']['Components'] as $parameters) {

            if ($parameters['kind'] === 'street') {

                $data['street'] = @$parameters['name'];

            } else if ($parameters['kind'] === 'country') {

                $data['country'] = @$parameters['name'];

                $data['country_code'] = my_prepare_to_one_word(@$en_data['country'], @$parameters['name']);

            } else if ($parameters['kind'] === 'province') {

                $data['administrative_area_level_1'] = @$parameters['name'];

                $data['state_code'] = my_prepare_to_one_word(@$en_data['administrative_area_level_1'], @$parameters['name']);

            } else if ($parameters['kind'] === 'area') {

                $data['administrative_area_level_2'] = @$parameters['name'];

            } else if ($parameters['kind'] === 'locality') {

                $data['locality'] = @$parameters['name'];
            }
        }
         if (my_is_empty(@$data['state_code'])) {
            $data['administrative_area_level_1'] = MY_UNDEFINED_VALUE;
            $data['state_code'] = MY_UNDEFINED_VALUE;
        }

        return $data;
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
