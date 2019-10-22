/*
 * File server/src/settings/Constants.js
 * const Constants = require('server/src/settings/Constants');
 *
 */

const CommonConsts = require('server/common/settings/Constants');

const DOCROOT = 'server/../';
const FILES_DIR = DOCROOT + 'files/';

let _Consts = {
    FILES_URL: '/files/',
    FILES_MAP_URL: '/files/map/',
    SERVICES_DIR: 'server/src/services/',
    LOG_MYSQL_TYPE: 'mysql',
    LOG_APPLICATION_TYPE: 'app',
    NO_PHOTO_NAME: 'no_photo.jpg',
    FILES_DIR: FILES_DIR,
    TEMP_FILES_DIR: FILES_DIR + 'temp/',
    FTP_DEFAULT_SERVER_NAME: 'default_server',
    FTP_NAME: 'ftp',
    LOCALHOST_NAME: 'localhost',
    MODULE_NAME_SECURITY: 'security',
    MODULE_NAME_MAP: 'map',
    MODULE_NAME_MAILER: 'mailer',
    MODULE_NAME_SEO: 'seo',
    MODULE_NAME_CATALOG: 'catalog',
    MODULE_NAME_ARTICLE: 'article',
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
    HASH_SALT: 'f348=890(ubhr5od-t',
    MODEL_NAME_FORM_ADD_NEW_POINT: 'form_add_new_point',
    MODEL_NAME_DB_SPAM: 'db_spam',
    ACCOUNT_ROLE_ADMIN_CODE: 9,
    SUPER_ADMIN_PASSWORD_HASH: '$6$$J/xCAtPslyQ7xy3SLwmDo.SMr0fnyyddNZI2ag6iMNnn7hMwetjqOzp198eeINWOP6yoS3QdmkJIhmJHUQ.dB/',
    SOCKET_ROOM_REGISTERED: 'registered',
    SOCKET_ROOM_UNREGISTERED: 'unregistered',
    SOCKET_ROOM_DEFAULT: 'default',
}

module.exports = Object.assign(CommonConsts, _Consts);