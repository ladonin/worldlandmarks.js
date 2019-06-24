/*
 * File application/express/components/base/Service.js
 * const Service = require('application/express/components/base/Service');
 *
 * Basic component for working with services
 */

const Component = require('application/express/vendor/Component');
const Config = require('application/express/settings/Config.js');
const Functions = require('application/express/functions/BaseFunctions');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Account = require('application/express/components/base/Account');
const Consts = require('application/express/settings/Constants');


class Service extends Component
{
    constructor() {
        super();

        /*
         * Service name
         *
         * @type string
         */
        this.name = Functions.get_service_name();
        /*
         * Path to service
         *
         * @type string
         */
        this.path = Consts.SERVICES_DIR + this.name + '/';
        /*
         * All service data from config
         *
         * @type object
         */
        this.data = Functions.get_service_data();

    }

    /*
     * Get email's 'from' for sending messages
     *
     * @param integer number - email's number in config list
     *
     * @return string
     */
    get_email_from(number)
    {
        if (Functions.isSet(this.data.config.email[number])) {
            return this.data.config.email[number]['from'];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] email-' + number + '-from');
    }

    /*
     * Get email's 'name' for sending messages
     *
     * @param integer number - email's number in config list
     *
     * @return string
     */
    get_email_name(number)
    {
        if (Functions.isSet(this.data.config.email[number])) {
            return this.data.config.email[number]['name'];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] email-' + number + '-name');
    }

    /*
     * Get site name of service
     *
     * @return string
     */
    get_site_name()
    {
        if (Functions.isSet(this.data.config.generic.site_name)) {
            return this.data.config.generic.site_name;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] generic-site_name');
    }

    /*
     * Get all service words according with language
     *
     * @param string language
     *
     * @return object
     */
    get_words(language)
    {
        if (Functions.isSet(this.data.text[language])) {
            return this.data.text[language];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] language [' + language + ']');
    }

    /*
     * Get ftp data (login, directory etc.)
     *
     * @return object
     */
    get_ftp_data()
    {
        if (Functions.isSet(this.data.config.ftp)) {
            return this.data.config.ftp;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] ftp');
    }

    /*
     * Get all languages available in service
     *
     * @return array of objects
     */
    get_languages()
    {
        if (Functions.isSet(this.data.config.languages)) {
            return this.data.config.languages;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'service=[' + this.name + '] languages');
    }

    /*
     * Get available text form tags
     *
     * @return array of objects
     */
    get_text_form_tags()
    {
        if (Functions.isSet(this.data.config.text_form.tags)) {

            if (Account.is_admin()) {
                // Set of tags for admin
                return this.data.config.text_form.tags;
            } else {
                // Set of free tags for another users
                let result = [];
                for (var key in this.data.config.text_form.tags) {
                    let tag = this.data.config.text_form.tags[key];
                    if (tag['free'] === true) {
                        result.push(tag);
                    }
                }
                return result;
            }
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'text_form-site_name');
    }

    /*
     * Determines is text links entered by form will be turned into real links for admin
     *
     * @return boolean
     */
    is_available_to_process_links_in_text_for_admin()
    {
        if (Functions.isSet(this.data.config.text_form.auto_process_links.admin)) {
            return this.data.config.text_form.auto_process_links.admin;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'text_form-auto_process_links-admin');
    }

