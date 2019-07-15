/*
 * File application/express/components/Map.js
 * const Map = require('application/express/components/Map');
 *
 * Map component - compute map data
 */

const Fetch = require('node-fetch');
const Deasync = require('deasync');

const Component = require('application/express/core/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const AccessConfig = require_once('application/express/settings/gitignore/Access');

class Map extends Component {

    constructor(){
        super();

        /*
         * Example: https://geocode-maps.yandex.ru/1.x/?format=json&apikey=APIKEY&geocode=19.611347,0.760241&lang=en
         */
        this.GEOCODE_SERVICE_URL = 'https://geocode-maps.yandex.ru/1.x/?';
    }

    /*
     * Get placemark full data by id
     *
     * @param {integer} id - placemark id
     *
     * @return {object} - placemark data
     */
    getPointContentById(id)
    {
        let _result = this.get_point_content_by_ids([id], true, null, self::get_module(MY_MODULE_NAME_SERVICE)->is_show_relevant_placemarks(), self::get_module(MY_MODULE_NAME_SERVICE)->is_show_another_placemarks());



        return $result[$id];
    }



    /*
     * Get adress by coordinates from API
     *
     * @param {object} coords - coordinates {x,y}
     * @param {string} language - desired adress language
     *
     * @return {object} - adress
     */
    getAdressByCoords(coords, language = '')
    {
        if (!language) {
            language = this.getLanguage();
        }

        if (!language) {
            this.error(Consts.ERROR_LANGUAGE_NOT_FOUND, 'language [' + language + ']');
        }

        let _query = this.GEOCODE_SERVICE_URL + 'format=json&apikey=' + AccessConfig.yandexMapApiKey + '&geocode='+ coords.x + ',' + coords.y + '&lang=' + language;
        let _apiData;
        let _finished = false;

        fetch(_query)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                _apiData = data;
                _finished = true;
            });

        // Wait for convertation to be finished
        Deasync.loopWhile(function () {
            return !finished;
        });

        if (_apiData.error) {
            this.error(ErrorCodes.ERROR_MAP_API, _apiData.error.message);
        }

        if (!data.response || !data.response.GeoObjectCollection || !BaseFunctions.isSet(data.response.GeoObjectCollection.featureMember)) {
            this.error(ErrorCodes.ERROR_MAP_API_CHANGED_DATA);
        }
        let _featureMember = data.response.GeoObjectCollection.featureMember;
        let _adress = {};

        _adress['addressComponents'] = _featureMember[0];
        _adress['formattedAddress'] = _featureMember[0]['GeoObject']['metaDataProperty']['GeocoderMetaData']['text'];

        return _adress;
    }












    /*
     * Get placemarks full data by ids
     *
     * @param {array} ids - placemarks ids
     * @param {boolean} needPlainText - whether placemark description (plain text) is necessary
     * @param {string} order - fetch order
     * @param {boolean} needRelevant - whether 'relevant' placemarks are necessary
     * @param {boolean} needAnother - whether 'another' placemarks are necessary
     *
     * @return {object} - placemark data
     */
    getPointContentByIds(ids, needPlainText = true, order = null, needRelevant = false, needAnother = false)
    {
        if (!ids) {
            return [];
        }

        if (ids.length > 0) {




            $map_db_model_geocode = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
            $photos_db_model = components\Map::get_db_model('photos');
            $data_db_model = components\Map::get_db_model('data');
            $language_model = components\Language::get_instance();
            $language = $language_model->get_language();

            $conn = $photos_db_model->get_connect();
// делаем массив безопасным
            $ids = my_prepare_int_array($ids);
            $ids_list = implode(",", $ids);
            $config = self::get_config();

            $comment_plain = '';
            if (needPlainText) {
                $comment_plain = 'c.comment_plain as c_comment_plain,';
            }

            $sql = "SELECT
                    c.id as c_id,
                    c.x as c_x,
                    c.y as c_y,
                    c.comment as c_comment,
                    $comment_plain
                    c.title as c_title,
                    c.category as c_category,
                    c.subcategories as c_subcategories,
                    c.relevant_placemarks as c_relevant_placemarks,
                    c.created as c_created,
                    c.modified as c_modified,

                    geo.formatted_address as g_formatted_address,
                    geo.administrative_area_level_1 as g_administrative_area_level_1,
                    geo.administrative_area_level_2 as g_administrative_area_level_2,
                    geo.country_code as g_country_code,
                    geo.country as g_country,
                    geo.state_code as g_state_code,
                    geo.locality as g_locality,
                    geo.street as g_street,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height,
                    ph.created as ph_created,
                    ph.modified as ph_modified

                    FROM " . $data_db_model->get_table_name() . " c "
                    . "LEFT JOIN (SELECT * FROM " . $photos_db_model->get_table_name() . " ORDER by id DESC) ph ON ph.map_data_id=c.id "
                    . "LEFT JOIN " . $map_db_model_geocode->get_table_name() . " geo on geo.map_data_id = c.id AND geo.language='" . $language . "' "
                    . "WHERE c.id IN (" . $ids_list . ") ";

            $inner_order='c_id, ph_id DESC';
            if ($order) {
                $sql .= "ORDER by $order,$inner_order";
            }else{
                $sql .= "ORDER by $inner_order";
            }

            $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

            if (!my_array_is_not_empty(@$result)) {
                self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
            }

            $result = $this->prepare_result($result, needRelevant, needAnother);




            return $result;
        } else {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'ids:' . json_encode($ids)));
        }
    }




















}

