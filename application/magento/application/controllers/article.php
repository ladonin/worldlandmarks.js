<?php

namespace controllers;

use \components\app as components;
use \models\forms;
use \components\app\image;

final class Article extends \vendor\controller
{

    public function action_view()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $article_module = self::get_module(MY_MODULE_NAME_ARTICLE);

        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();

        /////////$countries_component = components\Countries::get_instance();

        $id = $this->get_get_var(MY_ID_VAR_NAME);

        $data = $article_module->get_article_data($id);

            $this->data['data'] = $data;
            $this->data['title'] = $data['title'];
            $this->data['keywords'] = $data['keywords'];
            $this->data['description'] = $seo_module->get_description();

        return $this->data;
    }







    public function action_countries()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $article_module = self::get_module(MY_MODULE_NAME_ARTICLE);
        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();
        $countries_component = components\Countries::get_instance();

        $country_code = $this->get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        $category = $this->get_get_var(MY_CATALOG_CATEGORY_VAR_NAME);

        $page_number = $this->get_get_var(MY_CATALOG_PAGE_NUMBER_VAR_NAME);

        $page_number = $page_number ? $page_number : 1;

        $this->data['countries'] = $article_module->get_countries_data();
        $offset = (($page_number - 1) * $config['allows']['max_pager_rows']);
        $limit = $config['allows']['max_pager_rows'];


        if ($country_code) {

            $this->data['articles'] = $article_module->get_country_articles($country_code, $offset, $limit);

            $this->data['country_code'] = $country_code;
            $this->data['country_name'] = $countries_component->get_country_name_by_code($country_code);
            foreach ($this->data['countries'] as $country) {

                if ($country['country_code'] === $country_code) {
                    $this->data['articles_count'] = $country['articles_count'];
                    break;
                }
            }




            $this->data['title'] = $seo_module->get_title('articles/country', array('country' => $this->data['country_name']));
            $this->data['keywords'] = $this->data['country_name'];
            $this->data['description'] = $seo_module->get_description('articles/country', array('country' => $this->data['country_name']));
        } else {

            $this->data['articles'] = $article_module->get_country_articles(null, $offset, $limit);

            $this->data['title'] = $seo_module->get_title('articles/index');
            $this->data['keywords'] = $seo_module->get_keywords('articles/index');
            $this->data['description'] = $seo_module->get_description('articles/index');



$this->data['articles_count'] = 0;

            foreach ($this->data['countries'] as $country) {

                    $this->data['articles_count'] += $country['articles_count'];

            }






        }
            $this->data['pages_count'] = ceil($this->data['articles_count'] / $limit);
            $this->data['current_page'] = $page_number;
        return $this->data;
    }







    public function action_categories()
    {
        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $article_module = self::get_module(MY_MODULE_NAME_ARTICLE);
        $security = \modules\base\Security\Security::get_instance();
        $config = self::get_config();

        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);

        $category_code = $this->get_get_var(MY_CATALOG_CATEGORY_VAR_NAME);
        $category_id = $catalog_module->get_category_id($category_code);
        $category_data = $catalog_module->get_category($category_id);

        $page_number = $this->get_get_var(MY_CATALOG_PAGE_NUMBER_VAR_NAME);
        $page_number = $page_number ? $page_number : 1;
        $this->data['categories'] = $article_module->get_categories_data();
        $offset = (($page_number - 1) * $config['allows']['max_pager_rows']);
        $limit = $config['allows']['max_pager_rows'];
$category_data['title'] = components\Categories::get_instance()->prepare_name_for_articles($category_data['code'], $category_data['title']);
        if ($category_code) {




            $this->data['articles'] = $article_module->get_category_articles($category_id, $offset, $limit);

            $this->data['category_id'] = $category_id;
            $this->data['category_title'] = $category_data['title'];
            $this->data['category_code'] = $category_data['code'];







            $this->data['title'] = $seo_module->get_title('articles/category', array('category' => $this->data['category_title']));
            $this->data['keywords'] = $this->data['category_title'];
            $this->data['description'] = $seo_module->get_description('articles/category', array('category' => $this->data['category_title']));
        } else {
            $this->data['articles'] = $article_module->get_category_articles(null, $offset, $limit);
            $this->data['title'] = $seo_module->get_title('articles/index');
            $this->data['keywords'] = $seo_module->get_keywords('articles/index');
            $this->data['description'] = $seo_module->get_description('articles/index');
        }
$this->data['articles_count'] = $article_module->get_articles_count_by_category($category_id);
            $this->data['pages_count'] = ceil($this->data['articles_count'] / $limit);
            $this->data['current_page'] = $page_number;
        return $this->data;
    }





}
