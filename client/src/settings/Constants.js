/*
 * File src/settings/Constants.js
 * import Constants from 'src/settings/Constants';
 */



import CommonConsts from 'src/../../server/common/settings/Constants';

let _Consts = {
    FORM_TEXT_TAG_CODE_A: 'a',
    FORM_TEXT_TAG_CODE_B: 'b',
    FORM_TEXT_TAG_CODE_STRONG: 'strong',
    FORM_TEXT_TAG_CODE_IMAGE_ADVANCED: 'image_advanced',
    FORM_TEXT_TAG_CODE_P: 'p',
    STYLE_DATA: 'style_data',
    UPDATE_STYLE_DATA: 'UPDATE_STYLE_DATA',
    CLEAR_STYLE_DATA:'CLEAR_STYLE_DATA'




}
export default {...CommonConsts, ..._Consts}





/*dfgdfg


 define('MY_SERVICES_NAME', 'services');

 define('MY_DOCROOT', realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . '..' . MY_DS);
 define('MY_PROTOCOL', 'http://');
 if (isset($_SERVER['SERVER_NAME'])) {
 define('MY_DOMEN_NAME', $_SERVER['SERVER_NAME']);
 define('MY_DOMEN', MY_PROTOCOL . MY_DOMEN_NAME);
 define('MY_FILES_URL', MY_DOMEN . '/files/');
 define('MY_FILES_MAP_URL', MY_DOMEN . '/files/map/');
 }

 define('MY_APPLICATION_DIR', MY_DOCROOT . 'application' . MY_DS);
 define('MY_VIEWS_DIR', MY_APPLICATION_DIR . 'views' . MY_DS);
 define('MY_JS_DIR', MY_DOCROOT . 'javascript' . MY_DS);
 define('MY_LOG_MYSQL_PATH', MY_DOCROOT . 'log' . MY_DS . 'mysql.log');
 define('MY_LOG_APPLICATION_PATH', MY_DOCROOT . 'log' . MY_DS . 'application.log');
 define('MY_LOG_APPLICATION_TYPE', 'app');
 define('MY_LOG_MYSQL_TYPE', 'mysql');
 define('MY_SERVICE_VAR_NAME', 'type');
 define('MY_CRYPT_HASH_ALGORYTM_CODE', '$6$');
 define('MY_FILES_DIR_NAME', 'files');
 define('MY_FILES_DIR', MY_DOCROOT . MY_FILES_DIR_NAME . MY_DS);
 define('MY_TEMP_FILES_DIR', MY_FILES_DIR . 'temp' . MY_DS);
 define('MY_FUNCTIONS_DIR', MY_APPLICATION_DIR . 'functions' . MY_DS);
 define('MY_LOG_DIR', MY_APPLICATION_DIR . 'log' . MY_DS);

 define('MY_SERVICES_DIR', MY_APPLICATION_DIR . MY_SERVICES_NAME . MY_DS);
 define('MY_UNDEFINED_VALUE', 'undefined');


 define('MY_FORM_TEXT_TAG_CODE_A', 'a');
 define('MY_FORM_TEXT_TAG_CODE_B', 'b');
 define('MY_FORM_TEXT_TAG_CODE_STRONG', 'strong');
 define('MY_FORM_TEXT_TAG_CODE_IMAGE_ADVANCED', 'image_advanced');
 define('MY_FORM_TEXT_TAG_CODE_P', 'p');
 define('MY_SERVICE_IMGS_URL_CATEGORIES', '/imgs/categories/');


 define('MY_MODULE_NAME_SERVICE', 'service');
 define('MY_FTP_DEFAULT_SERVER_NAME', 'default_server');







 require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'Consts' . MY_DS . 'countries.php');

 $categories_colors = require_once(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'categories' . MY_DS . 'colors.php');
 */