Map.instanceId = BaseFunctions.unique_id();

module.exports = Map;


<?php

namespace modules\app\map\classes;
use \components\base\Ftp_Client;
use \components\app as components;




abstract class Map extends \vendor\Module
{



    /*
      public function add_photos_for_point(array $photos_array, $data_id)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $map_module->add_photos_for_point($photos_array, $data_id);
      }
     */
    /*
      public function delete_photo_files($data_id, $photo)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $map_module->delete_photo_files($data_id, $photo);
      }
     */



    /*
      public function delete_photo_db($id_data = null, $path = null)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      return $map_module->delete_photo_db($id_data, $path);
      }

      public function delete_photos($id_data = null)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      return $map_module->delete_photos($id_data);
      }

      public function prepare_photos_for_insert(array $photos_array)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      return $map_module->prepare_photos_for_insert($photos_array);
      }

      public function create_new_point()
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $map_module->create_new_point();
      }

      public function delete_point()
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $map_module->delete_point();
      } */

    /* public function get_points_list()
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      return $map_module->get_points_list();
      }

      public function update_current_point()
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $map_module->update_current_point();
      }

      public function get_photos_by_data_id($id)
      {

      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      $result = $map_module->get_photos_by_data_id($id);



      return $result;
      }

      public function get_points_by_ids(array $ids)
      {
      $module = self::get_module(MY_MODULE_NAME_MAP);

      return $module->get_points_by_ids($ids);
      } */


    public function is_available_to_change()
    {

        if (self::get_module(MY_MODULE_NAME_SERVICE)->is_all_can_add_placemarks() === true) {
            return true;
        }
        $account_module = self::get_module(MY_MODULE_NAME_ACCOUNT);
        if ($account_module->is_admin()) {
            return true;
        }
        return false;
    }


    public function get_points_by_coords(array $coords)
    {
        $result = $this->get_points_by_coords_naked($coords);
// если не пустой то подготавливаеи
        $result = is_array($result) && $result ? $this->prepare_result($result) : $result;


        return $result;
    }





    public function get_points_by_limit()
    {
        $result = $this->get_points_by_limit_naked();
// если не пустой то подготавливаеи
        $result = $result ? $this->prepare_result($result) : $result;


        return $result;
    }









    /*
      public function prepare_result(array $result)
      {
      $map_module = self::get_module(MY_MODULE_NAME_MAP);
      return $map_module->prepare_result($result);
      }
     */





    public function add_photos_for_point(array $photos_array, $data_id)
    {
        if (self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === false && my_array_is_empty(@$photos_array)) {
            return true;
        }


        $folder = $map_name = components\Map::get_name();

        if (!my_array_is_not_empty(@$photos_array)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'photos_array:' . json_encode($photos_array)));
        }
        if (my_is_empty(@$data_id)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data_id:' . $data_id));
        }
        $config = self::get_config();
        $map_db_model_photos = components\Map::get_db_model('photos');
// Добавляем новые фотки
        foreach ($photos_array as $photo) {
            $data_photos = array(
                'map_data_id' => $data_id,
                'path' => $photo['path'],
                'width' => $photo['width'],
                'height' => $photo['height'],
            );
            $map_db_model_photos->add_new_photo($data_photos);
        }
/////////////////////////////////return true;
// Переносим фотки в папку
        $dir_name_without_root = 'map' . MY_DS . $folder . MY_DS . $data_id;
        $dir_name = MY_FILES_DIR . $dir_name_without_root;
        @mkdir($dir_name, 0755);
        foreach ($photos_array as $photo) {
// создаем экземпляр для первого габарита
            $use_old_image = false;

// Для каждого размера
            foreach ($config['allows']['sizes']['images']['widths'] as $key => $width) {
                $photo_name = $key . '_' . $photo['path'];
                $photo_path = $dir_name . MY_DS . $photo_name;

                if (!\image_resize($photo_path, MY_TEMP_FILES_DIR . $photo['path'], $width, 0, 100, $use_old_image)) {
                    self::concrete_error(array(MY_ERROR_LOADING_FILE, "dirname: '" . $dir_name . "', photo:'" . $photo['path'] . "'"));
                }
                chmod($photo_path, 0755);

                // Если храним файлы на ftp сервере, то переносим их туда
                if ($config['files_upload_storage']['server'] === MY_FTP_NAME) {
                    Ftp_Client::connect();
                    Ftp_Client::make_dir($dir_name_without_root);
                    Ftp_Client::replace_to_ftp($dir_name, $photo_name, $dir_name_without_root . MY_DS . $photo_name);
                }
// дальше используем первый экземпляр для других размеров этой же картинки
                $use_old_image = true;
            }
            @unlink(MY_TEMP_FILES_DIR . $photo['path']);
        }
        // если перенеся все файлы на ftp папка пуста, то удаляем её
        if ($config['files_upload_storage']['server'] === MY_FTP_NAME) {
            if (is_dir_empty($dir_name)) {
                rmdir($dir_name);
            }
        }
    }


    public function delete_photo_files($data_id, $photo)
    {
        $folder = $map_name = components\Map::get_name();
        $config = self::get_config();
        if (my_is_empty(@$photo)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'photo:' . $photo));
        }
        if (my_is_empty(@$data_id)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data_id:' . $data_id));
        }

