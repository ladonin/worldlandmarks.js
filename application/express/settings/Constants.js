/*
 * File application/express/settings/Constants.js
 * const Constants = require('application/express/settings/Constants');
 *
 */


const CommonConsts = require('application/common/settings/Constants');



const DOCROOT = 'application/../';
const FILES_DIR = DOCROOT + 'files/';




let _Consts = {








 FILES_URL: '/files/',
 FILES_MAP_URL: '/files/map/',








    SERVICES_DIR:'application/express/services/',






    LOG_MYSQL_TYPE:'mysql',
    LOG_APPLICATION_TYPE:'app',

    NO_PHOTO_NAME: 'no_photo.jpg',





    FILES_DIR: FILES_DIR,
    TEMP_FILES_DIR: FILES_DIR + 'temp/',




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



    COOKIE_NAME_SITE_LANGUAGE: 'site_language',

    COOKIE_MAX_LIFETIME_VALUE: 999999999,







    ADDRESS_UNNAMED_ROAD_VALUE: 'Unnamed Road',

    SERVICES_NAME: 'services',
    FILE_UPLOADED_VARNAME: 'file',










    DIR_GENERIC_NAME: 'generic',
    DIR_DESCTOP_NAME: 'desctop',
    DIR_MOBILE_NAME: 'mobile',

    DESCTOP: 'desctop',
    MOBILE: 'mobile',







    HASH_SALT:'f348=890(ubhr5od-t',






    DIMENTIONS_DESCTOP_CONTENT_WIDTH: '900',
    MODEL_NAME_FORM_ADD_NEW_POINT: 'form_add_new_point',
    MODEL_NAME_DB_SPAM: 'db_spam',












    ACCOUNT_ROLE_ADMIN_CODE: 9,















// - добавляется и в базу (как простые данные пользователя, у которого роль админ) и в константу (можно потом брать хеш не из константы, а из базы)
    SUPER_ADMIN_PASSWORD_HASH: '$6$$J/xCAtPslyQ7xy3SLwmDo.SMr0fnyyddNZI2ag6iMNnn7hMwetjqOzp198eeINWOP6yoS3QdmkJIhmJHUQ.dB/',





    SOCKET_ROOM_REGISTERED:'registered',
    SOCKET_ROOM_UNREGISTERED:'unregistered',
    SOCKET_ROOM_DEFAULT:'default',



}

module.exports = Object.assign(CommonConsts, _Consts);















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