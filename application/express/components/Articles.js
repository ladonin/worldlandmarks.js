/*
 * File application/express/components/Articles.js
 * const Articles = require('application/express/components/Articles');
 *
 * Articles component - compute articles data
 */


const Component = require('application/express/core/abstract/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const ArticlesModel = require('application/express/models/dbase/mysql/Articles');


class Articles extends Component {

    constructor(){
        super();
    }
////ATTENTION - обратите внимание
// getLastArticles -> ArticlesModel.getLastArticles

}

Articles.instanceId = BaseFunctions.unique_id();

module.exports = Articles;


/*




<?php

namespace modules\app\article\classes;

use \components\app as components;

abstract class Article extends \core\Module
{


    public function create_new_article()
    {

        $form_data = $_POST['add_new_article_form'];
        $form_data['categories'] = str_replace(' ', '', $form_data['categories']);
        if (isset($form_data['title']) && $form_data['title'] && isset($form_data['content']) && $form_data['content'] && isset($form_data['country_id'])) {

            $form_data['country_id'] = (int) $form_data['country_id'];
            $data = array(
                'title' => $form_data['title'],
                'content' => $form_data['content'],
                'content_plain' => $form_data['content'],
                'country_id' => $form_data['country_id'],
                'categories' => $form_data['categories'],
                'keywords' => $form_data['keywords'],
                'seo_description' => $form_data['seo_description']
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        $config = self::get_config();
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);

        $id_data = $article_model->add_article($data);


        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_article/created')),
            'data' => array(
                'id' => $id_data
            )
        );
        return $result;
    }


    public function get_country_articles($country_code = null, $offset = null, $limit = null)
    {
        $articles_db_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $countries_component = components\Countries::get_instance();

        $config = self::get_config();


        if ($country_code) {
            $country_id = $countries_component->get_country_data_by_code($country_code);
            $country_id = $country_id['id'];
            $condition = "country_id=" . $country_id;
        } else {
            $condition = "";
        }
        $order = '';
        $select = '*';
        if (!is_null($offset) && !is_null($limit)) {
            $limit = (int) $offset . ', ' . (int) $limit;
        } else {
            $limit = false;
        }

        $need_result = false;

        return $articles_db_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);
    }


    public function get_category_articles($category_id = null, $offset = null, $limit = null)
    {

        $articles_db_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);

        $config = self::get_config();

        if (!is_null($category_id)) {
            $category_id = (int) $category_id;
            $condition = "categories REGEXP '[[:<:]]" . $category_id . "[[:>:]]'";
        } else {
            $condition = "";
        }

        $order = '';
        $select = '*';
        if (!is_null($offset) && !is_null($limit)) {
            $limit = (int) $offset . ', ' . (int) $limit;
        } else {
            $limit = false;
        }
        $need_result = false;

        return $articles_db_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);
    }


    public function update_article()
    {

        $form_data = $_POST['update_article_form'];
        $form_data['categories'] = str_replace(' ', '', $form_data['categories']);
        $form_data['id'] = isset($form_data['id']) ? (int) $form_data['id'] : null;
        if ($form_data['id'] && isset($form_data['title']) && $form_data['title'] && isset($form_data['content']) && $form_data['content'] && isset($form_data['country_id'])) {

            $form_data['country_id'] = (int) $form_data['country_id'];
            $data = array(
                'id' => $form_data['id'],
                'title' => $form_data['title'],
                'content' => $form_data['content'],
                'content_plain' => $form_data['content'],
                'country_id' => $form_data['country_id'],
                'categories' => $form_data['categories'],
                'keywords' => $form_data['keywords'],
                'seo_description' => $form_data['seo_description']
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        self::get_model(MY_MODEL_NAME_DB_ARTICLES)->update_article($data);

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/article/updated')),
            'data' => array(
                'id' => $form_data['id']
            )
        );
        return $result;
    }


    public function delete_article()
    {
        $form_data = $_POST['delete_article_form'];
        $form_data['id'] = isset($form_data['id']) ? (int) $form_data['id'] : null;
        if ($form_data['id']) {
            $data = array(
                'id' => $form_data['id'],
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        self::get_model(MY_MODEL_NAME_DB_ARTICLES)->delete($data['id']);

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/article/deleted')),
            'data' => array()
        );
        return $result;
    }


    public function get_article_data($id = null)
    {
        if (!(int)$id) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id:' . $id));
        }
        $id = (int)$id;

        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $condition = "id = $id";
        $order = '';
        $select = '*';
        $group = '';
        $limit = 1;
        $need_result = false;
        $result = $article_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);

        $country_component = components\Countries::get_instance();
        $country_data = $country_component->get_country_data_by_id($result['country_id']);
        $result['country_code'] = $country_data['local_code'];
        $result['country_name'] = $country_component->get_country_name_by_code($result['country_code']);

        return $result;
    }



    public function get_articles_data($ids = array(), $ignore = false, $random = false, $limit = 10)
    {

        $ids = my_prepareToIntArray($ids);
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $ids = implode(',', $ids);
        $condition = $ids ? ("id " . ($ignore === true ? "NOT" : "") . " IN ($ids)") : '';
         $order = $random === true ? 'RAND()' : '';
        $select = '*';
        $group = '';
        $need_result = false;
        $articles = $article_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);
        $country_component = components\Countries::get_instance();

        foreach($articles as &$article) {

            $country_data = $country_component->get_country_data_by_id($article['country_id']);
            $article['country_code'] = $country_data['local_code'];
            $article['country_name'] = $country_component->get_country_name_by_code($article['country_code']);
        }
        return $articles;
    }







    public function get_last_country_articles($country_code = null)
    {

        $limit = self::get_module(MY_MODULE_NAME_SERVICE)->get_max_last_country_articles();


        $country_component = components\Countries::get_instance();

        if (!$country_code) {
            $country_code = $country_component->get_country_code_from_url();
            $country_id = $country_component->get_country_data_by_code($country_code);
            $country_id = $country_id['id'];
        }

        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $condition = 'country_id=' . $country_id;
        $order = 'id DESC';
        $select = '*';
        $group = '';
        $need_result = false;
        $result = $article_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);
        return $result;
    }




    public function get_countries_data()
    {
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $language = components\Language::get_instance()->getLanguage();

        $sql = "SELECT
                    a.country_id as id,
                    c.local_code as country_code,
                    cn.name as name,
                    COUNT(*) as articles_count
                FROM " . $article_model->get_table_name() . " a
                    LEFT JOIN " . self::get_model(MY_MODEL_NAME_DB_COUNTRY)->get_table_name() . " c on c.id = a.country_id
                    LEFT JOIN " . self::get_model(MY_MODEL_NAME_DB_COUNTRY_NAME)->get_table_name() . " cn on c.id = cn.country_id AND cn.language='" . $language . "'
                GROUP by a.country_id
                ORDER by cn.name";
        return \core\DBase_Mysql::model()->get_connect()->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
    }


    public function get_articles_count_by_category($category_id = null)
    {
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);


        if (!is_null($category_id)) {
            $category_id = (int) $category_id;
            $condition = "categories REGEXP '[[:<:]]" . $category_id . "[[:>:]]'";
        } else {
            $condition = '';
        }


        $order = '';
        $select = 'COUNT(*) as count';
        $group = '';
        $limit = 1;
        $need_result = false;
        $result = $article_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);

        return $result['count'];
    }


    public function get_categories_data()
    {
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $language = components\Language::get_instance()->getLanguage();
        $connect = \core\DBase_Mysql::model()->get_connect();
        $sql = "SELECT categories FROM " . $article_model->get_table_name();
        $categories_list = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

        $categories_array = array();
        foreach ($categories_list as $categories) {
            $categories = explode(',', $categories['categories']);
            foreach ($categories as $category) {
                $categories_array[$category] = true;
            }
        }
        $result = array();
        foreach ($categories_array as $category_id => $value) {
            $result[] = $catalog_module->get_category($category_id);
        }

        $categories_component = components\Categories::get_instance();
        foreach($result as &$value){
            $value['title'] = $categories_component->prepare_name_for_articles($value['code'], $value['title']);
        }
        return $result;
    }

    public function get_random_articles(){

        $max_random_articles = self::get_module(MY_MODULE_NAME_SERVICE)->get_max_random_articles();
        // берем данные из сессии, которые не нужно выбирать
        $ignore_ids = @$_SESSION['article']['random_articles']['ids'];

        $ignore_ids = my_array_is_not_empty($ignore_ids) ? $ignore_ids : array();


        //делаем запрос на выборку статей с учетом данных из сесии
        $articles = $this->get_articles_data($ignore_ids, true, true, $max_random_articles);

        //если получили мало статей
        if (count($articles) < $max_random_articles){
            // то чистим сессию
            $_SESSION['article']['random_articles']['ids'] = array();

            // и делаем выборку снова
            $articles = $this->get_articles_data(array(), true, true, $max_random_articles);
        }

        // заносим полученные данные в сессию
        foreach($articles as $article) {
            $_SESSION['article']['random_articles']['ids'][] = $article['id'];
        }

        //возвращаем результат
        return $articles;
    }

    public function get_breadcrumbs_data()
    {

        $id = $this->get_get_var(MY_ID_VAR_NAME);


        if ($id) {


            $data = $this->get_article_data($id);
            return array(
                0 => array(
                    'url' => MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE,
                    'name' => self::trace('breadcrumbs/' . get_controller_name() . '/text')
                ),
                1 => array(
                    'url' => MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE . '/' . MY_ACTION_NAME_ARTICLES_COUNTRIES_NAME . '/' . $data['country_code'] . '/1',
                    'name' => $data['country_name']
                )
            );
        } else {
            return array(
                0 => array(
                    'url' => MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE,
                    'name' => self::trace('breadcrumbs/' . get_controller_name() . '/text')
                )
            );
        }
    }
}

*/