// Папка расположения фотки
        $dir_name = 'map' . MY_DS . $folder . MY_DS . $data_id;
        $dir_name_root = MY_FILES_DIR . $dir_name;
// Для каждого размера
        foreach ($config['allows']['sizes']['images']['widths'] as $key => $width) {
            if (!self::get_module(MY_MODULE_NAME_SERVICE)->is_photo_by_category($photo)) {

                // Если храним файлы на ftp сервере, то переносим их туда
                if ($config['files_upload_storage']['server'] === MY_FTP_NAME) {
                    Ftp_Client::connect();
                    Ftp_Client::delete_file_from_ftp($dir_name . MY_DS . $key . '_' . $photo);
                } else {
                    @unlink($dir_name_root . MY_DS . $key . '_' . $photo);
                }
            }
        }
        if ($config['files_upload_storage']['server'] === MY_FTP_NAME) {
            Ftp_Client::delete_dir_from_ftp($dir_name);
        }
    }


    public function delete_photo_db($id_data = null, $path = null)
    {
        if (self::get_module(MY_MODULE_NAME_SERVICE)->is_photo_by_category($path)) {
            return true;
        }
        if (!$id_data) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id_data:' . $id_data));
        }
        if (!$path) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'path:' . $path));
        }

        $need_result = self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true ? true : false;



        $map_db_model_photos = components\Map::get_db_model('photos');
        $path = $map_db_model_photos->get_connect()->quote($path);

        $where = 'map_data_id=' . (int) $id_data . ' AND path=' . $path;

        $result = $map_db_model_photos->get_by_condition($where, $order = '', $group = '', $select = '*', $limit = false, $need_result);


        $photos_db_model = components\Map::get_db_model('photos');

        return $photos_db_model->delete($result[0]['id']);
    }


    public function prepare_photos_for_insert(array $photos_array)
    {

        $photos = array();

// подготавливаем данные фоток для вставки
        foreach ($photos_array as $photo) {
            $photo_path = MY_TEMP_FILES_DIR . $photo;
            if (!file_exists($photo_path) || !$photo) {
                return array();
            }

            $image_info = getimagesize($photo_path);
            $photos[] = array(
                'path' => $photo,
                'width' => $image_info[0],
                'height' => $image_info[1],
            );
        }

        return $photos;
    }


    public function get_photos_by_data_id($id)
    {
        if (!$id = (int) $id) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id:' . $id));
        }

        $need_result = self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true ? true : false;

        $map_db_model_photos = components\Map::get_db_model('photos');
        //берем, начиная с последних, то есть последняяфотка будет главной теперь
        return $map_db_model_photos->get_by_condition("map_data_id = $id", 'id DESC', '', '*', false, $need_result);
    }


    public function get_points_by_coords_naked(array $data)
    {
        $config = self::get_config();
        if (isset($data['X1']) && isset($data['X2']) && isset($data['Y1']) && isset($data['Y2']) && isset($data['zoom'])) {
            $photos_db_model = components\Map::get_db_model('photos');
            $data_db_model = components\Map::get_db_model('data');
            $max_map_load_size = self::get_module(MY_MODULE_NAME_SERVICE)->get_max_map_load_size();
            $conn = $photos_db_model->get_connect();

            $x1 = (float) $data['X1'];
            $x2 = (float) $data['X2'];
            $y1 = (float) $data['Y1'];
            $y2 = (float) $data['Y2'];

// определяем старый и новый масштабы
            $data['zoom'] = (int) $data['zoom'];

// если НЕ передаются старые координаты, значит это первый запрос
///////////////////$data['old_X1'] - отключили и не передаем пока - потому что "Г" поиск решили пока не исполоьзовать (см ниже)

            if (!isset($data['old_X1']) || !isset($_SESSION['old_zoom'])) {
                $_SESSION['old_zoom'] = $data['zoom'];
            }

            $old_zoom = $_SESSION['old_zoom'];

            $_SESSION['old_zoom'] = $data['zoom'];

// Если область охвата слишком большая
            if ((($x1 < $x2) && (abs($x2 - $x1) > $max_map_load_size)) || ((($x1 > 0) && ($x2 < 0)) && (abs((180 - $x1) + abs(-180 - $x2)) > $max_map_load_size)) || (abs($y1 - $y2) > $max_map_load_size)) {
                return MY_TOO_BIG_MAP_REQUEST_AREA_CODE;
            }

            $sql = "SELECT
                    t.id as c_id,
                    t.x as c_x,
                    t.y as c_y,
                    t.title as c_title,
                    t.category as c_category,
                    t.subcategories as c_subcategories,
                    t.relevant_placemarks as c_relevant_placemarks,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM (SELECT * FROM " . $data_db_model->get_table_name() . " WHERE ";

            if (($x1 > 0) && ($x2 < 0)) {

                $sql .= "((x BETWEEN $x1 AND 180) OR  (x BETWEEN -180 AND $x2)) ";
            } else {

                $sql .= "(x BETWEEN $x1 AND $x2) ";
            }

            $sql .= "AND (y BETWEEN $y2 AND $y1)) t "
                    . "LEFT JOIN (
SELECT * FROM
(SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
) ph ON ph.map_data_id=t.id";
// "Г" поиск сильно нагружает базу
            if (!1 && ($old_zoom >= $data['zoom']) && (my_is_not_empty(@$data['old_X1']))) {
                if (my_is_not_empty(@$data['old_X2']) && my_is_not_empty(@$data['old_Y1']) && my_is_not_empty(@$data['old_Y2'])) {

                    $old_X1 = set_amendment((float) $data['old_X1'], 'x1', $data);
                    $old_X2 = set_amendment((float) $data['old_X2'], 'x2', $data);
                    $old_Y1 = set_amendment((float) $data['old_Y1'], 'y1', $data);
                    $old_Y2 = set_amendment((float) $data['old_Y2'], 'y2', $data);
// Если масштаб не менялся на приближение (например из большой неподгружаемой зоны входим в зону видимости в рамках старой зоны - надо подгрузить все метки без фильтра)
// всегда
                    if (1 || (($y1 - $y2) >= ($old_Y1 - $old_Y2))) {
                        $sql .= "LEFT JOIN (SELECT * FROM " . $data_db_model->get_table_name() . " WHERE ";
                        if (($old_X1 > 0) && ($old_X2 < 0)) {
                            $sql .= "((x BETWEEN $old_X1 AND 180) OR (x BETWEEN -180 AND $old_X2)) ";
                        } else {
                            $sql .= "(x BETWEEN $old_X1 AND $old_X2) ";
                        }
                        $sql .= "AND (y BETWEEN $old_Y2 AND $old_Y1)) t_old ON t.id = t_old.id WHERE t_old.id iS NULL ";
                    }
                } else {
                    self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'old data:' . json_encode($data)));
                }
            }

            //что больше не выбираем
            $loaded_ids_from_session = $this->get_loaded_ids_string_from_session();
            if ($loaded_ids_from_session) {
                $sql .= " WHERE t.id NOT IN (" . $loaded_ids_from_session . ")";
            }

            $sql .= " GROUP by c_id";

            $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

            if (!is_array($result)) {
                self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
            }

            $this->set_loaded_ids_to_session($result);

            return $result;
        } else {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'data:' . json_encode($data)));
        }
    }


    public function get_points_by_limit_naked($limit = null)
    {
        if (!$limit) {
            //если не передали, то берем из настроек сервиса
            $limit = self::get_module(MY_MODULE_NAME_SERVICE)->get_map_autofill_limit();
        }

        $photos_db_model = components\Map::get_db_model('photos');
        $data_db_model = components\Map::get_db_model('data');
        $conn = $photos_db_model->get_connect();
        $config = self::get_config();


        $sql = "SELECT
                    t.id as c_id,
                    t.x as c_x,
                    t.y as c_y,
                    t.title as c_title,
                    t.category as c_category,
                    t.subcategories as c_subcategories,
                    t.relevant_placemarks as c_relevant_placemarks,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM " . $data_db_model->get_table_name() . " t ";



        $sql .= "LEFT JOIN (
SELECT * FROM
(SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
) ph ON ph.map_data_id=t.id";
        //что больше не выбираем
        $loaded_ids_from_session = $this->get_loaded_ids_string_from_session();
        if ($loaded_ids_from_session) {
            $sql .= " WHERE t.id NOT IN (" . $loaded_ids_from_session . ")";
        }

        $sql .= " GROUP by c_id ORDER by RAND() DESC LIMIT " . $this->get_filling_bunch_last_id_from_session() . ',' . $limit;

        $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
        if (!is_array($result)) {
            self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
        }

        $this->set_loaded_ids_to_session($result);

        return $result;
    }


    protected function get_filling_bunch_last_id_from_session()
    {
        if (my_is_empty(@$_SESSION['map']['placemarks']['fill']['bunch']['last_id'])) {
            return 0;
        } else {
            return $_SESSION['map']['placemarks']['fill']['bunch']['last_id'];
        }
    }


    protected function set_filling_bunch_last_id_from_session($value)
    {
        if ($value < $_SESSION['map']['placemarks']['fill']['bunch']['last_id'] || $value < 1) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'value:' . $value . ', SESSION:' . $_SESSION['map']['placemarks']['fill']['bunch']['last_id']));
            return;
        }
        $_SESSION['map']['placemarks']['fill']['bunch']['last_id'] = (int) $value;
    }


    protected function get_loaded_ids_string_from_session()
    {
        if (my_array_is_not_empty(@$_SESSION['map']['placemarks']['loaded']['ids'])) {

            return implode(',', $_SESSION['map']['placemarks']['loaded']['ids']);
        } else {
            return '';
        }
    }


    // Пишем в сессию найденные метки, чтобы потом их не грузить снова
    protected function set_loaded_ids_to_session($result = array())
    {
        if ($result) {
            foreach ($result as $data) {
                if (!isset($data['c_id'])) {
                    self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'result:' . json_encode($result)));
                    return;
                }
                $_SESSION['map']['placemarks']['loaded']['ids'][$data['c_id']] = $data['c_id'];
            }
        }
    }


    protected function clear_loaded_ids_from_session()
    {
        unset($_SESSION['map']['placemarks']['loaded']['ids']);
    }


    public function get_points_by_ids(array $ids)
    {
        if (!$ids) {
            return array();
        }
        $photos_db_model = components\Map::get_db_model('photos');
        $data_db_model = components\Map::get_db_model('data');

        $conn = $photos_db_model->get_connect();
        $config = self::get_config();

        foreach ($ids as &$id) {
            $id = (int) $id;
        }

        $ids_list = implode(',', $ids);
// берем только одну фотку
        $sql = "SELECT
                    c.id as c_id,
                    c.x as c_x,
                    c.y as c_y,
                    c.title as c_title,
                    c.category as c_category,
                    c.subcategories as c_subcategories,
                    c.relevant_placemarks as c_relevant_placemarks,

                    ph.id as ph_id,
                    ph.path as ph_path,
                    ph.width as ph_width,
                    ph.height as ph_height

                    FROM " . $data_db_model->get_table_name() . " c "
                . "LEFT JOIN (
SELECT * FROM
(SELECT MAX(id) phh2_id FROM landmarks_map_photos GROUP BY map_data_id) phh2
JOIN landmarks_map_photos on phh2.phh2_id=landmarks_map_photos.id
) ph ON ph.map_data_id=c.id "
                . "WHERE c.id IN ($ids_list) "
                . "GROUP by c_id "
                . "ORDER by c_title ASC";

        $result = $conn->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

        if (!my_array_is_not_empty(@$result)) {
            self::concrete_error(array(MY_ERROR_MYSQL, 'request:' . $sql), MY_LOG_MYSQL_TYPE);
        }

        $result = $this->prepare_result($result);
        return $result;
    }





    protected function authenticate_by_password_and_data_id($password, $data_id)
    {
//проверка на суперадминский пароль
        if (hash_equals_to_value($password, MY_SUPER_ADMIN_PASSWORD_HASH)) {
            return true;
        }

// ищем id юзера по редактируемой метке
        $map_db_model_data = components\Map::get_db_model('data');
        $data = $map_db_model_data->get_by_condition('id = ' . $data_id, '', '', '*', 1);

        if (my_is_not_empty(@$data['user_id'])) {
            $user_id = $data['user_id'];

// ищем его хеш
            $users_model = self::get_model(MY_MODEL_NAME_DB_USERS);
            $user = $users_model->get_by_condition('id=' . $user_id, '', '', '*', 1);

// сверяем пароли
            if (hash_equals_to_value($password, $user['password_hash'])) {
                return true;
            }
        }

        return false;
    }


    public function delete_point()
    {
        $config = self::get_config();
        $map_db_model_data = components\Map::get_db_model('data');
        $map_db_model_photos = components\Map::get_db_model('photos');
        $map_db_model_geocode_collection = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
// определяем POST данные
        $form_data = $_POST['add_new_point_form'];


// проверка post данных
        if (my_is_not_empty(@$form_data['id']) && (isset($form_data['password']))) {

            $data_id = (int) $form_data['id'];
            $password = $form_data['password'];
        } else {
            self::concrete_error(array(MY_ERROR_FORM_NOT_PASSED,
                'id: ' . @$form_data['id']
                . ', password: ' . @$form_data['password']
            ));
        }


// проверяем приложенный пароль
        if (!$password) {
            echo my_pass_through(@self::trace('errors/update_point/empty_password'));
            self::rollback();
        }
        if (!$this->authenticate_by_password_and_data_id($password, $data_id)) {
            echo my_pass_through(@self::trace('errors/update_point/wrong_password'));
            self::rollback();
        }

// удаляем фотографии из базы и дериктории
        $this->delete_photos($data_id);

// удаляем метку из базы
        $map_db_model_data->delete($data_id);

//удаляем адреса меток
        $map_db_model_geocode_collection->delete_adresses($data_id);

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/point/deleted')),
            'data' => array(
                'id' => $data_id
            )
        );
        echo json_encode($result);
    }


    public function delete_photos($data_id = null)
    {
        if (!$data_id) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id_data:' . $data_id));
        }
