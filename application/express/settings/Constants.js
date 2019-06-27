/*
 * File application/express/settings/Constants.js
 * const Constants = require('application/express/settings/Constants');
 *
 */


const CommonConsts = require('application/common/settings/Constants');

let Consts = {
    ERROR_WRONG_ADRESS: 1,
    ERROR_DB_NO_CONNECT: 2,
    ERROR_USER_NOT_VERIFICATED: 3,
    ERROR_MODEL_FILTER: 4,
    ERROR_REG_LOGIN_ITERATION: 5,
    ERROR_FORM_NOT_PASSED: 6,
    ERROR_BLOCK_NOT_FOUND: 7,
    ERROR_CONFIG_PATH_NOT_FOUND: 8,
    ERROR_DB_UNDEFINED_FIELD: 9,
    ERROR_JS_NOT_FOUND: 10,
    ERROR_IMAGE_NOT_PASSED_TO_OBJECT: 11,
    ERROR_WRONG_MODULE_NAME: 12,
    ERROR_LOADING_FILE: 13,
    ERROR_LOADING_IMAGE_WRONG_TYPE: 14,
    ERROR_FUNCTION_ARGUMENTS: 15,
    ERROR_UNKNOWN_VALIDATION_RULE: 16,
    ERROR_MYSQL: 17,
    ERROR_CLASS_NOT_FOUNT: 18,
    ERROR_METHOD_NOT_FOUNT: 19,
    ERROR_MAP_WRONG_GET_VALUE: 20,
    ERROR_VALUE_NOT_PASSED_THROUGH: 21,
    ERROR_MOVE_IMAGE_TO_TEMP_FILES_DIR_FROM_TMP: 22,
    ERROR_LANGUAGE_WORD_NOT_FOUND: 23,
    ERROR_LANGUAGE_MODEL_NOT_FOUND: 24,
    ERROR_FORM_WRONG_DATA: 25,
    ERROR_COOKIE_NAME_UNDEFINED: 26,
    ERROR_FORM_NEW_POINT_A_LOT_OF_PHOTOS: 27,
    ERROR_GET_WRONG_MAP_NAME: 28,
    ERROR_AJAX_VIEW_DATA_VARS_NOT_SET: 29,
    ERROR_FORM_UPDATE_POINT_A_LOT_OF_PHOTOS: 30,
    ERROR_WRONG_DB_WHERE_CONDITION: 31,
    ERROR_FORM_UPDATE_POINT_WITH_NO_PHOTOS: 32,
    ERROR_UNDEFINED_MODULE_NAME: 33,
    ERROR_UNDEFINED_MODEL_NAME: 34,
    ERROR_MAILER_NOT_SENT: 35,
    ERROR_IMAGE_CREATE: 36,
    ERROR_LANGUAGE_NOT_FOUND: 37,
    ERROR_LANGUAGE_CODE_NOT_FOUND: 38,
    ERROR_GEOCODE_LOCATION_NOT_FOUND: 39,
    ERROR_IMAGE_GET_TYPE: 40,
    ERROR_VARIABLE_EMPTY: 41,
    ERROR_CATALOG_WRONG_GET_VALUE: 41,
    ERROR_CATALOG_WRONG_PLACEMARK_ADDRESS_OR_ID: 42,
    ERROR_CATEGORY_NOT_FOUND: 43,
    ERROR_UNRESOLVED_ACCESS: 44,
    ERROR_SPAM_TRANSFERED_EMAIL_NOT_FULL_DATA: 45,
    ERROR_SERVICE_CONFIG_ABSENT: 46,
    ERROR_COPY_IMAGE_TO_TEMP_FILES_DIR_FROM_URL: 47,
    ERROR_WRONG_COORDS: 48,
    ERROR_FTP_CONNECTION: 49,
    ERROR_LOCAL_FILE_NOT_FOUND: 50,
    ERROR_FTP_LOAD_FILE: 51,
    ERROR_FTP_SERVER_NAME_NOT_DEFINED: 52,
    ERROR_FTP_CONNECTION_FOR_SERVER_NAME_NOT_SET: 53,
    ERROR_FTP_CREATE_DIR: 54,
    ERROR_COUNTRY_NAME_WAS_NOT_FOUND: 55,
    ERROR_COUNTRY_STATE_NAME_WAS_NOT_FOUND: 56,
    ERROR_COUNTRY_ID_WAS_NOT_FOUND: 57,
    ERROR_COUNTRY_STATE_ID_WAS_NOT_FOUND: 58,
    ERROR_COUNTRY_DATA_WAS_NOT_FOUND: 59,



    SERVICES_DIR:'application/express/services/',






    LOG_MYSQL_TYPE:'mysql',
    LOG_APPLICATION_TYPE:'app',

    NO_PHOTO_NAME: 'no_photo.jpg',

    FTP_DEFAULT_SERVER_NAME:'default_server',
    FTP_NAME: 'ftp',
    LOCALHOST_NAME: 'localhost',

    MODULE_NAME_SECURITY: 'security',
    MODULE_NAME_MAP: 'map',
    MODULE_NAME_MAILER: 'mailer',
    MODULE_NAME_SEO: 'seo',
    MODULE_NAME_CATALOG: 'catalog',
    MODULE_NAME_ARTICLE: 'article',
    MODULE_NAME_SEARCH: 'search',
    MODULE_NAME_ACCOUNT: 'account',
    MODULE_NAME_ANALYZE: 'analyze',
    MODULE_NAME_ARCHIVE: 'archive',
    SITEMAP_COUNTRIES_NAME: 'sitemap_countries',
    ARTICLES_LIST_NAME: 'articles_list',
    ARTICLES_NAME: 'articles',
    SITEMAP_CATEGORIES_NAME: 'sitemap_categories',
    MODULE_NAME_SERVICE: 'service',

    FTP_DEFAULT_SERVER_NAME: 'default_server',

    COOKIE_NAME_SITE_LANGUAGE: 'site_language',

    COOKIE_MAX_LIFETIME_VALUE: 999999999,

    CONTROLLER_NAME_MAP: 'map',
    CONTROLLER_NAME_MAIN: 'main',
    CONTROLLER_NAME_CATALOG: 'catalog',
    CONTROLLER_NAME_ARTICLE: 'article',

    ACTION_NAME_INDEX: 'index',
    ACTION_NAME_COUNTRY: 'country',
    ACTION_NAME_STATE: 'state',
    ACTION_NAME_PLACEMARK: 'placemark',
    ACTION_NAME_SITEMAP_COUNTRIES: 'sitemap_countries',
    ACTION_NAME_SITEMAP_CATEGORIES: 'sitemap_categories',
    ACTION_NAME_VIEW: 'view',

    ACTION_NAME_ARTICLES_COUNTRIES_NAME: 'countries',
    ACTION_NAME_ARTICLES_CATEGORIES_NAME: 'categories',

    UNDEFINED_VALUE: 'undefined',
    ADDRESS_UNNAMED_ROAD_VALUE: 'Unnamed Road',

    SERVICES_NAME: 'services',
    FILE_UPLOADED_VARNAME: 'file',
    SERVICE_VAR_NAME: 'service',//ATTENTION - обратите внимание
    ID_VAR_NAME: 'id',
    CATALOG_CATEGORY_VAR_NAME: 'category',
    CATALOG_COUNTRY_VAR_NAME: 'country',
    CATALOG_STATE_VAR_NAME: 'state',
    CATALOG_PAGE_NUMBER_VAR_NAME: 'page_number',

    TOO_BIG_MAP_REQUEST_AREA_CODE: 'too_big_map_area',

    SPAM_TRANSFERED_EMAIL_ID_VAR_NAME: 'transfered_by_spam_email_id',
    SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME: 'transfered_by_spam_email_code',
    SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME: 'transfered_by_spam_email_interest',
    LANGUAGE_CODE_VAR_NAME: 'language',
    ADMIN_PASSWORD_VAR_NAME: 'apsw',

    FORM_SUBMIT_REDIRECT_URL_VAR_NAME: 'url_redirect',
    FORM_SUBMIT_REDIRECT_URL_VALUE_SELF: 'self',
    FORM_BUTTON_CODE: '@1',

    DEVICE_MOBILE_TYPE_CODE: 'mobile',
    DEVICE_DESCTOP_TYPE_CODE: 'desctop',
    DIR_GENERIC_NAME: 'generic',
    DIR_DESCTOP_NAME: 'desctop',
    DIR_MOBILE_NAME: 'mobile',

    SUCCESS_CODE: 'success',
    NONE_CATEGORY_CODE: 'none',
    FILTER_TYPE_ALL: 'all',
    FILTER_TYPE_ONLY_REQUIRED: 'only_required',
    FILTER_TYPE_WITHOUT_REQUIRED: 'without_required',

    MODEL_NAME_DB_USERS: 'db_users',
    MODEL_NAME_DB_MAP_DATA: 'db_map_data',
    MODEL_NAME_DB_MAP_PHOTOS: 'db_map_photos',
    MODEL_NAME_DB_EMAILS_SENT: 'db_emails_sent',
    MODEL_NAME_DB_GEOCODE_COLLECTION: 'db_geocode_collection',
    MODEL_NAME_DB_USERS_REGISTERED: 'db_users_registered',
    MODEL_NAME_DB_COUNTRY_STATES: 'db_country_states',
    MODEL_NAME_DB_COUNTRY_NAME: 'db_country_name',
    MODEL_NAME_DB_COUNTRY: 'db_country',
    MODEL_NAME_DB_COUNTRY_PARAMS: 'db_country_params',
    MODEL_NAME_DB_COUNTRY_STATES_GOOGLE_NAMES: 'db_country_states_google_names',
    MODEL_NAME_DB_country_states_cities_google_translates: 'db_country_states_cities_google_translates',
    MODEL_NAME_DB_ARTICLES: 'db_articles',

    DIMENTIONS_DESCTOP_CONTENT_WIDTH: '900',
    MODEL_NAME_FORM_ADD_NEW_POINT: 'form_add_new_point',
    MODEL_NAME_DB_SPAM: 'db_spam',

    FORM_TEXT_TAG_CODE_A: 'a',
    FORM_TEXT_TAG_CODE_B: 'b',
    FORM_TEXT_TAG_CODE_STRONG: 'strong',
    FORM_TEXT_TAG_CODE_IMAGE_ADVANCED: 'image_advanced',
    FORM_TEXT_TAG_CODE_P: 'p',

    ACCOUNT_ROLE_ADMIN_CODE: 9,

    LANGUAGE_RU: 'ru',
    LANGUAGE_EN: 'en',

    COOKIE_EMAIL_PLACEMARK: 'email_placemark',

// - добавляется и в базу (как простые данные пользователя, у которого роль админ) и в константу (можно потом брать хеш не из константы, а из базы)
    SUPER_ADMIN_PASSWORD_HASH: '$6$$J/xCAtPslyQ7xy3SLwmDo.SMr0fnyyddNZI2ag6iMNnn7hMwetjqOzp198eeINWOP6yoS3QdmkJIhmJHUQ.dB/',
}

