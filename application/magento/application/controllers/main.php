<?php
/*
 * Class controllers\Main
 *
 * Контроллер главной страницы
 */
namespace controllers;

final class Main extends \vendor\controller
{

    /*
     * Action index
     *
     * @return array - данные для view
     */
    public function action_index()
    {
        $this->data['title'] = self::get_module(MY_MODULE_NAME_SEO)->get_title('main/index');
        $this->data['keywords'] = self::get_module(MY_MODULE_NAME_SEO)->get_keywords('main/index');
        $this->data['description'] = self::get_module(MY_MODULE_NAME_SEO)->get_description('main/index');
        $this->data['block_path'] = '_pages' . MY_DS . 'main';
        $this->data['placemarks_count'] = self::get_module(MY_MODULE_NAME_CATALOG)->get_placemarks_count();

        return $this->data;
    }
}