// удаляем фотки из базы и из директории
        $map_db_model_photos = components\Map::get_db_model('photos');
        $where = 'map_data_id=' . (int) $data_id;
        $result = $map_db_model_photos->get_by_condition($where);

        foreach ($result as $photo) {
// из базы
            $map_db_model_photos->delete($photo['id']);
// из директории
            $this->delete_photo_files($data_id, $photo['path']);
        }
    }


    public function update_current_point()
    {

        $config = self::get_config();
        $map_db_model_data = components\Map::get_db_model('data');
        $map_form_model_data = self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT);
        $map_db_model_photos = components\Map::get_db_model('photos');
        $map_db_model_geocode_collection = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);

// определяем POST данные
        $form_data = $_POST['add_new_point_form'];

        $data = array();
        $photos = array();
        $data_photos = array();

//если title не используем, то задаем его пустым (он не передается в форме, но надо все же его инициализировать)
        if (!self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()) {
            $form_data['title'] = '';
        }

// проверка post данных
        if ($map_form_model_data->check_select_type_field('category', @$form_data['category'], false) && my_is_not_empty(@$form_data['id']) && (int) $form_data['id'] && (isset($form_data['x'])) && (isset($form_data['y'])) && (isset($form_data['comment'])) && (isset($form_data['title'])) && (isset($form_data['password']))) {

            $form_data['id'] = (int) $form_data['id'];
            $password = $form_data['password'];

            if ($form_data['x'] || $form_data['y']){
                my_check_coords($form_data['x'], $form_data['y']);
            }
            $data = array(
                'id' => $form_data['id'],
                'x' => $form_data['x'],
                'y' => $form_data['y'],
                'comment' => $form_data['comment'],
                'comment_plain' => $form_data['comment'],
                'title' => $form_data['title'],
                'category' => $form_data['category'],
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

// проверяем приложенный пароль

        if (!$password) {
            echo my_pass_through(@self::trace('errors/update_point/empty_password'));
            self::rollback();
        }

        if (!$this->authenticate_by_password_and_data_id($password, $form_data['id'])) {
            echo my_pass_through(@self::trace('errors/update_point/wrong_password'));
            self::rollback();
        }








// проверяем приложенные фото
        if (my_is_not_empty(@$form_data['photos'])) {
            $photos_new_array = explode(' ', trim($form_data['photos']));

// подготавливаем данные фоток для вставки
            if (!$photos_new_prepared = $this->prepare_photos_for_insert($photos_new_array)) {
                self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'photos: [' . $form_data['photos'] . ']'));
            }

// сколько новых
            $photos_new_count = count($photos_new_array);
        } else {
            $photos_new_count = 0;
        }