module.exports = Object.assign(CommonConsts, Consts);















/*dfgdfg


 SERVICES_NAME:'services',

 DOCROOT:realpath(dirname(__FILE__)) . DS . '..' . DS . '..' . DS,
 PROTOCOL:'http://',
 if (isset($_SERVER['SERVER_NAME'])) {
 DOMEN_NAME:$_SERVER['SERVER_NAME'],
 DOMEN:PROTOCOL . DOMEN_NAME,
 FILES_URL:DOMEN . '/files/',
 FILES_MAP_URL:DOMEN . '/files/map/',
 }

 APPLICATION_DIR:DOCROOT . 'application' . DS,
 VIEWS_DIR:APPLICATION_DIR . 'views' . DS,
 JS_DIR:DOCROOT . 'javascript' . DS,
 LOG_MYSQL_PATH:DOCROOT . 'log' . DS . 'mysql.log',
 LOG_APPLICATION_PATH:DOCROOT . 'log' . DS . 'application.log',


 SERVICE_VAR_NAME:'type',
 CRYPT_HASH_ALGORYTM_CODE:'$6$',
 FILES_DIR_NAME:'files',
 FILES_DIR:DOCROOT . FILES_DIR_NAME . DS,
 TEMP_FILES_DIR:FILES_DIR . 'temp' . DS,
 FUNCTIONS_DIR:APPLICATION_DIR . 'functions' . DS,
 LOG_DIR:APPLICATION_DIR . 'log' . DS,


 UNDEFINED_VALUE:'undefined',


 FORM_TEXT_TAG_CODE_A:'a',
 FORM_TEXT_TAG_CODE_B:'b',
 FORM_TEXT_TAG_CODE_STRONG:'strong',
 FORM_TEXT_TAG_CODE_IMAGE_ADVANCED:'image_advanced',
 FORM_TEXT_TAG_CODE_P:'p',
 SERVICE_IMGS_URL_CATEGORIES:'/imgs/categories/',


 MODULE_NAME_SERVICE:'service',
 FTP_DEFAULT_SERVER_NAME:'default_server',







 require_once(APPLICATION_DIR . 'config' . DS . 'Consts' . DS . 'countries.php',

 $categories_colors = require_once(APPLICATION_DIR . 'components' . DS . 'app' . DS . 'categories' . DS . 'colors.php',
 */