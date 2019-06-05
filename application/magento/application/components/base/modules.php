<?php
/*
 * Класс Modules
 *
 * Отвечает за все имеющиеся модули в проекте
 */

namespace components\base;

use \vendor\component;

final class Modules extends Component
{
    /*
     * Возвращает экземпляр модуля по его имени
     *
     * @param string $name - имя модуля
     *
     * @return \vendor\Module - экземпляр модуля
     */


    public static function get($name)
    {
        if ($name === MY_MODULE_NAME_SECURITY) {
            return \modules\base\Security\Security::get_instance();
        } else if ($name === MY_MODULE_NAME_MAP) {
            return \modules\app\map\map::get_instance();
        }
        /* else if ($name === MY_MODULE_NAME_MAP_LANDMARKS) {
          return \modules\app\map\modules\landmarks\landmarks::get_instance();
          } */ else if ($name === MY_MODULE_NAME_MAILER) {
            return \modules\base\mailer\mailer::get_instance();
        } else if ($name === MY_MODULE_NAME_SEO) {
            return \modules\app\seo\seo::get_instance();
        } else if ($name === MY_MODULE_NAME_CATALOG) {
            return \modules\app\catalog\catalog::get_instance();
        } else if ($name === MY_MODULE_NAME_ARTICLE) {
            return \modules\app\article\article::get_instance();
        }
        /* else if ($name === MY_MODULE_NAME_CATALOG_LANDMARKS) {
          return \modules\app\catalog\modules\landmarks\landmarks::get_instance();
          }
         */ else if ($name === MY_MODULE_NAME_ACCOUNT) {
            return \modules\app\account\account::get_instance();
        } else if ($name === MY_MODULE_NAME_ANALYZE) {
            return \modules\app\analyze\analyze::get_instance();
        } else if ($name === MY_MODULE_NAME_ARCHIVE) {
            return \modules\base\archive\archive::get_instance();
        } else if ($name === MY_MODULE_NAME_SERVICE) {
            return \modules\app\service\service::get_instance();
        } else {
            self::concrete_error(array(MY_ERROR_UNDEFINED_MODULE_NAME, 'name:' . $name));
        }
    }
}