// сколько всего было до этого
        $photos_existed = $map_db_model_photos->get_by_data_id($form_data['id']);
        $photos_existed_count = count($photos_existed);

//если удаляем часть фоток
        if (my_array_is_not_empty(@$form_data['delete_photos'])) {
// сколько фоток удаляем
            $photos_deleted_count = count($form_data['delete_photos']);
        } else {
            $photos_deleted_count = 0;
        }
// считаем сколько всего фоток в итоге с учетом удаленных и новых
        $photos_count = $photos_existed_count + $photos_new_count - $photos_deleted_count;


// Если фоток получается больше положенного
        if ($photos_count > $config['allows']['max_upload_files_per_point']) {
            self::concrete_error(array(MY_ERROR_FORM_UPDATE_POINT_A_LOT_OF_PHOTOS,
                'photos new: [' . $form_data['photos'] . '],'
                . 'photos delete: [' . json_encode(@$form_data['delete_photos']) . ']'
                . 'photos existed: [' . json_encode($photos_existed) . ']'
            ));
        }

        if (($photos_count === 0) && (self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true)) {
            self::concrete_error(array(MY_ERROR_FORM_UPDATE_POINT_WITH_NO_PHOTOS,
                'photos new: [' . $form_data['photos'] . '],'
                . 'photos delete: [' . json_encode(@$form_data['delete_photos']) . ']'
                . 'photos existed: [' . json_encode($photos_existed) . ']'
            ));
        }

        //предварительно обновляем адрес - работаем еще со старыми координатами
        $map_db_model_geocode_collection->update_record(array('x' => $data['x'], 'y' => $data['y']), $data['id']);
        // обновляем метку
        $map_db_model_data->update_point($data);

        // удаляем фотки, которые указали
        if ($photos_deleted_count) {
            foreach ($form_data['delete_photos'] as $name => $value) {
                // из базы
                $this->delete_photo_db($form_data['id'], $name);

                // из директории
                $this->delete_photo_files($form_data['id'], $name);
            }
        }
        //если добавили новые фотки
        if ($photos_new_count) {

            // Добавляем новые фотки
            $this->add_photos_for_point($photos_new_prepared, $form_data['id']);
        }

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_point/updated')),
            'data' => array(
                'id' => $form_data['id']
            )
        );
        echo json_encode($result);
    }


    public function create_new_point()
    {
        $config = self::get_config();
        $map_db_model_data = components\Map::get_db_model('data');
        $map_db_model_geocode_collection = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $map_form_model_data = self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT);
        $map_db_model_photos = components\Map::get_db_model('photos');

