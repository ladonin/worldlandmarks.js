/*
 * File application/express/components/base/AdminAccess.js
 *
 * Admin access component
 */


const Controller = require('application/express/core/Controller');
const Users = require('application/express/core/Users');



class Admin_Access extends Controller
{
    autorize()
    {
        if (Users.admin_access_authentication() == false) {
            return false;
        }
        return true;
    }






<?php
//админский доступ к сайту

namespace controllers;

use \components\app as components;
use \models\forms;
use \components\app\image;

$access_settings = require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'ignore' . MY_DS . 'access.php');

final class Admin_Access extends \core\controller
{


    protected function autorize()
    {
        if (components\User::admin_access_authentication() == false) {
            echo "incorrect password\n";
            unset($_SESSION['admin_access_autorize']);
            return false;
        }
        $_SESSION['admin_access_autorize'] = true;
        return true;
    }


//добавляем новый язык к конкретной метке (выполняется в консоли по всем меткам)
//этот метод безобидный можно запускать без пароля
    public function action_add_language_to_geocode_collection()
    {
        if ($this->autorize()) {
            $language = $this->get_get_var(MY_LANGUAGE_CODE_VAR_NAME);

            $language_model = components\Language::get_instance();
            $language_model->is_available_language($language);

            $placemark_id = $this->get_get_var(MY_ID_VAR_NAME);

            $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
            $condition = "language='" . MY_LANGUAGE_EN . "' AND map_data_id='" . $placemark_id . "'";
            $order = "";
            $select = 'country_code, state_code';
            $limit = 1;
            $need_result = true;
            $data_en = $db_model_adress->get_by_condition($condition, $order, '', $select, $limit, $need_result);

            $data = $db_model_adress->add_one_language($placemark_id, $language, array('country' => $data_en['country_code'], 'administrative_area_level_1' => $data_en['state_code']));

            if ($data) {
                echo($placemark_id . ": success\n");
            }
        }
        return $this->data;
    }


    //проверяем доступность стороннего url фото - пароль совсем не нужен
    public function action_check_avialability_outer_photo_url()
    {

        $photo_url = isset($_POST['url']) && $_POST['url'] ? $_POST['url'] : null;

        if ($photo_url) {
            $mime = my_get_image_type($photo_url, true, true);
            if ($mime == 'jpg') {
                $mime = 'jpeg';
            }
            $temp_file_name = 'checking_' . my_get_unique() . '.' . $mime;

            $new_path = MY_TEMP_FILES_DIR . $temp_file_name;

            // копируем себе удаленную фотку
            if (download_image_by_url($photo_url, $new_path)) {
                //удаляем
                @unlink($new_path);
                return true;
            }
        }

        return false;
    }


    //создаем метку через админку
//этот метод безобидный можно запускать без пароля
    public function action_add_placemark()
    {
        if ($this->autorize()) {
            $title = isset($_POST['title']) && $_POST['title'] ? preg_replace("/[\t\n\r]*/im", '', strip_tags($_POST['title'])) : '';
            $comment = isset($_POST['comment']) && $_POST['comment'] ? $_POST['comment'] : '';
            $x = isset($_POST['x']) && $_POST['x'] ? round($_POST['x'], 4) : '';
            $y = isset($_POST['y']) && $_POST['y'] ? round($_POST['y'], 4) : '';
            $photos = isset($_POST['photos']) && $_POST['photos'] ? $_POST['photos'] : array();
            $category = isset($_POST['category']) && $_POST['category'] ? $_POST['category'] : 0;
            $subcategories = isset($_POST['subcategories']) && $_POST['subcategories'] ? $_POST['subcategories'] : '';

            // проверяем, есть ли уже на этом месте какая-то метка
            $data_db_model = components\Map::get_db_model('data');
            $conn = $data_db_model->get_connect();

            $x_max = $x + 0.0001;
            $x_min = $x - 0.0001;

            $y_max = $y + 0.0001;
            $y_min = $y - 0.0001;

            $condition = "title=" . $conn->quote($title) . ' AND (x BETWEEN ' . $x_min . ' AND ' . $x_max . ') AND (y BETWEEN ' . $y_min . ' AND ' . $y_max . ')';

            $select = 'id';
            $need_result = false;
            $placemarks = $data_db_model->get_by_condition($condition, '', '', $select, 1, $need_result);

            if (is_array($placemarks) && my_array_is_not_empty($placemarks)) {
                echo("<div class=\"alert alert-danger\" role=\"alert\">Метка <a href='/map/" . $placemarks['id'] . "' target='_blank'>$title</a> уже есть.</div>");
                return $this->data;
            }

            //пишем фотки в temp
            // нам нужно скачать фотку удаленно и поместить её в папку temp
            $config = self::get_config();

            $new_photos_string = '';
            foreach ($photos as $photo_url) {

                $mime = my_get_image_type($photo_url, true, true);
                if ($mime == 'jpg') {
                    $mime = 'jpeg';
                }
                $temp_file_name = my_get_unique() . '.' . $mime;

                $new_path = MY_TEMP_FILES_DIR . $temp_file_name;

                // копируем себе удаленную фотку
                if (!download_image_by_url($photo_url, $new_path)) {
                    echo "<div class=\"alert alert-danger\" role=\"alert\">не удалось скопировать $photo_url в $new_path...</div>";
                    self::concrete_error(array(MY_ERROR_COPY_IMAGE_TO_TEMP_FILES_DIR_FROM_URL, 'photo_url:' . $photo_url . ', new_path:' . $new_path));
                }

                //обновляем картинку в temp до jpeg
                change_image_to_jpeg($new_path);
                $new_photo_name = prepare_image_name_to_jpeg($temp_file_name);
                // составляем поле photos как будто это значение формы
                $new_photos_string.=$new_photo_name . ' ';
            }

            $_POST['add_new_point_form']['comment'] = $comment;
            $_POST['add_new_point_form']['x'] = $x;
            $_POST['add_new_point_form']['y'] = $y;
            $_POST['add_new_point_form']['title'] = $title;
            $_POST['add_new_point_form']['category'] = $category;
            $_POST['add_new_point_form']['photos'] = $new_photos_string; //готовые фотки в temp, строкой, например "58043a272e9e6295.jpeg 58043a2dd8abb584.jpeg "

            $module = self::get_module(MY_MODULE_NAME_MAP);
            ob_start();
            $new_placemark_data = $module->create_new_point();
            ob_end_clean();

            if ($subcategories) {

                $data = array(
                    'subcategories' => $subcategories,
                    'id' => $new_placemark_data['data']['id']
                );
                $map_db_model_data = components\Map::get_db_model('data');
                $map_db_model_data->update_point($data);
            }

            echo '<div class="alert alert-success" role="success">Метка <a href="/map/' . $new_placemark_data['data']['id'] . '" target="_blank">' . $title . '</a> успешно добавлена</div>';
        }
        return $this->data;
    }





