/*
 * File application/express/components/base/Service.js
 *
 * Basic component for working with services
 */

const Component = require('vendor/Component');
const Config = require('application/express/settings/Config.js');
const Functions = require('application/express/functions/BaseFunctions');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');

class Service extends Component
{
    constructor(){
        /*
         * Service congiguration
         *
         * @type array
         */
        this.config = [];

        /*
         * Service dictionary
         *
         * @type array
         */
        this.words = [];

        /*
         * Path to service
         *
         * @type string
         */
        this.path = '';

        /*
         * All service data from config
         *
         * @type object
         */
        this.data = Functions.get_service_data();

         /*
         * Service name
         *
         * @type string
         */
        this.name = Functions.get_service_name();
    }


    /*
     * Functions:
     *
     * Get specific config data belonging service
     */

    get_email_from(number)
    {
        if (Functions.isSet(this.data.config.email[number])) {
            return this.data.config.email[number]['from'];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] email-' + number + '-from');
    }


    get_email_name(number)
    {
        if (Functions.isSet(this.data.config.email[number])) {
            return this.data.config.email[number]['name'];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] email-' + number + '-name');
    }

    get_site_name()
    {
        if (Functions.isSet(this.data.config.generic.site_name)) {
            return this.data.config.generic.site_name;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] generic-site_name');
    }


    get_words(language)
    {
        if (Functions.isSet(this.data.text[language])) {
            return this.data.text[language];
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] language [' + language + ']');
    }


    get_ftp_data()
    {
        if (Functions.isSet(this.data.config.ftp)) {
            return this.data.config.ftp;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] ftp');
    }





    get_languages()
    {
        if (Functions.isSet(this.data.config.languages)) {
            return this.data.config.languages;
        }
        ErrorHandler.process(ErrorCodes.ERROR_SERVICE_CONFIG_ABSENT + ': service=[' + this.name + '] languages');
    }


