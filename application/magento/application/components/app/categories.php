<?php

namespace components\app;

use \vendor\component;
use \components\app as components;

final class Categories extends Component
{

    use \vendor\traits\patterns\t_singleton;


    public $categories_colors = array();


    private function __construct()
    {
        $this->categories_colors = require_once(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'categories' . MY_DS . 'colors.php');
    }

    function prepare_name_for_articles($category_code = null, $category_title)
    {
        if (get_service_name() === 'landmarks') {
            if ($category_code === 'other') {
                return my_pass_through(@self::trace('text/general_review'));
            }
        }
        return $category_title;
    }
}