    //создаем статью через админку
    public function action_add_article()
    {
        if ($this->autorize()) {
            $title = isset($_POST['title']) && $_POST['title'] ? preg_replace("/[\t\n\r]*/im", '', strip_tags($_POST['title'])) : '';
            $content = isset($_POST['content']) && $_POST['content'] ? $_POST['content'] : '';
            $seo_description = isset($_POST['seo_description']) && $_POST['seo_description'] ? $_POST['seo_description'] : '';
            $keywords = isset($_POST['keywords']) && $_POST['keywords'] ? $_POST['keywords'] : $title;
            $categories = isset($_POST['categories']) && $_POST['categories'] ? $_POST['categories'] : 0;
            $country = isset($_POST['country']) && $_POST['country'] ? $_POST['country'] : 252;

            $_POST['add_new_article_form']['title'] = $title;
            $_POST['add_new_article_form']['content'] = $content;
            $_POST['add_new_article_form']['categories'] = $categories;
            $_POST['add_new_article_form']['country_id'] = $country;
            $_POST['add_new_article_form']['keywords'] = $keywords;
            $_POST['add_new_article_form']['seo_description'] = $seo_description;



            $module = self::get_module(MY_MODULE_NAME_ARTICLE);
            ob_start();
            $new_article_data = $module->create_new_article();
            ob_end_clean();

            echo '<div class="alert alert-success" role="success">Статья <a href="/article/' . $new_article_data['data']['id'] . '" target="_blank">' . $title . '</a> успешно добавлена</div>';
        }
        return $this->data;
    }


    //обновляем статью через админку
    public function action_update_article()
    {
        if ($this->autorize()) {
            $id = isset($_POST['id']) && $_POST['id'] ? $_POST['id'] : null;
            $title = isset($_POST['title']) && $_POST['title'] ? preg_replace("/[\t\n\r]*/im", '', strip_tags($_POST['title'])) : '';
            $content = isset($_POST['content']) && $_POST['content'] ? $_POST['content'] : '';
            $keywords = isset($_POST['keywords']) && $_POST['keywords'] ? $_POST['keywords'] : $title;
            $categories = isset($_POST['categories']) && $_POST['categories'] ? $_POST['categories'] : 0;
            $country = isset($_POST['country']) && $_POST['country'] ? $_POST['country'] : 252;
            $seo_description = isset($_POST['seo_description']) && $_POST['seo_description'] ? $_POST['seo_description'] : '';

            $_POST['update_article_form']['id'] = $id;
            $_POST['update_article_form']['title'] = $title;
            $_POST['update_article_form']['content'] = $content;
            $_POST['update_article_form']['categories'] = $categories;
            $_POST['update_article_form']['country_id'] = $country;
            $_POST['update_article_form']['keywords'] = $keywords;
            $_POST['update_article_form']['seo_description'] = $seo_description;

            $module = self::get_module(MY_MODULE_NAME_ARTICLE);
            ob_start();
            $update_article_data = $module->update_article();
            ob_end_clean();

            echo '<div class="alert alert-success" role="success">Статья <a href="/article/' . $update_article_data['data']['id'] . '" target="_blank">' . $title . '</a> успешно обновлена</div>';
        }
        return $this->data;
    }


