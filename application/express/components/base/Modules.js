/*
 * File application/express/components/base/Modules
 *
 * Base component for working with modules
 */
const Consts = require('application/express/settings/Constants');




modules.export={
 get:(name)=>{


if (name === Consts.MODULE_NAME_SECURITY) {
            return require('application/express/modules/security/Security');
        }



















        else if ($name === Consts.MODULE_NAME_MAP) {
            return \modules\app\map\map::get_instance();
        }
        /* else if ($name === Consts.MODULE_NAME_MAP_LANDMARKS) {
          return \modules\app\map\modules\landmarks\landmarks::get_instance();
          } */ else if ($name === Consts.MODULE_NAME_MAILER) {
            return \modules\base\mailer\mailer::get_instance();
        } else if ($name === Consts.MODULE_NAME_SEO) {
            return \modules\app\seo\seo::get_instance();
        } else if ($name === Consts.MODULE_NAME_CATALOG) {
            return \modules\app\catalog\catalog::get_instance();
        } else if ($name === Consts.MODULE_NAME_ARTICLE) {
            return \modules\app\article\article::get_instance();
        }
        /* else if ($name === MODULE_NAME_CATALOG_LANDMARKS) {
          return \modules\app\catalog\modules\landmarks\landmarks::get_instance();
          }
         */ else if ($name === Consts.MODULE_NAME_ACCOUNT) {
            return \modules\app\account\account::get_instance();
        } else if ($name === Consts.MODULE_NAME_ANALYZE) {
            return \modules\app\analyze\analyze::get_instance();
        } else if ($name === Consts.MODULE_NAME_ARCHIVE) {
            return \modules\base\archive\archive::get_instance();
        } else if ($name === Consts.MODULE_NAME_SERVICE) {
            return \modules\app\service\service::get_instance();
        } else {
            self::concrete_error(array(Consts.ERROR_UNDEFINED_MODULE_NAME, 'name:' . $name));
        }




    }

}