    get_text_form_tags()
    {
        if (Functions.isSet(this.data.config.text_form.tags)) {

nextTTTTTTTTTTTT - продолжать с этого момента




            if (self::get_module(MY_MODULE_NAME_ACCOUNT)->is_admin()) {
                // админу все теги
                return $this->config['text_form']['tags'];
            } else {
                // юзеру только 'free' теги
                $result = array();
                foreach ($this->config['text_form']['tags'] as $tag) {

                    if ($tag['free'] === true) {
                        $result[] = $tag;
                    }
                }
                return $result;
            }
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'text_form-site_name'));
    }












    public function is_need_photos_for_placemarks()
    {
        if (isset($this->config['generic']['need_photos_for_placemarks'])) {
            return $this->config['generic']['need_photos_for_placemarks'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-need_photos_for_placemarks'));
    }


    public function is_available_to_process_links_in_text_for_free_users()
    {
        if (isset($this->config['text_form']['auto_process_links']['free'])) {
            return $this->config['text_form']['auto_process_links']['free'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'text_form-auto_process_links-free'));
    }


    public function is_available_to_process_links_in_text_for_admin()
    {
        if (isset($this->config['text_form']['auto_process_links']['admin'])) {
            return $this->config['text_form']['auto_process_links']['admin'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'text_form-auto_process_links-admin'));
    }


    public function get_categories_add_new_point_form_options()
    {
        if (isset($this->config['categories']['categories_add_new_point_form_options'])) {
            return $this->config['categories']['categories_add_new_point_form_options'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'categories-categories_add_new_point_form_options'));
    }


    public function get_categories_codes()
    {
        if (isset($this->config['categories']['categories_codes'])) {
            return $this->config['categories']['categories_codes'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'categories-categories_codes'));
    }



    public function get_map_autofill_limit()
    {
        if (isset($this->config['map']['autofill']['individual_limit'])) {
            return $this->config['map']['autofill']['individual_limit'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-individual_limit'));
    }

    public function get_map_autofill_period()
    {
        if (isset($this->config['map']['autofill']['period'])) {
            return $this->config['map']['autofill']['period']*1000;
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-period'));
    }

    public function is_map_autofill_enabled()
    {
        if (isset($this->config['map']['autofill']['on'])) {
            return $this->config['map']['autofill']['on'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'map-autofill-on'));
    }






    public function get_baloon_dimentions()
    {
        if (isset($this->config['dimentions']['ballon'])) {
            return $this->config['dimentions']['ballon'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-ballon'));
    }


    public function is_all_can_add_placemarks()
    {
        if (isset($this->config['security']['all_can_add_placemarks'])) {
            return $this->config['security']['all_can_add_placemarks'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'security-all_can_add_placemarks'));
    }


    public function get_categories_photo_initial_width()
    {
        if (isset($this->config['dimentions']['categories_photo_initial_width'])) {
            return $this->config['dimentions']['categories_photo_initial_width'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-categories_photo_initial_width'));
    }


    public function get_max_map_load_size()
    {
        if (isset($this->config['generic']['max_map_load_size'])) {
            return $this->config['generic']['max_map_load_size'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_map_load_size'));
    }


    public function get_max_random_articles()
    {
        if (isset($this->config['generic']['max_random_articles'])) {
            return $this->config['generic']['max_random_articles'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_random_articles'));
    }

    public function get_max_last_country_articles()
    {
        if (isset($this->config['generic']['max_last_country_articles'])) {
            return $this->config['generic']['max_last_country_articles'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_last_country_articles'));
    }

    public function get_max_last_main_page_articles()
    {
        if (isset($this->config['generic']['max_last_main_page_articles'])) {
            return $this->config['generic']['max_last_main_page_articles'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-max_last_main_page_articles'));
    }

    public function get_categories_photo_initial_height()
    {
        if (isset($this->config['dimentions']['categories_photo_initial_height'])) {
            return $this->config['dimentions']['categories_photo_initial_height'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'dimentions-categories_photo_initial_height'));
    }


    public function get_seo_keywords_main()
    {
        if (isset($this->config['seo']['keywords']['main'])) {
            return $this->config['seo']['keywords']['main'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'seo-keywords-main'));
    }


    public function is_add_category_photo_as_first_in_placemark_view()
    {
        if (isset($this->config['categories']['generic']['add_category_photo_as_first_in_placemark_view'])) {
            return $this->config['categories']['generic']['add_category_photo_as_first_in_placemark_view'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'categories-generic-add_category_photo_as_first_in_placemark_view'));
    }


    public function is_show_main_pages()
    {
        if (isset($this->config['pages']['main'])) {
            return $this->config['pages']['main'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'pages-main'));
    }


    public function is_show_catalog_pages()
    {
        if (isset($this->config['pages']['catalog'])) {
            return $this->config['pages']['catalog'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'pages-catalog'));
    }


    public function is_show_search_pages()
    {
        if (isset($this->config['pages']['search'])) {
            return $this->config['pages']['search'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'pages-search'));
    }



    public function is_show_article_pages()
    {
        if (isset($this->config['pages']['article'])) {
            return $this->config['pages']['article'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'pages-article'));
    }




    public function is_use_titles()
    {
        if (isset($this->config['generic']['use_titles'])) {
            return $this->config['generic']['use_titles'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-use_titles'));
    }


    public function get_frontend_path()
    {
        return $this->path . 'frontend' . MY_DS;
    }

    /*
     * Вернуть путь до блоков сервиса
     *
     * @return string
     */
    public function get_blocks_path()
    {
        return $this->path . 'blocks' . MY_DS;
    }


    public function is_photo_by_category($photo)
    {

        foreach ($this->get_categories_codes() as $category) {

            if ($photo === $category['code'] . '.jpg') {
                return true;
            }
        }
        return false;
    }


    public function is_show_relevant_placemarks()
    {
        if (isset($this->config['generic']['show_relevant_placemarks'])) {
            return $this->config['generic']['show_relevant_placemarks'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-show_relevant_placemarks'));
    }


    public function is_show_another_placemarks()
    {
        if (isset($this->config['generic']['show_another_placemarks'])) {
            return $this->config['generic']['show_another_placemarks'];
        }
        self::concrete_error(array(ERROR_SERVICE_CONFIG_ABSENT, 'generic-show_another_placemarks'));
    }
}

//Пример: self::get_module(MY_MODULE_NAME_SERVICE)->get_blocks_path();

