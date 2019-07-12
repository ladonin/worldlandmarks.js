/*
 * File application/express/settings/Config.js
 * const Config = require('application/express/settings/Config');
 *
 * Base config
 */

const Consts = require('application/express/settings/Constants');
module.exports = {

    //########################
    //#
    //# System settings
    //#
    //########################

    //Debug mode
    debug: 1,
    //Logging errors
    log: {
        on: 1
    },
    // Where upload files will be stored
    files_upload_storage: {
        server: 'ftp'
    },

    // Controllers settings
    controllers: {
        enabled: {
            [Consts.CONTROLLER_NAME_MAP]: 'Map',
            [Consts.CONTROLLER_NAME_MAIN]: 'Main',
            [Consts.CONTROLLER_NAME_CATALOG]: 'Catalog',
            [Consts.CONTROLLER_NAME_ARTICLE]: 'Article',
            [Consts.CONTROLLER_NAME_ADMIN_ACCESS]: 'AdminAccess',
            [Consts.CONTROLLER_NAME_ERRORS]: 'Errors',
        }

    },
    // Common localizations
    text: {
        en: require('application/express/settings/language/En'),
        ru: require('application/express/settings/language/Ru')
    },
    // Services
    services: {
        landmarks: {
            config: require('application/express/services/landmarks/settings/Config'),

            // Localizations
            text: {
                en: require('application/express/services/landmarks/language/En'),
                ru: require('application/express/services/landmarks/language/Ru')
            }
        }
    },

    // Operations before and after controller execution
    operations: {
        // Before
        before: [
            {
                class: 'application/express/components/Account',
                method: 'authentication'
            },
            //{
            //    class: 'components/app/visitors_analyze',
            //    method: 'identify'
            //},
        ],
        // After
        after: [
            /*
             {
             'class'         :  '',
             'method'        :  '',
             }
             */
        ]
    },
    // Which database will be used (MySQL)
    db: require('application/express/settings/gitignore/MySql'),
    //#???????????????????????????? - то, что возможно не нужно
    /*
     //Настройка шаблонов страниц -  contoler/action => layout file
     // Layout
     'layouts' => array(
     //Контроллеры
     'map' => array(
     //Action - layout файл
     'index' => 'map',
     ),
     'catalog' => array(
     'placemark' => 'catalog',
     'index' => 'catalog',
     'country' => 'catalog',
     'state' => 'catalog',
     'search' => 'catalog',
     'sitemap_countries' => 'catalog',
     'sitemap_categories' => 'catalog',
     ),
     'main' => array(
     'index' => 'main',
     ),
     'article' => array(
     'view' => 'article',
     'countries' => 'article',
     'categories' => 'article',
     ),
     ),
     */

    //Класс языка сайта
    //#???????????????????????????? - то, что возможно не нужно
    /*
     'language:{
     'class:'\components\app\language'
     },*/

    //Настройки куков
    //#???????????????????????????? - то, что возможно не нужно
    /*
     'cookies' => array(
     //Дефолтное время жизни
     'lifetime' => 3600 * 24 * 21,
     ),
     */


    //Настройка GET переменных
    // GET vars settings
    get_vars: {
        // 'not_empty means - if found, then should not be empty
        // All variables also have rule 'not_required' by default

        // System variables
        controller: {
            rules: ['varname', {max: 50}, 'required']
        },
        action: {
            rules: ['varname', {max: 50}, 'required']
        },
        var3: {
            rules: ['varname', {max: 50}, 'not_empty']
        },
        var4: {
            rules: ['varname', {max: 50}, 'not_empty']
        },

        // Custom variablles
        [Consts.SERVICE_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']},
        [Consts.ID_VAR_NAME]: {rules: ['numeric', 'not_empty']},
        [Consts.CATALOG_CATEGORY_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']},
        [Consts.CATALOG_COUNTRY_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']},
        [Consts.CATALOG_STATE_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']},
        [Consts.CATALOG_PAGE_NUMBER_VAR_NAME]: {rules: ['numeric', 'not_empty']},
        [Consts.SPAM_TRANSFERED_EMAIL_ID_VAR_NAME]: {rules: ['numeric', 'not_empty']},
        [Consts.SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME]: {rules: ['numeric', 'not_empty']},
        [Consts.SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME]: {rules: ['numeric', 'not_empty']},
        [Consts.LANGUAGE_CODE_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']},
        [Consts.ADMIN_PASSWORD_VAR_NAME]: {rules: ['get_query_string_var_value', 'not_empty']}

    },
    //########################
    //#
    //# Custom settings
    //#
    //########################

    // Automatic part generation
    // Example:
    //#    get_path('get_placemarks_by_coords')
    paths: {
        upload_file: {
            controller: 'map',
            action: 'ajax_upload_file_to_temp'
        },
        get_placemarks_by_coords: {
            controller: 'map',
            action: 'ajax_get_placemarks_by_coords'
        },
        fill_placemarks_on_map: {
            controller: 'map',
            action: 'ajax_fill_placemarks_on_map'
        },
        get_placemarks_by_ids: {
            controller: 'map',
            action: 'ajax_get_placemarks_by_ids'
        },
        get_placemark_content_by_id: {
            controller: 'map',
            action: 'ajax_get_placemark_content_by_id'
        },
        get_placemarks_list: {
            controller: 'catalog',
            action: 'ajax_get_placemarks_list'
        },
        delete_placemark: {
            controller: 'map',
            action: 'ajax_delete_point'
        },
        set_search_rules: {
            controller: 'catalog',
            action: 'ajax_set_search_rules'
        },
        set_site_language: {
            controller: 'map',
            action: 'ajax_set_site_language'
        }
        /*
         'get_placemark_data:{
         'controller:'map',
         'action:'ajax_get_placemark_data'
         },
         */
    },
    // ATTENTION - обратите внимание
    // allows
    // Application restrinctions
    restrictions: require('application/express/settings/Restrictions'),
    // Screen size settings
    dimentions: {
        // Mobile version
        mobile: {
            sublist_images: {
                width: 90,
                height: 90
            }
        },
        // Desctop version
        desctop: {
            sublist_images: {
                width: 184,
                height: 148
            }
        }
    }
};