// определяем POST данные
        $data = array();
        $photos = array();
        $data_photos = array();
        $need_to_send_email = false;

// проверка и подготовка post данных
        $map_form_model_data->prepare_fields();

        $form_data = $_POST['add_new_point_form'];

//если title не используем, то задаем его пустым (он не передается в форме, но надо все же его инициализировать)
        if (!self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()) {
            $form_data['title'] = '';
        }
        my_check_coords($form_data['x'], $form_data['y']);

        $user_email = isset($form_data['email']) ? $form_data['email'] : null;
        $data = array(
            'x' => $form_data['x'],
            'y' => $form_data['y'],
            'comment' => $form_data['comment'],
            'comment_plain' => $form_data['comment'],
            'title' => $form_data['title'],
            'category' => $form_data['category'],
        );

// если email приложен
        if ($user_email) {

            $users_model = self::get_model(MY_MODEL_NAME_DB_USERS);
            if (!$users_model->validate('email', $user_email, MY_FILTER_TYPE_ALL, false)) {
                echo my_pass_through(@self::trace('errors/new_point/wrong_email'));
                self::rollback();
            }

            $user_data = $this->prepare_user_email($user_email);
            $data['user_id'] = $user_data['id'];

// если только что создалось
            if ($user_data['just_created'] === true) {
                $need_to_send_email = true;
            }
            self::set_cookie(MY_COOKIE_EMAIL_PLACEMARK, $user_email);
        }
