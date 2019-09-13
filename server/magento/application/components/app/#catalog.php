<?php

namespace components\app;

use \vendor\component;

final class Catalog extends Component
{
    static private $_main_module_name = 'catalog';

    static public function module()
    {
        $config = self::get_config();
        $get_vars = self::get_module(MY_MODULE_NAME_SECURITY)->get_get_vars();
        $map_name = my_is_not_empty(@$get_vars[MY_SERVICE_VAR_NAME]) ? $get_vars[MY_SERVICE_VAR_NAME] : null;

        if (!$map_name) {
            self::concrete_error(array(MY_ERROR_MAP_WRONG_GET_VALUE, 'map_name:' . $map_name));
        }

        foreach ($config['app_modules'] as $module_name => $params) {
            if (($params['query_name'] === $map_name) &&($params['main_module_name'] === self::$_main_module_name)){

                return self::get_module($module_name);
            }
        }
        self::concrete_error(array(MY_ERROR_UNDEFINED_MODULE_NAME, 'unknown module name:' . $map_name));
    }






}