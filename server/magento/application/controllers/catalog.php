<?php

namespace controllers;

use \components\app as components;
use \models\forms;
use \components\app\image;

final class Catalog extends \vendor\controller
{


    public function action_placemark()
    {

        $id = (int) $_GET['id'];
        if (my_is_empty(@$id)) {
            self::concrete_error(array(MY_ERROR_CATALOG_WRONG_GET_VALUE, 'id:' . $id));
        }
        $country_component = components\Countries::get_instance();
        $db_model_adress = self::get_model(MY_MODEL_NAME_DB_GEOCODE_COLLECTION);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);

        $country = $_GET['country'];
        $state = isset($_GET['state']) ? $_GET['state'] : null;
        $country_code = $country_component->get_country_code_from_url();
        $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);

        if (!$db_model_adress->check_placemark($id, $country, $state)) {
            self::concrete_error(array(MY_ERROR_CATALOG_WRONG_PLACEMARK_ADDRESS_OR_ID, 'get data:' . json_encode($_GET)));
        }
        $data = $catalog_module->get_point_content_by_id($id);
        $title = $data['title'] ? $data['title'] : my_pass_through(@self::trace('map/default_title_part/value')) . ' ' . $id;

        if ($state_code) {
            $country_data = $country_component->get_state_and_country_name_by_code($country_code, $state_code);
            $this->data['title'] = $seo_module->get_title('catalog/placemark', array('country' => $country_data['country'], 'state' => $country_data['state'], 'title' => $title));
            $this->data['keywords'] = $seo_module->get_keywords('catalog/placemark');
            $this->data['description'] = $seo_module->get_description('catalog/placemark');
        } else {
            $country_name = $country_component->get_country_name_by_get_var();
            $this->data['title'] = $seo_module->get_title('catalog/placemark_no_states', array('country' => $country_name, 'title' => $title));
            $this->data['keywords'] = $seo_module->get_keywords('catalog/placemark_no_states');
            $this->data['description'] = $seo_module->get_description('catalog/placemark_no_states');
        }

        $this->data['country_code'] = $country_code;
        $this->data['has_states'] = $country_component->has_states($country_code) ? true : false;
        $this->data['data'] = $data;
        $this->data['back_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $country . '/' . $state;
        $this->data['another_placemarks'] = $catalog_module->get_another_placemarks_by_category($data['category'], $data['id']);

        return $this->data;
    }


    public function action_index()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();

        $this->data['title'] = $seo_module->get_title('catalog/index');
        $this->data['keywords'] = $seo_module->get_keywords('catalog/index');
        $this->data['description'] = $seo_module->get_description('catalog/index');

        $this->data['data'] = $catalog_module->get_countries_data();
        // ЧПУ
        $this->data['scroll_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . 'scroll';
        $this->data['current_url'] = MY_DOMEN . '/' . $security->get_controller() . '/';

        return $this->data;
    }
