/*
 * File server/common/settings/Constants.js
 *
 * Constants
 */

const DOMAIN = 'http://world-landmarks.ru';

module.exports = {

    DOMAIN: DOMAIN,

    PROCESS_DEV: 'development',
    PROCESS_PROD: 'production',
    LANGUAGE_RU: 'ru',
    LANGUAGE_EN: 'en',
    LANGUAGE_NAME:'language',
    LANGUAGE_COMMON: 'COMMON',

    SERVICE_LANDMARKS: 'landmarks',

    DEVICE_NAME_DESCTOP: 'desctop',
    DEVICE_NAME_MOBILE: 'mobile',
    DEVICE_NAME_COMMON: 'common',

    AJAX_SUCCESS_CODE: 'success',
    AJAX_UNDEFINED: 'undefined',

    NONE_CATEGORY_CODE: 'none',

    FTP_DEFAULT_SERVER_NAME: 'default_server',

    DEFAULT: 'default',

    SERVICE_IMGS_URL: '/img/services/',

    CONTROLLER_NAME_MAP: 'map',
    CONTROLLER_NAME_MAIN: 'main',
    CONTROLLER_NAME_CATALOG: 'catalog',
    CONTROLLER_NAME_ARTICLES: 'articles',
    CONTROLLER_NAME_ADMIN_ACCESS: 'admin_access',
    CONTROLLER_NAME_ERRORS: 'errors',

    IMG_URL: '/img/',

    REQUEST_FORM_DATA: 'formData',

    STATIC_DATA:'STATIC_DATA',
    ACTION_DATA:'ACTION_DATA',
    UPDATE_PAGE:'UPDATE_PAGE',
    CLEAR_ACTION_DATA:'CLEAR_ACTION_DATA',
    BACKGROUND_DATA:'BACKGROUND_DATA',
    CLEAR_BACKGROUND_DATA:'CLEAR_BACKGROUND_DATA',
    REMOVE_BACKGROUND_DATA:'REMOVE_BACKGROUND_DATA',

    CONTROLLER_VAR_NAME:'controller',
    ACTION_VAR_NAME:'action',
    SERVICE_VAR_NAME: 'service',
    ID_VAR_NAME: 'id',
    URL_VAR_1_NAME: 'var1',
    URL_VAR_2_NAME: 'var2',
    URL_VAR_3_NAME: 'var3',
    URL_VAR_4_NAME: 'var4',
    CLIENT_CONTROLLER_VAR_NAME:'clientController',
    CLIENT_ACTION_VAR_NAME:'clientAction',
    CATEGORY_VAR_NAME: 'category',
    COUNTRY_VAR_NAME: 'country',
    STATE_VAR_NAME: 'state',
    PAGE_NUMBER_VAR_NAME: 'page_number',
    SPAM_TRANSFERED_EMAIL_ID_VAR_NAME: 'transfered_by_spam_email_id',
    SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME: 'transfered_by_spam_email_code',
    SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME: 'transfered_by_spam_email_interest',
    LANGUAGE_CODE_VAR_NAME: 'language',
    ISMOBILE_CODE_VAR_NAME: 'isMobile',
    ADMIN_PASSWORD_VAR_NAME: 'apsw',
    FORM_SUBMIT_REDIRECT_URL_VAR_NAME: 'url_redirect',

    ACTION_NAME_INDEX: 'index',
    ACTION_NAME_SEARCH: 'search',
    ACTION_NAME_INDEX: 'index',
    ACTION_NAME_COUNTRY: 'country',
    ACTION_NAME_STATE: 'state',
    ACTION_NAME_PLACEMARK: 'placemark',
    ACTION_NAME_SITEMAP_COUNTRIES: 'sitemap_countries',
    ACTION_NAME_SITEMAP_CATEGORIES: 'sitemap_categories',
    ACTION_NAME_SITEMAP_COUNTRY: 'sitemap_country',
    ACTION_NAME_SITEMAP_CATEGORY: 'sitemap_category',
    ACTION_NAME_VIEW: 'view',
    ACTION_NAME_COUNTRIES: 'countries',
    ACTION_NAME_CATEGORIES: 'categories',
    ACTION_NAME_CATEGORY: 'category',
    ACTION_NAME_ARTICLE: 'article',

    UNDEFINED_VALUE: 'undefined',
    TOO_BIG_MAP_REQUEST_AREA_CODE: 'too_big_map_area',

    FORM_SUBMIT_REDIRECT_URL_VALUE_SELF: 'self',
    FORM_BUTTON_CODE: '@1',
    SUCCESS_CODE: 'success',
    NONE_CATEGORY_CODE: 'none',
    FILTER_TYPE_ALL: 'all',
    FILTER_TYPE_ONLY_REQUIRED: 'only_required',
    FILTER_TYPE_WITHOUT_REQUIRED: 'without_required',
    FORM_TEXT_TAG_CODE_A: 'a',
    FORM_TEXT_TAG_CODE_B: 'b',
    FORM_TEXT_TAG_CODE_STRONG: 'strong',
    FORM_TEXT_TAG_CODE_IMAGE_ADVANCED: 'image_advanced',
    FORM_TEXT_TAG_CODE_P: 'p',

    COOKIE_EMAIL_PLACEMARK: 'email_placemark',

    // Events
    EVENT_SHOW_TOOLS_PANEL_BUTTON:'app:show_tools_panel_button',
    EVENT_TOOLS_PANEL_SET_STATUS:'app:tools_panel_set_status',
    EVENT_TOGGLE_CATEGORY_VIEWER:'app:toggle_category_viewer',
    EVENT_RESET_PAGE_SCROLLING:'app:reset_page_scrolling',
    EVENT_REFRESH_ACTION:'app:refresh_action',
    EVENT_GOTO:'app:goto'
}