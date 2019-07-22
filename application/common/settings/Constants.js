/*
 * File application/common/settings/Constants.js
 *
 * Constants
 */


const DOMAIN = 'http://world-landmarks.ru';


module.exports = {

    DOMAIN: DOMAIN,
    SITE_NAME: 'world-landmarks.ru',

    PROCESS_DEV: 'development',
    PROCESS_PROD: 'production',
    LANGUAGE_RU: 'ru',
    LANGUAGE_EN: 'en',

    LANGUAGE_COMMON: 'COMMON',

    DEVICE_NAME_DESCTOP: 'desctop',
    DEVICE_NAME_MOBILE: 'mobile',
    DEVICE_NAME_COMMON: 'common',

    AJAX_SUCCESS_CODE: 'success',
    AJAX_UNDEFINED: 'undefined',

    NONE_CATEGORY_CODE: 'none',

    FTP_DEFAULT_SERVER_NAME: 'default_server',

    SERVICE_IMGS_URL_CATEGORIES: '/imgs/categories/',

    CONTROLLER_NAME_MAP: 'map',
    CONTROLLER_NAME_MAIN: 'main',
    CONTROLLER_NAME_CATALOG: 'catalog',
    CONTROLLER_NAME_ARTICLE: 'article',
    CONTROLLER_NAME_ADMIN_ACCESS: 'admin_access',
    CONTROLLER_NAME_ERRORS: 'errors',


    ACTION_NAME_INDEX: 'index',

    MY_IMG_URL: DOMAIN + '/img/',




    REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT:'UPDATE_STATIC_TEXT',
    REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT:'UPDATE_DYNAMIC_TEXT',

    HASH_SALT:'f348=890(ubhr5od-t',




    /*
     LANGUAGE_RU: 'ru',
     LANGUAGE_EN: 'en',

     LANGUAGE_COMMON: 'COMMON',

     DEVICE_NAME_DESCTOP: 'desctop',
     DEVICE_NAME_MOBILE: 'mobile',
     DEVICE_NAME_COMMON: 'common',

     AJAX_SUCCESS_CODE: 'success',
     AJAX_UNDEFINED: 'undefined',

     NONE_CATEGORY_CODE: 'none',

     FTP_DEFAULT_SERVER_NAME: 'default_server',

     FORM_TEXT_TAG_CODE_A: 'a',
     FORM_TEXT_TAG_CODE_B: 'b',
     FORM_TEXT_TAG_CODE_STRONG: 'strong',
     FORM_TEXT_TAG_CODE_IMAGE_ADVANCED: 'image_advanced',
     FORM_TEXT_TAG_CODE_P: 'p',

     SERVICE_IMGS_URL_CATEGORIES: '/imgs/categories/',




     CONTROLLER_NAME_MAP:'map',
     CONTROLLER_NAME_MAIN:'main',
     CONTROLLER_NAME_CATALOG:'catalog',
     CONTROLLER_NAME_ARTICLE:'article',

     ACTION_NAME_INDEX:'index',



     */


}







