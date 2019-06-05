<?php
/*
 * Class modules\app\seo\classes\Seo
 */
namespace modules\app\seo\classes;

use \components\app as components;

abstract class Seo extends \vendor\Module
{

    /*
     * Вернуть title страницы
     *
     * $param string $action - action контроллера
     * $param array $params - переменные для постороения title
     *
     * @return string
     */
    public function get_title($action, $params = array())
    {
        return my_pass_through(@self::trace('site/title/' . $action, $params));
    }

    /*
     * Вернуть keywords страницы
     *
     * $param string $action - action контроллера
     *
     * @return string
     */
    public function get_keywords($action)
    {
        $country_component = components\Countries::get_instance();
        $controller_name = get_controller_name();
        $action_name = get_action_name();
        $service_module = self::get_module(MY_MODULE_NAME_SERVICE);
        $data_db_model = components\Map::get_db_model('data');

        if ($controller_name === MY_CONTROLLER_NAME_CATALOG) {

            if ($action_name === MY_ACTION_NAME_COUNTRY) {
                return $country_component->get_country_name_by_get_var();
            } else if ($action_name === MY_ACTION_NAME_STATE) {

                $country_code = $country_component->get_country_code_from_url();
                $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);
                $country_data = $country_component->get_state_and_country_name_by_code($country_code, $state_code);

                return $country_data['country'] . ',' . $country_data['state'];
            } else if ($action_name === MY_ACTION_NAME_PLACEMARK) {

                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $placemark = $data_db_model->get_by_condition($condition, '', '', 'title, seo_keywords', 1, false);
                return $placemark['seo_keywords'] ? $placemark['seo_keywords'] : clear_special_symbols($placemark['title']);
            }
        }

        return my_pass_through(@self::trace('site/keywords/' . $action, $params));
    }

    /*
     * Вернуть description страницы
     *
     * $param string $action - action контроллера
     * $param array $params - переменные для постороения description
     *
     * @return string
     */
    public function get_description($action=null, $params=null)
    {
        $country_component = components\Countries::get_instance();
        $controller_name = get_controller_name();
        $action_name = get_action_name();
        $service_module = self::get_module(MY_MODULE_NAME_SERVICE);
        $data_db_model = components\Map::get_db_model('data');
        $config = self::get_config();

        if ($controller_name === MY_CONTROLLER_NAME_CATALOG) {

            if ($action_name === MY_ACTION_NAME_COUNTRY) {
                return '';
            } else if ($action_name === MY_ACTION_NAME_STATE) {
                return '';
            } else if ($action_name === MY_ACTION_NAME_PLACEMARK) {

                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $placemark = $data_db_model->get_by_condition($condition, '', '', 'comment_plain, seo_description', 1, false);
                return $placemark['seo_description'] ? $placemark['seo_description'] : get_cutted_text($placemark['comment_plain'], $config['allows']['max_cropped_seo_description_length'], false);
            }
        } elseif ($controller_name === MY_CONTROLLER_NAME_ARTICLE) {

            $articles_db_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);

            if ($action_name === MY_ACTION_NAME_VIEW) {
                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $article = $articles_db_model->get_by_condition($condition, '', '', 'content_plain, seo_description', 1, false);
                return $article['seo_description'] ? $article['seo_description'] : get_cutted_text($article['content_plain'], $config['allows']['max_cropped_seo_description_length'], false);
            }

        }

        return my_pass_through(@self::trace('site/description/' . $action, $params));
    }
}
