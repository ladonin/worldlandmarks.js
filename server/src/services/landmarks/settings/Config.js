/*
 * File server/src/services/landmarks/settings/Config.js
 * const Config = require('server/src/services/landmarks/settings/Config');
 *
 * Specific service config
 */

const Consts = require('server/src/settings/Constants');
const ConfigServ = require('server/common/services/landmarks/settings/Config');

module.exports = {

    // FTP connection parameters
    ftp: require('server/src/settings/gitignore/FtpServers')[Consts.FTP_DEFAULT_SERVER_NAME],

    // Which controllers will be used
    controllers: [
        Consts.CONTROLLER_NAME_MAP,
        Consts.CONTROLLER_NAME_MAIN,
        Consts.CONTROLLER_NAME_CATALOG,
        Consts.CONTROLLER_NAME_ARTICLES
    ],

    generic: {
        site_name: 'world-landmarks.ru',
        need_photos_for_placemarks: true,
        use_titles: true,
        show_relevant_placemarks: true,
        show_another_placemarks: true,
        max_map_load_size: 90, // В координатах (широты, долготы)
        max_random_articles: 5,
        max_last_country_articles: 5,
        max_last_main_page_articles: 5,
    },

    map: ConfigServ.map,

    languages: [
        {
            code: Consts.LANGUAGE_RU,
            title: 'Русский'
        },
        {
            code: Consts.LANGUAGE_EN,
            title: 'English'
        }

        // Attention: if new language will be added, then we should process all placemarks over yandex geocode service, otherwise in new language mode adresses will not be showed, because the forms from data in dbase by specific language
        // It is made in console (in PHP):
        // # php shell/add_new_language_in_geolocate.php landmarks ru - for russian language
    ],
    email: {
        1: {
            from: 'info@world-landmarks.ru',
            name: 'World Landmarks',
        }
    },
    pages: ConfigServ.pages,
    security: ConfigServ.security,
    // Categories settings
    categories: ConfigServ.categories,

    // Map ballons settings
    dimentions: ConfigServ.dimentions,

    // Text formatting settings
    text_form: ConfigServ.text_form
};