    /*
     * Determines - are placemarks require photos
     *
     * @return boolean
     */
    is_need_photos_for_placemarks()
    {
        if (Functions.isSet(this.data.config.generic.need_photos_for_placemarks)) {
            return this.data.config.generic.need_photos_for_placemarks;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-need_photos_for_placemarks');
    }

    /*
     * Determines is text links entered by form will be turned into real links for another users
     *
     * @return boolean
     */
    is_available_to_process_links_in_text_for_free_users()
    {
        if (Functions.isSet(this.data.config.text_form.auto_process_links.free)) {
            return this.data.config.text_form.auto_process_links.free;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'text_form-auto_process_links-free');
    }

    /*
     * Get all categories codes with id
     *
     * @return array of objects
     */
    get_categories_codes()
    {
        if (Functions.isSet(this.data.config.categories.categories_codes)) {
            return this.data.config.categories.categories_codes;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'categories-categories_codes');
    }

    /*
     * Get categories with locals for create selection form to create/update placemark (point)
     *
     * @return array of objects
     */
    get_categories_add_new_point_form_options()
    {
        let categories = this.get_categories_codes();
        let result = [];
        result.push(['none', 'form/map_new_point/category/' + Consts.NONE_CATEGORY_CODE, 'selected']);
        for (var index in categories) {
            let id = categories[index].id;
            result.push([id, 'form/map_new_point/category/' + id]);
        }
        return result;
    }

    /*
     * Determines how many placemarks will be in one batch while filling the map
     *
     * @return number
     */
    get_map_autofill_limit()
    {

        if (Functions.isSet(this.data.config.map.autofill.individual_limit)) {
            return this.data.config.map.autofill.individual_limit;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-individual_limit');
    }

    /*
     * Determines how frequently batches of placemarks will be get
     *
     * @return number - period in milliseconds
     */
    get_map_autofill_period()
    {
        if (Functions.isSet(this.data.config.map.autofill.period)) {
            return this.data.config.map.autofill.period * 1000;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-period');
    }

    /*
     * Determines should placemarks be loaded on map automatically or not
     *
     * @return boolean
     */
    is_map_autofill_enabled()
    {
        if (Functions.isSet(this.data.config.map.autofill.on)) {
            return this.data.config.map.autofill.on;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-on');
    }

    /*
     * Get map ballon dimentions (size, position)
     *
     * @return object
     */
    get_baloon_dimentions()
    {
        if (Functions.isSet(this.data.config.dimentions.ballon)) {
            return this.data.config.dimentions.ballon;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-ballon');
    }

    /*
     * Determines whether everyone can add placemarks
     *
     * @return object
     */
    is_all_can_add_placemarks()
    {
        if (Functions.isSet(this.data.config.security.all_can_add_placemarks)) {
            return this.data.config.security.all_can_add_placemarks;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'security-all_can_add_placemarks');
    }

    /*
     * Get initial width of category photo (not placemark photo)
     * Will be shown if there are no photos loaded for placemark
     *
     * @return integer
     */
    get_categories_photo_initial_width()
    {
        if (Functions.isSet(this.data.config.dimentions.categories_photo_initial_width)) {
            return this.data.config.dimentions.categories_photo_initial_width;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-categories_photo_initial_width');
    }

    /*
     * Get initial height of category photo (not placemark photo)
     * Will be shown if there are no photos loaded for placemark
     *
     * @return integer
     */
    get_categories_photo_initial_height()
    {
        if (Functions.isSet(this.data.config.dimentions.categories_photo_initial_height)) {
            return this.data.config.dimentions.categories_photo_initial_height;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-categories_photo_initial_height');
    }

    /*
     * Get maximum area with which plamerarks will be loaded (less or equal)
     * If area too big, then placemarks will not be loaded
     *
     * @return integer
     */
    get_max_map_load_size()
    {
        if (Functions.isSet(this.data.config.generic.max_map_load_size)) {
            return this.data.config.generic.max_map_load_size;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_map_load_size');
    }

    /*
     * Get maximum number of random articles on article (under viewed article)
     *
     * @return integer
     */
    get_max_random_articles()
    {
        if (Functions.isSet(this.data.config.generic.max_random_articles)) {
            return this.data.config.generic.max_random_articles;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_random_articles');
    }

    /*
     * Get maximum number of articles suitable for viewed article country (under viewed article)
     *
     * @return integer
     */
    get_max_last_country_articles()
    {
        if (Functions.isSet(this.data.config.generic.max_last_country_articles)) {
            return this.data.config.generic.max_last_country_articles;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_last_country_articles');
    }

    /*
     * Get maximum number of new articles on main page
     *
     * @return integer
     */
    get_max_last_main_page_articles()
    {
        if (Functions.isSet(this.data.config.generic.max_last_main_page_articles)) {
            return this.data.config.generic.max_last_main_page_articles;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_last_main_page_articles');
    }

    /*
     * Determines should we add category photo as main while create placemark
     * Category photo will became main placemark's photo in list instead of first loaded photo
     *
     * @return boolean
     */
    is_add_category_photo_as_first_in_placemark_view()
    {
        if (Functions.isSet(this.data.config.categories.generic.add_category_photo_as_first_in_placemark_view)) {
            return this.data.config.categories.generic.add_category_photo_as_first_in_placemark_view;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'categories-generic-add_category_photo_as_first_in_placemark_view');
    }

    /*
     * Determines should we show 'main' (index) page
     *
     * @return boolean
     */
    is_show_main_pages()
    {
        if (Functions.isSet(this.data.config.pages.main)) {
            return this.data.config.pages.main;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'pages-main');
    }

    /*
     * Determines should we show 'catalog' page
     *
     * @return boolean
     */
    is_show_catalog_pages()
    {
        if (Functions.isSet(this.data.config.pages.catalog)) {
            return this.data.config.pages.catalog;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'pages-catalog');
    }

    /*
     * Determines should we show 'search' page
     *
     * @return boolean
     */
    is_show_search_pages()
    {
        if (Functions.isSet(this.data.config.pages.search)) {
            return this.data.config.pages.search;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'pages-search');
    }

    /*
     * Determines should we show 'articles' page
     *
     * @return boolean
     */
    is_show_article_pages()
    {
        if (Functions.isSet(this.data.config.pages.article)) {
            return this.data.config.pages.article;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'pages-article');
    }

    /*
     * Determines should we show placemark's title everywhere
     * In case if placemarks are loaded by admin with correct title this config should be equals 'true'
     *
     * @return boolean
     */
    is_use_titles()
    {
        if (Functions.isSet(this.data.config.generic.use_titles)) {
            return this.data.config.generic.use_titles;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-use_titles');
    }

    /*
     * Get path to sevice css/js files
     *
     * @return string
     */
    get_frontend_path()
    {
        return this.path + 'frontend/';
    }

    /*
     * Get path to sevice view blocks
     *
     * @return string
     */
    get_blocks_path()
    {
        return this.path + 'blocks/';
    }

    /*
     * Determines whether pased photo is category photo
     *
     * @param string - photo's name with extension
     *
     * @return boolean
     */
    is_photo_by_category(photo)
    {
        let categories = this.get_categories_codes();
        for (var index in categories) {
            let category = categories[index];
            if (photo === category.code + '.jpg') {
                return true;
            }

        }
        return false;
    }

    /*
     * Determines should we show placemarks relevant to viewed placemark
     * Placed in the bottom
     *
     * @return boolean
     */
    is_show_relevant_placemarks()
    {
        if (Functions.isSet(this.data.config.generic.show_relevant_placemarks)) {
            return this.data.config.generic.show_relevant_placemarks;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-show_relevant_placemarks');
    }

    /*
     * Determines should we show another placemarks appropriate for main category of viewed placemark
     * Placed in the bottom
     *
     * @return boolean
     */
    is_show_another_placemarks()
    {
        if (Functions.isSet(this.data.config.generic.show_another_placemarks)) {
            return this.data.config.generic.show_another_placemarks;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT, 'generic-show_another_placemarks');
    }
}