// записываем координату
        $id_data = $map_db_model_data->add_new_point($data);

        $map_db_model_geocode_collection->add(array('x' => $data['x'], 'y' => $data['y']), $id_data);


// проверяем приложенные фото
        $photos_array = explode(' ', trim($form_data['photos']));

// Если фоток больше положенного
        if (count($photos_array) > $config['allows']['max_upload_files_per_point']) {
            self::concrete_error(array(MY_ERROR_FORM_NEW_POINT_A_LOT_OF_PHOTOS, 'photos: [' . $form_data['photos'] . ']'));
        }

// подготавливаем данные фоток
        if ((!$photos = $this->prepare_photos_for_insert($photos_array)) && (self::get_module(MY_MODULE_NAME_SERVICE)->is_need_photos_for_placemarks() === true)) {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'photos: [' . $form_data['photos'] . ']'));
        }
// Добавляем фотки
        $this->add_photos_for_point($photos, $id_data);

// возвращаемся на предыдущую страницу через url возврата (после execute())
// теперь через ajax self::set_redirect_url($form_data[MY_FORM_SUBMIT_REDIRECT_URL_VAR_NAME]);

        if ($need_to_send_email === true) {
// отправляем почту
            $mailer_module = self::get_module(MY_MODULE_NAME_MAILER);
            $data = array(
                'recipient' => $user_email,
                'password' => $user_data['password'],
            );
            $mailer_module->send_password_after_create_placemark($data, $id_data);
        }

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_point/created')),
            'data' => array(
                'id' => $id_data,
                'email' => $user_email
            )
        );
        echo json_encode($result);
        return $result;
    }


    protected function prepare_user_email($email)
    {
        if (!$email) {
            return NULL;
        }

// проверяем, есть ли он уже в базе юзеров
        $users_model = self::get_model(MY_MODEL_NAME_DB_USERS);
        $result = $users_model->get_by_condition('email=' . $users_model->get_connect()->quote($email), '', '', '*', 1, false);
// если нашли
        if (my_is_not_empty(@$result['id'])) {
            return array(
                'just_created' => false,
                'id' => $result['id']
            );
        }

// если не нашли - создаем
        $password = my_create_password();
        $data = array(
            'email' => $email,
            'password_hash' => hash($password)
        );
        $id = $users_model->add_new_user($data);

        return array(
            'just_created' => true,
            'id' => $id,
            'password' => $password
        );
    }


    protected function prepare_address(array $adress)
    {

        $language_model = components\Language::get_instance();
        $language = $language_model->get_language();
        $result = '';
        if ($language === MY_LANGUAGE_RU) {
// Гугл в русских сообщениях пишет иногда иностранные слова
            $result = str_replace('Unnamed Road', @$adress['administrative_area_level_2'], @$adress['formatted_address']);
            return $result;
        }

        return $result;
    }


    public function prepare_result(array $result, $need_relevant = false, $need_another = false)
    {
        $country_component = components\Countries::get_instance();
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $config = self::get_config();
        $return = array();

        foreach ($result as $value) {
            if (!isset($return[$value['c_id']])) {
                $return[$value['c_id']] = array(
                    'id' => $value['c_id'],
                    'x' => $value['c_x'],
                    'y' => $value['c_y'],
                    'comment' => isset($value['c_comment']) ? $value['c_comment'] : null,
                    'comment_plain' => isset($value['c_comment_plain']) ? $value['c_comment_plain'] : null,
                    'formatted_address' => isset($value['g_country_code']) ? $catalog_module->prepare_address(@$value['g_state_code'], @$value['g_country_code'], @$value['g_administrative_area_level_2'], @$value['g_administrative_area_level_1'], @$value['g_country'], @$value['g_locality']) : null,
                    'formatted_address_with_route' => isset($value['g_country_code']) ? $catalog_module->prepare_address_with_route(@$value['g_state_code'], @$value['g_country_code'], @$value['g_administrative_area_level_2'], @$value['g_administrative_area_level_1'], @$value['g_country'], @$value['g_locality'], @$value['g_street']) : null,
                    'flag_url' => isset($value['g_country_code']) ? get_flag_url(@$value['g_country_code']) : null,
                    'country_code' => isset($value['g_country_code']) ? $value['g_country_code'] : null,
                    'state_code' => isset($value['g_state_code']) ? $value['g_state_code'] : null,
                    'street' => isset($value['g_street']) ? $value['g_street'] : null,
                    'title' => $value['c_title'],
                    'category' => $value['c_category'],
                    'subcategories' => $value['c_subcategories'],
                    'relevant_placemarks' => self::get_module(MY_MODULE_NAME_SERVICE)->is_show_relevant_placemarks() ? $value['c_relevant_placemarks'] : '',
                    'created' => isset($value['c_created']) ? $value['c_created'] : null,
                    'modified' => isset($value['c_modified']) ? $value['c_modified'] : null,
                );

// --> Prepare catalog_url
                if ($return[$value['c_id']]['country_code']) {
                    if ($country_component->has_states($return[$value['c_id']]['country_code'])) {
                        $catalog_url = $return[$value['c_id']]['country_code'] . '/' . $return[$value['c_id']]['state_code'] . '/' . $return[$value['c_id']]['id'];
                    } else {
                        $catalog_url = $return[$value['c_id']]['country_code'] . '/' . $return[$value['c_id']]['id'];
                    }
                } else {
                    $catalog_url = '';
                }
                $return[$value['c_id']]['catalog_url'] = $catalog_url;
// <-- Prepare catalog_url
            }


// Add photos
            if ($value['ph_id']) {

//первая фотка - фотка категории - несколько раз перезапишет - не страшно
                if (self::get_module(MY_MODULE_NAME_SERVICE)->is_add_category_photo_as_first_in_placemark_view() === true) {
                    $return[$value['c_id']]['photos'][0] = array(
                        'id' => 0,
                        'dir' => MY_SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                        'name' => $catalog_module->get_category_code($value['c_category']) . '.jpg',
                        'width' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_width(),
                        'height' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_height(),
                        'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                        'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                    );
                }



//загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
                $dir = $this->get_photo_dir($value['c_id'], $value['ph_path']);
                $return[$value['c_id']]['photos'][] = array(
                    'id' => $value['ph_id'],
                    'dir' => $dir,
                    'name' => $value['ph_path'],
                    'width' => $value['ph_width'],
                    'height' => $value['ph_height'],
                    'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                    'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                );
            } else {
//если фоток нет - берем дефолтную
                $return[$value['c_id']]['photos'][0] = array(
                    'id' => 0,
                    'dir' => MY_SERVICE_IMGS_URL_CATEGORIES_PHOTOS,
                    'name' => $catalog_module->get_category_code($value['c_category']) . '.jpg',
                    'width' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_width(),
                    'height' => self::get_module(MY_MODULE_NAME_SERVICE)->get_categories_photo_initial_height(),
                    'created' => isset($value['ph_created']) ? $value['ph_created'] : null,
                    'modified' => isset($value['ph_modified']) ? $value['ph_modified'] : null,
                );
            }




            if ($need_relevant) {
                if ($value['c_relevant_placemarks']) {
                    ob_start();
                    $this->trace_block('_models/placemark/sublist_1', false, array(
                        'ident' => 'relevant',
                        'ids' => $value['c_relevant_placemarks'],
                        'image_width' => $config['dimentions'][get_device()]['sublist_images']['width'],
                        'image_height' => $config['dimentions'][get_device()]['sublist_images']['height'],
                        'title' => my_pass_through(@self::trace('relevant_placemarks/title/text')))
                    );
                    $relevant_placemarks = ob_get_clean();
                    $return[$value['c_id']]['relevant_placemarks'] = $relevant_placemarks ? $relevant_placemarks : null;
                    unset($relevant_placemarks);
                }
            }

            if ($need_another) {
                $another_placemarks_ids = $catalog_module->get_another_placemarks_by_category($value['c_category'], $value['c_id']);
                if (my_array_is_not_empty($another_placemarks_ids)) {
                    ob_start();
                    $this->trace_block('_models/placemark/sublist_1', false, array(
                        'ident' => 'another',
                        'ids' => $another_placemarks_ids,
                        'image_width' => $config['dimentions'][get_device()]['sublist_images']['width'],
                        'image_height' => $config['dimentions'][get_device()]['sublist_images']['height'],
                        'title' => my_pass_through(@self::trace('another_placemarks/title/text')))
                    );
                    $another_placemarks = ob_get_clean();
                    $return[$value['c_id']]['another_placemarks'] = $another_placemarks ? $another_placemarks : null;
                    unset($another_placemarks);
                } else {
                    $return[$value['c_id']]['another_placemarks'] = null;
                }
            }

            ob_start();
            $this->trace_block('placemarks/categories_viewer', false, array(
                'category' => $value['c_category'],
                'subcategories' => $value['c_subcategories'])
            );
            $categories_html = ob_get_clean();
            $return[$value['c_id']]['categories_html'] = my_pass_through(@$categories_html);
            unset($categories_html);
        }
        return $return;
    }


//потому что загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
    public function get_photo_dir($c_id, $ph_path)
    {

//потому что загружаем файлы сперва на основной сервер, а потом премещаем их в облачное хранилище, тем самым сохраняя место на сервере
        return prepare_photo_path($c_id, $ph_path, '1_', true, true);
    }
}