/*dfgdfg

 define('MY_ERROR_WRONG_ADRESS', 1);
 define('MY_ERROR_DB_NO_CONNECT', 2);
 define('MY_ERROR_USER_NOT_VERIFICATED', 3);
 define('MY_ERROR_MODEL_FILTER', 4);
 define('MY_ERROR_REG_LOGIN_ITERATION', 5);
 define('MY_ERROR_FORM_NOT_PASSED', 6);
 define('MY_ERROR_BLOCK_NOT_FOUND', 7);
 define('MY_ERROR_CONFIG_PATH_NOT_FOUND', 8);
 define('MY_ERROR_DB_UNDEFINED_FIELD', 9);
 define('MY_ERROR_JS_NOT_FOUND', 10);
 define('MY_ERROR_IMAGE_NOT_PASSED_TO_OBJECT', 11);
 define('MY_ERROR_WRONG_MODULE_NAME', 12);
 define('MY_ERROR_LOADING_FILE', 13);
 define('MY_ERROR_LOADING_IMAGE_WRONG_TYPE', 14);
 define('MY_ERROR_FUNCTION_ARGUMENTS', 15);
 define('MY_ERROR_UNKNOWN_VALIDATION_RULE', 16);
 define('MY_ERROR_MYSQL', 17);
 define('MY_ERROR_CLASS_NOT_FOUNT', 18);
 define('MY_ERROR_METHOD_NOT_FOUNT', 19);
 define('MY_ERROR_MAP_WRONG_GET_VALUE', 20);
 define('MY_ERROR_VALUE_NOT_PASSED_THROUGH', 21);
 define('MY_ERROR_MOVE_IMAGE_TO_TEMP_FILES_DIR_FROM_TMP', 22);
 define('MY_ERROR_LANGUAGE_WORD_NOT_FOUND', 23);
 define('MY_ERROR_LANGUAGE_MODEL_NOT_FOUND', 24);
 define('MY_ERROR_FORM_WRONG_DATA', 25);
 define('MY_ERROR_COOKIE_NAME_UNDEFINED', 26);
 define('MY_ERROR_FORM_NEW_POINT_A_LOT_OF_PHOTOS', 27);
 define('MY_ERROR_GET_WRONG_MAP_NAME', 28);
 define('MY_ERROR_AJAX_VIEW_DATA_VARS_NOT_SET', 29);
 define('MY_ERROR_FORM_UPDATE_POINT_A_LOT_OF_PHOTOS', 30);
 define('MY_ERROR_WRONG_DB_WHERE_CONDITION', 31);
 define('MY_ERROR_FORM_UPDATE_POINT_WITH_NO_PHOTOS', 32);
 define('MY_ERROR_UNDEFINED_MODULE_NAME', 33);
 define('MY_ERROR_UNDEFINED_MODEL_NAME', 34);
 define('MY_ERROR_MAILER_NOT_SENT', 35);
 define('MY_ERROR_IMAGE_CREATE', 36);
 define('MY_ERROR_LANGUAGE_NOT_FOUND', 37);
 define('MY_ERROR_LANGUAGE_CODE_NOT_FOUND', 38);
 define('MY_ERROR_GEOCODE_LOCATION_NOT_FOUND', 39);
 define('MY_ERROR_IMAGE_GET_TYPE', 40);
 define('MY_ERROR_VARIABLE_EMPTY', 41);
 define('MY_ERROR_CATALOG_WRONG_GET_VALUE', 41);
 define('MY_ERROR_CATALOG_WRONG_PLACEMARK_ADDRESS_OR_ID', 42);
 define('MY_ERROR_CATEGORY_NOT_FOUND', 43);
 define('MY_ERROR_UNRESOLVED_ACCESS', 44);
 define('MY_ERROR_SPAM_TRANSFERED_EMAIL_NOT_FULL_DATA', 45);
 define('MY_ERROR_SERVICE_CONFIG_ABSENT', 46);
 define('MY_ERROR_COPY_IMAGE_TO_TEMP_FILES_DIR_FROM_URL', 47);
 define('MY_ERROR_WRONG_COORDS', 48);
 define('MY_ERROR_FTP_CONNECTION', 49);
 define('MY_ERROR_LOCAL_FILE_NOT_FOUND', 50);
 define('MY_ERROR_FTP_LOAD_FILE', 51);
 define('MY_ERROR_FTP_SERVER_NAME_NOT_DEFINED', 52);
 define('MY_ERROR_FTP_CONNECTION_FOR_SERVER_NAME_NOT_SET', 53);
 define('MY_ERROR_FTP_CREATE_DIR', 54);
 define('MY_ERROR_COUNTRY_NAME_WAS_NOT_FOUND', 55);
 define('MY_ERROR_COUNTRY_STATE_NAME_WAS_NOT_FOUND', 56);
 define('MY_ERROR_COUNTRY_ID_WAS_NOT_FOUND', 57);
 define('MY_ERROR_COUNTRY_STATE_ID_WAS_NOT_FOUND', 58);
 define('MY_ERROR_COUNTRY_DATA_WAS_NOT_FOUND', 59);

 define('MY_NO_PHOTO_NAME', 'no_photo.jpg');


 define('MY_FTP_NAME', 'ftp');
 define('MY_LOCALHOST_NAME', 'localhost');

 define('MY_MODULE_NAME_SECURITY', 'security');
 define('MY_MODULE_NAME_MAP', 'map');
 define('MY_MODULE_NAME_MAILER', 'mailer');
 define('MY_MODULE_NAME_SEO', 'seo');
 define('MY_MODULE_NAME_CATALOG', 'catalog');
 define('MY_MODULE_NAME_ARTICLE', 'article');
 define('MY_MODULE_NAME_SEARCH', 'search');
 define('MY_MODULE_NAME_ACCOUNT', 'account');
 define('MY_MODULE_NAME_ANALYZE', 'analyze');
 define('MY_MODULE_NAME_ARCHIVE', 'archive');
 define('MY_SITEMAP_COUNTRIES_NAME', 'sitemap_countries');
 define('MY_ARTICLES_LIST_NAME', 'articles_list');
 define('MY_ARTICLES_NAME', 'articles');
 define('MY_SITEMAP_CATEGORIES_NAME', 'sitemap_categories');
 define('MY_MODULE_NAME_SERVICE', 'service');

 define('MY_FTP_DEFAULT_SERVER_NAME', 'default_server');



 define('MY_COOKIE_NAME_SITE_LANGUAGE', 'site_language');


 define('MY_COOKIE_MAX_LIFETIME_VALUE', 999999999);

 define('MY_CONTROLLER_NAME_MAP', 'map');
 define('MY_CONTROLLER_NAME_MAIN', 'main');
 define('MY_CONTROLLER_NAME_CATALOG', 'catalog');
 define('MY_CONTROLLER_NAME_ARTICLE', 'article');




 define('MY_ACTION_NAME_INDEX', 'index');
 define('MY_ACTION_NAME_COUNTRY', 'country');
 define('MY_ACTION_NAME_STATE', 'state');
 define('MY_ACTION_NAME_PLACEMARK', 'placemark');
 define('MY_ACTION_NAME_SITEMAP_COUNTRIES', 'sitemap_countries');
 define('MY_ACTION_NAME_SITEMAP_CATEGORIES', 'sitemap_categories');
 define('MY_ACTION_NAME_VIEW', 'view');

 define('MY_ACTION_NAME_ARTICLES_COUNTRIES_NAME', 'countries');
 define('MY_ACTION_NAME_ARTICLES_CATEGORIES_NAME', 'categories');








 define('MY_UNDEFINED_VALUE', 'undefined');
 define('MY_ADDRESS_UNNAMED_ROAD_VALUE', 'Unnamed Road');

 define('MY_SERVICES_NAME', 'services');
 define('MY_FILE_UPLOADED_VARNAME', 'file');
 define('MY_GET_VARS_QUERY_STRING_NAME', 'query_string');
 define('MY_VAR_CATEGORY_SYSTEM', 'system');
 define('MY_VAR_CATEGORY_USER', 'user');
 define('MY_SERVICE_VAR_NAME', 'type');
 define('MY_ID_VAR_NAME', 'id');
 define('MY_CATALOG_CATEGORY_VAR_NAME', 'category');
 define('MY_CATALOG_COUNTRY_VAR_NAME', 'country');
 define('MY_CATALOG_STATE_VAR_NAME', 'state');
 define('MY_CATALOG_PAGE_NUMBER_VAR_NAME', 'page_number');


 define('MY_TOO_BIG_MAP_REQUEST_AREA_CODE', 'too_big_map_area');



 define('MY_SPAM_TRANSFERED_EMAIL_ID_VAR_NAME', 'transfered_by_spam_email_id');
 define('MY_SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME', 'transfered_by_spam_email_code');
 define('MY_SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME', 'transfered_by_spam_email_interest');
 define('MY_LANGUAGE_CODE_VAR_NAME', 'language');
 define('MY_ADMIN_PASSWORD_VAR_NAME', 'apsw');



 define('MY_FORM_SUBMIT_REDIRECT_URL_VAR_NAME', 'url_redirect');
 define('MY_FORM_SUBMIT_REDIRECT_URL_VALUE_SELF', 'self');
 define('MY_FORM_BUTTON_CODE', '@1');

 define('MY_DEVICE_MOBILE_TYPE_CODE', 'mobile');
 define('MY_DEVICE_DESCTOP_TYPE_CODE', 'desctop');
 define('MY_DIR_GENERIC_NAME', 'generic');
 define('MY_DIR_DESCTOP_NAME', 'desctop');
 define('MY_DIR_MOBILE_NAME', 'mobile');

 define('MY_SUCCESS_CODE', 'success');
 define('MY_NONE_CATEGORY_CODE', 'none');
 define('MY_FILTER_TYPE_ALL', 'all');
 define('MY_FILTER_TYPE_ONLY_REQUIRED', 'only_required');
 define('MY_FILTER_TYPE_WITHOUT_REQUIRED', 'without_required');

 define('MY_MODEL_NAME_DB_USERS', 'db_users');
 define('MY_MODEL_NAME_DB_MAP_DATA', 'db_map_data');
 define('MY_MODEL_NAME_DB_MAP_PHOTOS', 'db_map_photos');
 define('MY_MODEL_NAME_DB_EMAILS_SENT', 'db_emails_sent');
 define('MY_MODEL_NAME_DB_GEOCODE_COLLECTION', 'db_geocode_collection');
 define('MY_MODEL_NAME_DB_USERS_REGISTERED', 'db_users_registered');
 define('MY_MODEL_NAME_DB_COUNTRY_STATES', 'db_country_states');
 define('MY_MODEL_NAME_DB_COUNTRY_NAME', 'db_country_name');
 define('MY_MODEL_NAME_DB_COUNTRY', 'db_country');
 define('MY_MODEL_NAME_DB_COUNTRY_PARAMS', 'db_country_params');
 define('MY_MODEL_NAME_DB_COUNTRY_STATES_GOOGLE_NAMES', 'db_country_states_google_names');
 define('MY_MODEL_NAME_DB_country_states_cities_google_translates', 'db_country_states_cities_google_translates');
 define('MY_MODEL_NAME_DB_ARTICLES', 'db_articles');

 define('MY_DIMENTIONS_DESCTOP_CONTENT_WIDTH', '900');
 define('MY_MODEL_NAME_FORM_ADD_NEW_POINT', 'form_add_new_point');
 define('MY_MODEL_NAME_DB_SPAM', 'db_spam');




 define('MY_FORM_TEXT_TAG_CODE_A', 'a');
 define('MY_FORM_TEXT_TAG_CODE_B', 'b');
 define('MY_FORM_TEXT_TAG_CODE_STRONG', 'strong');
 define('MY_FORM_TEXT_TAG_CODE_IMAGE_ADVANCED', 'image_advanced');
 define('MY_FORM_TEXT_TAG_CODE_P', 'p');



 define('MY_MODULE_ACCOUNT_ROLE_ADMIN_CODE', 9);

 define('MY_LANGUAGE_RU', 'ru');
 define('MY_LANGUAGE_EN', 'en');

 define('MY_COOKIE_EMAIL_PLACEMARK', 'email_placemark');

 // - добавляется и в базу (как простые данные пользователя, у которого роль админ) и в константу (можно потом брать хеш не из константы, а из базы)
 define('MY_SUPER_ADMIN_PASSWORD_HASH', '$6$$J/xCAtPslyQ7xy3SLwmDo.SMr0fnyyddNZI2ag6iMNnn7hMwetjqOzp198eeINWOP6yoS3QdmkJIhmJHUQ.dB/');


 define('MY_TIME', time());
 define('MY_START_TIME', microtime(1));
 define('MY_DS', DIRECTORY_SEPARATOR);
 define('MY_DOCROOT', realpath(dirname(__FILE__)) . MY_DS);
 define('MY_PROTOCOL', 'http://');
 define('MY_DOMEN_NAME', $_SERVER['SERVER_NAME']);
 define('MY_DOMEN', MY_PROTOCOL . MY_DOMEN_NAME);
 define('MY_APPLICATION_DIR', MY_DOCROOT . 'application' . MY_DS);
 define('MY_SERVICES_DIR', MY_APPLICATION_DIR . MY_SERVICES_NAME . MY_DS);
 define('MY_VIEWS_DIR', MY_APPLICATION_DIR . 'views' . MY_DS);
 define('MY_JS_DIR', MY_DOCROOT . 'javascript' . MY_DS);
 define('MY_LOG_MYSQL_PATH', 'log' . MY_DS . 'mysql.log');
 define('MY_LOG_APPLICATION_PATH', 'log' . MY_DS . 'application.log');
 define('MY_LOG_APPLICATION_TYPE', 'app');
 define('MY_LOG_MYSQL_TYPE', 'mysql');
 define('MY_CRYPT_HASH_ALGORYTM_CODE', '$6$');
 define('MY_FILES_DIR_NAME', 'files');
 define('MY_FILES_DIR', MY_DOCROOT . MY_FILES_DIR_NAME . MY_DS);
 define('MY_TEMP_FILES_DIR', MY_FILES_DIR . 'temp' . MY_DS);
 define('MY_FUNCTIONS_DIR', MY_APPLICATION_DIR . 'functions' . MY_DS);
 define('MY_LOG_DIR', MY_APPLICATION_DIR . 'log' . MY_DS);
 define('MY_FILES_URL', MY_DOMEN . '/files/');
 define('MY_FILES_MAP_URL', MY_DOMEN . '/files/map/');

 define('MY_SERVICE_IMGS_URL', '/imgs/');
 define('MY_SERVICE_IMGS_URL_CATEGORIES', '/imgs/categories/');
 define('MY_SERVICE_IMGS_URL_CATEGORIES_PHOTOS', '/imgs/categories/photos/');



 define('GEOPLUGIN_SERVICE_PARAMETER_COUNTRY_CODE_CODE', 'geoplugin_countryCode');
 define('MY_COUNTRY_CODE_RU_CODE', 'RU');


 */