    //удаляем статью через админку
    public function action_delete_article()
    {
        if ($this->autorize()) {
            $id = isset($_POST['id']) && $_POST['id'] ? $_POST['id'] : null;
            $title = isset($_POST['title']) && $_POST['title'] ? preg_replace("/[\t\n\r]*/im", '', strip_tags($_POST['title'])) : '';

            $_POST['delete_article_form']['id'] = $id;

            $module = self::get_module(MY_MODULE_NAME_ARTICLE);
            ob_start();
            $delete_article_data = $module->delete_article();
            ob_end_clean();

            echo '<div class="alert alert-danger" role="success">Статья #' . $id . ' "' . $title . '" успешно удалена</div>';
        }
            return $this->data;
    }








    //обновляем метку через админку
    //этот метод безобидный можно запускать без пароля
    public function action_update_placemark()
    {
        if ($this->autorize()) {

            $id = isset($_POST['id']) && $_POST['id'] ? strip_tags($_POST['id']) : null;
            $title = isset($_POST['title']) && $_POST['title'] ? strip_tags($_POST['title']) : '';
            $comment = isset($_POST['comment']) && $_POST['comment'] ? $_POST['comment'] : '';
            $x = isset($_POST['x']) && $_POST['x'] ? round($_POST['x'], 4) : '';
            $y = isset($_POST['y']) && $_POST['y'] ? round($_POST['y'], 4) : '';
            $photos = isset($_POST['photos']) && $_POST['photos'] ? $_POST['photos'] : array();
            $category = isset($_POST['category']) && $_POST['category'] ? $_POST['category'] : 0;
            $subcategories = isset($_POST['subcategories']) && $_POST['subcategories'] ? $_POST['subcategories'] : '';
            $replace_my_photos = isset($_POST['replace_my_photos']) && $_POST['replace_my_photos'] ? $_POST['replace_my_photos'] : false;

            //пишем фотки в temp
            // нам нужно скачать фотку удаленно и поместить её в папку temp
            $config = self::get_config();
            $new_photos_string = '';
            foreach ($photos as $photo_url) {
                // если приложили фотографии, иначе не трогаем старые
                if ($photo_url) {

                    $mime = my_get_image_type($photo_url, true, true);
                    if ($mime == 'jpg') {
                        $mime = 'jpeg';
                    }
                    $temp_file_name = my_get_unique() . '.' . $mime;

                    $new_path = MY_TEMP_FILES_DIR . $temp_file_name;

                    // копируем себе удаленную фотку
                    if (!download_image_by_url($photo_url, $new_path)) {
                        echo "<div class=\"alert alert-danger\" role=\"alert\">не удалось скопировать $photo_url в $new_path...</div>";
                        self::concrete_error(array(MY_ERROR_COPY_IMAGE_TO_TEMP_FILES_DIR_FROM_URL, 'photo_url:' . $photo_url . ', new_path:' . $new_path));
                    }

                    //обновляем картинку в temp до jpeg



                    change_image_to_jpeg($new_path);
                    $new_photo_name = prepare_image_name_to_jpeg($temp_file_name);
                    // составляем поле photos как будто это значение формы
                    $new_photos_string.=$new_photo_name . ' ';
                }
            }


            if ($new_photos_string && $replace_my_photos) {
                //если решили обновить фотки, то удаляем все старые
                $map_db_model_photos = components\Map::get_db_model('photos');
                $photos_existed = $map_db_model_photos->get_by_data_id($id);
                foreach ($photos_existed as $photo_existed) {
                    //стандартным запросом
                    $_POST['add_new_point_form']['delete_photos'][$photo_existed['path']] = 1;
                }
            }

            $_POST['add_new_point_form']['password'] = $access_settings['password'];
            $_POST['add_new_point_form']['id'] = $id;
            $_POST['add_new_point_form']['comment'] = $comment;
            $_POST['add_new_point_form']['x'] = $x;
            $_POST['add_new_point_form']['y'] = $y;
            $_POST['add_new_point_form']['title'] = $title;
            $_POST['add_new_point_form']['category'] = $category;
            $_POST['add_new_point_form']['photos'] = $new_photos_string; //готовые фотки в temp, строкой, например "58043a272e9e6295.jpeg 58043a2dd8abb584.jpeg "

            $module = self::get_module(MY_MODULE_NAME_MAP);
            ob_start();
            $new_placemark_data = $module->update_current_point();
            ob_end_clean();

            $data = array(
                'subcategories' => $subcategories,
                'id' => $id
            );
            $map_db_model_data = components\Map::get_db_model('data');
            $map_db_model_data->update_point($data);

            echo '<div class="alert alert-success" role="success">Метка <a href="/map/' . $id . '" target="_blank">' . $title . '</a> успешно обновлена</div>';
        }
        return $this->data;
    }
}
