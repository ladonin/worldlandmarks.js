<?php

namespace components\app;

use \vendor\component;

final class Map extends Component
{

    static private $_main_module_name = 'map';
    private static $_name = null;


    // Get map name by get parameter
    static public function get_name()
    {
        if (self::$_name) {
            return self::$_name;
        }

        $config = self::get_config();
        $get_vars = self::get_module(MY_MODULE_NAME_SECURITY)->get_get_vars();
        $map_name = my_is_not_empty(@$get_vars[MY_SERVICE_VAR_NAME]) ? $get_vars[MY_SERVICE_VAR_NAME] : null;

        if (!$map_name) {
            self::concrete_error(array(MY_ERROR_MAP_WRONG_GET_VALUE, 'map_name:' . $map_name), MY_LOG_APPLICATION_TYPE, true);
        } else if (!is_dir(MY_SERVICES_DIR . $map_name)) {
            //если нет такой папки в сервисах
            self::concrete_error(array(MY_ERROR_MAP_WRONG_GET_VALUE, 'unknown value - map_name:' . $map_name), MY_LOG_APPLICATION_TYPE, true);
        }

        self::$_name = $map_name;

        return self::$_name;
    }


    static public function get_db_model($type)
    {

        $model_path = '\\models\\dbase\\' . get_db_type() . '\\map_' . $type;

        if (my_is_method_and_class_enable($model_path, 'model')) {
            $map_model = $model_path::model();
            return $map_model;
        }
        //если нет такой модели
        self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'get_db_model() argument value:' . $type));
    }


    static public function module()
    {
        $config = self::get_config();
        $get_vars = self::get_module(MY_MODULE_NAME_SECURITY)->get_get_vars();
        $map_name = my_is_not_empty(@$get_vars[MY_SERVICE_VAR_NAME]) ? $get_vars[MY_SERVICE_VAR_NAME] : null;

        if (!$map_name) {
            self::concrete_error(array(MY_ERROR_MAP_WRONG_GET_VALUE, 'map_name:' . $map_name));
        }

        foreach ($config['app_modules'] as $module_name => $params) {
            if (($params['query_name'] === $map_name) && ($params['main_module_name'] === self::$_main_module_name)) {
                return self::get_module($module_name);
            }
        }
        self::concrete_error(array(MY_ERROR_UNDEFINED_MODULE_NAME, 'unknown module name:' . $map_name));
    }
}