/*
    public function action_articles_list()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();
        $countries_component = components\Countries::get_instance();

        $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $page_number = $this->get_get_var(MY_CATALOG_PAGE_NUMBER_VAR_NAME);

       ///////тут брать из таблицы landmarks_articles все статьи и смотреть какие страны затронуты и эти страны показывать (в geolocation также сделано, но для меток и в отдельной таблице, а здесь и статьи и страны в одной таблице будут, потому что адрес не нужен, храним код страны и перевод будем брать из массива, который создадим потом) $this->data['countries'] = $catalog_module->get_countries_data();

        if ($country_code) {
            $offset = (($page_number - 1) * $config['allows']['max_pager_rows']);
            $limit = $config['allows']['max_pager_rows'];
            $this->data['articles'] = $catalog_module->get_country_articles($country_code, $offset, $limit);
            $this->data['country_code'] = $country_code;
            $this->data['country_name'] = $countries_component->get_country_name_by_code($country_code);
            foreach ($this->data['countries'] as $country) {

                if ($country['country_code'] === $country_code) {
                    $this->data['articles_count'] = $country['articles_count'];
                    break;
                }
            }

            $this->data['pages_count'] = ceil($this->data['articles_count'] / $limit);
            $this->data['current_page'] = $page_number;


            $this->data['title'] = $seo_module->get_title('catalog/articles/country', array('country' => $this->data['country_name']));
            $this->data['keywords'] = $this->data['country_name'];
            $this->data['description'] = $seo_module->get_description('catalog/articles/country', array('country' => $this->data['country_name']));
        } else {

            $this->data['title'] = $seo_module->get_title('catalog/articles/index');
            $this->data['keywords'] = $seo_module->get_keywords('catalog/articles/index');
            $this->data['description'] = $seo_module->get_description('catalog/articles/index');
        }


        return $this->data;
    }

*/





    public function action_sitemap_countries()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();
        $countries_component = components\Countries::get_instance();

        $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $page_number = $this->get_get_var(MY_CATALOG_PAGE_NUMBER_VAR_NAME);


        $this->data['countries'] = $catalog_module->get_countries_data();



        if ($country_code) {
            $offset = (($page_number - 1) * $config['allows']['max_pager_rows']);
            $limit = $config['allows']['max_pager_rows'];
            $this->data['placemarks'] = $catalog_module->get_country_placemarks($country_code, $offset, $limit);
            $this->data['country_code'] = $country_code;
            $this->data['country_name'] = $countries_component->get_country_name_by_code($country_code);
            foreach ($this->data['countries'] as $country) {

                if ($country['country_code'] === $country_code) {
                    $this->data['placemarks_count'] = $country['placemarks_count'];
                    break;
                }
            }

            $this->data['pages_count'] = ceil($this->data['placemarks_count'] / $limit);
            $this->data['current_page'] = $page_number;


            $this->data['title'] = $seo_module->get_title('catalog/sitemap_countries/country', array('country' => $this->data['country_name']));
            $this->data['keywords'] = $this->data['country_name'];
            $this->data['description'] = $seo_module->get_description('catalog/sitemap_countries/country', array('country' => $this->data['country_name']));
        } else {

            $this->data['title'] = $seo_module->get_title('catalog/sitemap_countries/index');
            $this->data['keywords'] = $seo_module->get_keywords('catalog/sitemap_countries/index');
            $this->data['description'] = $seo_module->get_description('catalog/sitemap_countries/index');
        }


        return $this->data;
    }


    public function action_sitemap_categories()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();

        $category_code = $this->get_get_var(MY_CATALOG_CATEGORY_VAR_NAME);



        $category_id = $catalog_module->get_category_id($category_code);




        $page_number = $this->get_get_var(MY_CATALOG_PAGE_NUMBER_VAR_NAME);


        $this->data['categories'] = $catalog_module->get_categories();

        //$this->data['title'] = $seo_module->get_title('catalog/index');
        //$this->data['keywords'] = $seo_module->get_keywords('catalog/index');
        //$this->data['description'] = $seo_module->get_description('catalog/index');
        if (!is_null($category_code)) {
            $offset = (($page_number - 1) * $config['allows']['max_pager_rows']);
            $limit = $config['allows']['max_pager_rows'];

            $category_data = $catalog_module->get_category($category_id);

            $this->data['placemarks'] = $catalog_module->get_category_placemarks($category_id, $offset, $limit);
            $this->data['category_id'] = $category_id;
            $this->data['category_title'] = $category_data['title'];
            $this->data['category_code'] = $category_data['code'];
            $this->data['placemarks_count'] = $catalog_module->get_placemarks_count_by_category($category_id);
            $this->data['pages_count'] = ceil($this->data['placemarks_count'] / $limit);
            $this->data['current_page'] = $page_number;


            $this->data['title'] = $seo_module->get_title('catalog/sitemap_categories/category', array('category' => $this->data['category_title']));
            $this->data['keywords'] = $this->data['category_title'];
            $this->data['description'] = $seo_module->get_description('catalog/sitemap_categories/category', array('category' => $this->data['category_title']));



        } else {

            $this->data['title'] = $seo_module->get_title('catalog/sitemap_categories/index');
            $this->data['keywords'] = $seo_module->get_keywords('catalog/sitemap_categories/index');
            $this->data['description'] = $seo_module->get_description('catalog/sitemap_categories/index');
        }

        return $this->data;
    }


    public function action_search()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $this->data['title'] = self::get_module(MY_MODULE_NAME_SEO)->get_title('catalog/search');
        $this->data['keywords'] = $seo_module->get_keywords('catalog/search');
        $this->data['description'] = $seo_module->get_description('catalog/search');
        $this->data['block_path'] = '_pages' . MY_DS . 'catalog' . MY_DS . 'search';
        return $this->data;
    }


    public function action_country()
    {

        $country_component = components\Countries::get_instance();
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();

        $country_name = $country_component->get_country_name_by_get_var();
        $country_code = $country_component->get_country_code_from_url();

        $this->data['title'] = $seo_module->get_title('catalog/country', array('country' => $country_name));
        $this->data['keywords'] = $seo_module->get_keywords('catalog/country');
        $this->data['description'] = $seo_module->get_description('catalog/country');
        $this->data['data'] = $catalog_module->process_country_data();//////////тут $security->change_view_file('catalog', 'state');
        $this->data['country'] = $country_name;
        $this->data['country_params'] = $country_component->get_country_params_by_code($country_code);
        $this->data['country_code'] = $country_code;
        // ЧПУ
        $this->data['scroll_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . 'scroll';
        $this->data['back_url'] = MY_DOMEN . '/' . $security->get_controller() . '/';
        $this->data['current_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $country_code . MY_DS;
        $this->data['has_states'] = $country_component->has_states($country_code) ? true : false;
        $this->data['placemarks_count'] = $catalog_module->get_placemarks_count_in_country($country_code);

        $this->data['photos'] = $catalog_module->get_country_photos_data($country_code); //////////////

        return $this->data;
    }


    public function action_state()
    {
        $country_component = components\Countries::get_instance();
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();

        $country_code = $country_component->get_country_code_from_url();
        $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);
        $country_data = $country_component->get_state_and_country_name_by_code($country_code, $state_code);

        $this->data['title'] = $seo_module->get_title('catalog/state', array('country' => $country_data['country'], 'state' => $country_data['state']));
        $this->data['keywords'] = $seo_module->get_keywords('catalog/state');
        $this->data['description'] = $seo_module->get_description('catalog/state');
        $this->data['data'] = $catalog_module->get_state_data();
        $this->data['country_code'] = $country_code;
        $this->data['state_code'] = $state_code;
        // ЧПУ
        $this->data['scroll_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . 'scroll';
        $this->data['back_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $country_code . '/';
        $this->data['current_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . $country_code . '/' . $state_code . '/';
        $this->data['has_states'] = $country_component->has_states($country_code) ? true : false;

        $this->data['photos'] = $catalog_module->get_state_photos_data($country_code, $state_code); //////////////

        return $this->data;
    }


    public function action_ajax_get_placemarks_list()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }
        $id_start = (int) @$_POST['id'];

        $module = self::get_module(MY_MODULE_NAME_CATALOG);

        $data = $module->get_points_list($id_start);

        $result = array('status' => MY_SUCCESS_CODE, 'data' => $data);
        echo json_encode($result);
    }


    public function action_ajax_set_search_rules()
    {
        if (!is_ajax()) {
            http_response_code(501);
            exit();
        }

        $_SESSION['search']['category'] = isset($_POST['data']['category']) ? $_POST['data']['category'] : null;
        $_SESSION['search']['country'] = isset($_POST['data']['country']) ? $_POST['data']['country'] : null;
        $_SESSION['search']['state'] = isset($_POST['data']['state']) ? $_POST['data']['state'] : null;
        $_SESSION['search']['keywords'] = isset($_POST['data']['keywords']) ? $_POST['data']['keywords'] : null;
    }
}
