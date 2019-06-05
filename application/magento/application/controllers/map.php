<?php

namespace controllers;

use \components\app as components;
use \models\forms;
use \components\app\image;
/*
 * Контроллер Map
 */
final class Map extends \vendor\controller
{

    /*
     * Action index
     */
    public function action_index()
    {
        $map_form_model_new_point = self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT);
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $this->data['form_map_new_point'] = $map_form_model_new_point;
        $this->data['title'] = $seo_module->get_title('map/index');
        $this->data['keywords'] = $seo_module->get_keywords('map/index');
        $this->data['description'] = $seo_module->get_description('map/index');
        return $this->data;
    }

    /*
     * Ajax action set_site_language
     * Устанавливает язык сайта
     */
    public function action_ajax_set_site_language()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $language = @$_POST['language'];

        if (!$language) {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'language:' . $language . '; POST aray:' . json_encode($_POST)));
        }

        components\Language::get_instance()->set_language_in_session($language);

        $result = array('status' => MY_SUCCESS_CODE);
        echo json_encode($result);
    }

    /*
     * Ajax action get_placemarks_by_coords
     * Возвращает подготовленные данные меток,
     * которые входят в диапазон координат, переданых через $_REQUEST запрос,
     * кроме тех, которые уже есть на карте
     */
    public function action_ajax_get_placemarks_by_coords()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }
        $data = $_POST;

        //берем текущий центр карты
        if (isset($data['center'][0]) && isset($data['center'][1]) && isset($data['zoom'])) {
            $_SESSION['user']['map']['coords']['x'] = $data['center'][0];
            $_SESSION['user']['map']['coords']['y'] = $data['center'][1];
            $_SESSION['user']['map']['zoom'] = $data['zoom'];
        }
        $data = components\Map::get_db_model('data')->get_points_by_coords($data);

        $result = array('status' => MY_SUCCESS_CODE, 'data' => $data);
        echo json_encode($result);
    }

    /*
     * Ajax action fill_placemarks_on_map
     * Возвращает подготовленные данные меток в случайном порядке,
     * в определенном количестве, заданном в настройках сервиса,
     * кроме тех, которые уже есть на карте
     */
    public function action_ajax_fill_placemarks_on_map()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $data=components\Map::get_db_model('data')->get_points_bunch();

        $result = array('status' => MY_SUCCESS_CODE, 'data' => $data);
        echo json_encode($result);
    }

    /*
     * Ajax action get_placemark_content_by_id
     * Возвращает подготовленные данные метки по id,
     * переданным через $_REQUEST запрос
     */
    public function action_ajax_get_placemark_content_by_id()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $id = (int) @$_POST['id'];
        if (!$id) {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'calling field: id=' . $id . '; POST aray:' . json_encode($_POST)));
        }

        $data = components\Map::get_db_model('data')->get_point_content_by_id($id);

        $result = array('status' => MY_SUCCESS_CODE, 'data' => $data);
        echo json_encode($result);
    }


    /*
     * Ajax action ajax_get_placemarks_by_ids
     * Возвращает подготовленные данные меток по массиву ids,
     * переданным через $_REQUEST запрос
     */
    public function action_ajax_get_placemarks_by_ids()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $ids = $_POST;
        $data = array();
        if (isset($ids) && $ids && is_array($ids)) {

            // если нужна одна метка
            if (count($ids) === 1) {
                // подготавливаем её
                $ids = array($ids['id']);
            }

            $data = components\Map::get_db_model('data')->get_points_by_ids($ids);
        }

        $result = array('status' => MY_SUCCESS_CODE, 'data' => $data);
        echo json_encode($result);
    }

    /*
     * Ajax action upload_file_to_temp
     * Загружает картинку во временное хранилище
     */
    public function action_ajax_upload_file_to_temp()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $module = self::get_module(MY_MODULE_NAME_MAP);
        if (!$module->is_available_to_change()) {
            self::concrete_error(array(MY_ERROR_UNRESOLVED_ACCESS, 'calling action: action_ajax_upload_file_to_temp; '
                . 'POST aray:' . json_encode($_POST) . '; '
                . 'COOKIE array:' . json_encode($_COOKIE)));
        }

        $image = new Image($_FILES[MY_FILE_UPLOADED_VARNAME]);
        $image_temp_path = $image->check_and_upload_to_temp();
        echo($image_temp_path);
    }

    /*
     * Ajax action add_new_point
     * Сохраняет новую метку в базу,
     * обрабатывает и переносит фотографии из временного хранилища в папку метки
     */
    public function action_ajax_add_new_point()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $module = self::get_module(MY_MODULE_NAME_MAP);
        if (!$module->is_available_to_change()) {
            self::concrete_error(array(MY_ERROR_UNRESOLVED_ACCESS, 'calling action: action_ajax_add_new_point; '
                . 'POST aray:' . json_encode($_POST) . '; '
                . 'COOKIE array:' . json_encode(@$_COOKIE)));
        }

        // если редактируем
        if (my_is_not_empty(@$_POST['add_new_point_form']['id'])) {
            $module->update_current_point();
        } else {
            $module->create_new_point();
        }
    }

    /*
     * Ajax action add_new_point
     * Удаляет все данные метки из базы,
     * удаляет фотографии метки вместе с папкой
     */
    public function action_ajax_delete_point()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $module = self::get_module(MY_MODULE_NAME_MAP);
        if (!$module->is_available_to_change()) {
            self::concrete_error(array(MY_ERROR_UNRESOLVED_ACCESS, 'calling action: action_ajax_upload_file_to_temp; '
                . 'POST aray:' . json_encode($_POST) . '; '
                . 'COOKIE array:' . json_encode($_COOKIE)));
        }

        $module->delete_point();
    }
}
