<?php
/*
 * Общий конфигурационный файл
 */
return array(

    ########################
    #
    # Системные настройки
    #
    ########################

    //Режим отладки
    'debug' => 0,
    //Вкл/откл логирование ошибок
    'log' => array(
        'on' => 1
    ),

    'files_upload_storage' => require(MY_APPLICATION_DIR . 'config' . MY_DS . 'ignore' . MY_DS . 'upload.php'),//куда заливаем фотки

    //Контроллеры, которые вызываются в следующих ситуациях
    'controllers' => array(
        //Контроллер, на который происходит редирект в случае одной из следующих ошибок,
        //ошибки могут быть вызваны вручную из любого места
        //Пример:
        #    self::set_error(MY_ERROR_USER_NOT_VERIFICATED);
        'errors' => array(
            //MY_ERROR_USER_NOT_VERIFICATED: "пользователь не зарегистрирован"
            MY_ERROR_USER_NOT_VERIFICATED => MY_CONTROLLER_NAME_MAP,
        ),
        // Если контроллер не указан в URL
        'default' => MY_CONTROLLER_NAME_MAP,
    ),
    //Операции, которые вызываются до или после выполнения контроллера
    'operations' => array(
        // До
        'before' => array(
            array(
                'class' => 'components\app\user',
                'method' => 'authentication',
            ),
            array(
                'class' => 'components\app\visitors_analyze',
                'method' => 'identify',
            ),
            array(
                'class' => 'components\app\language',
                'method' => 'set_language',
            ),
        ),
        // После
        'after' => array(
        /*
            array(
                'class'         =>  '',
                'method'        =>  '',
            )
        */
        ),
    ),

    //Подключение к БД, выбрано MySQL
    'db' => require(MY_APPLICATION_DIR . 'config' . MY_DS . 'ignore' . MY_DS . 'mysql.php'),

    //Настройка шаблонов страниц -  contoler/action => layout file
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

    //Класс языка сайта
    'language' => array(
        'class' => '\components\app\language'
    ),

    //Настройки куков
    'cookies' => array(
        //Дефолтное время жизни
        'lifetime' => 3600 * 24 * 21,
    ),
    //Настройка GET переменных
    'get_vars' => array(
        // Примечание - правило 'not_empty' означает : если найден в GET запросе - то должен не быть пустым
        // Все переменные также имеют правило not required

        //Системные пепременные
        MY_VAR_CATEGORY_SYSTEM => array(
            'var1' => array(
                'rules' => array('varname', 'max' => 50, 'not_empty'),
            ),
            'var2' => array(
                'rules' => array('varname', 'max' => 50, 'not_empty'),
            ),
            'var3' => array(
                'rules' => array('varname', 'max' => 50, 'not_empty'),
            ),
            'var4' => array(
                'rules' => array('varname', 'max' => 50, 'not_empty'),
            ),
        ),
        //Пользовательские переменные
        MY_VAR_CATEGORY_USER => array(
            MY_SERVICE_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
            MY_ID_VAR_NAME => array(
                'rules' => array('numeric', 'not_empty'),
            ),
            MY_CATALOG_CATEGORY_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
            MY_CATALOG_COUNTRY_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
            MY_CATALOG_STATE_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
            MY_CATALOG_PAGE_NUMBER_VAR_NAME => array(
                'rules' => array('numeric', 'not_empty'),
            ),
            MY_SPAM_TRANSFERED_EMAIL_ID_VAR_NAME => array(
                'rules' => array('numeric', 'not_empty'),
            ),
            MY_SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME => array(
                'rules' => array('numeric', 'not_empty'),
            ),
            MY_SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME => array(
                'rules' => array('numeric', 'not_empty'),
            ),
            MY_LANGUAGE_CODE_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
            MY_ADMIN_PASSWORD_VAR_NAME => array(
                'rules' => array('get_query_string_var_value', 'not_empty'),
            ),
        ),
    ),


    ########################
    #
    # Пользовательские настройки
    #
    ########################

    // Автоматическая генерация пути
    //Пример:
    #    self::get_path('get_placemarks_by_coords')
    'paths' => array(
        'upload_file' => array(
            'controller' => 'map',
            'action' => 'ajax_upload_file_to_temp'
        ),
        'get_placemarks_by_coords' => array(
            'controller' => 'map',
            'action' => 'ajax_get_placemarks_by_coords'
        ),
        'fill_placemarks_on_map' => array(
            'controller' => 'map',
            'action' => 'ajax_fill_placemarks_on_map'
        ),
        'get_placemarks_by_ids' => array(
            'controller' => 'map',
            'action' => 'ajax_get_placemarks_by_ids'
        ),
        'get_placemark_content_by_id' => array(
            'controller' => 'map',
            'action' => 'ajax_get_placemark_content_by_id'
        ),
        'get_placemarks_list' => array(
            'controller' => 'catalog',
            'action' => 'ajax_get_placemarks_list'
        ),
        'delete_placemark' => array(
            'controller' => 'map',
            'action' => 'ajax_delete_point'
        ),
        'set_search_rules' => array(
            'controller' => 'catalog',
            'action' => 'ajax_set_search_rules'
        ),
        'set_site_language' => array(
            'controller' => 'map',
            'action' => 'ajax_set_site_language'
        ),
        /*
          'get_placemark_data' => array(
          'controller' => 'map',
          'action' => 'ajax_get_placemark_data'
          ),
         */
    ),

    //Допущения
    'allows' => require(MY_APPLICATION_DIR . 'config' . MY_DS . 'allows.php'),

    //Настройки размеров экрана
    'dimentions' => array(
        //Мобильная версия
        'mobile' => array(
            'sublist_images' => array(
                'width' => 90,
                'height' => 90,
            )
        ),
        //Десктопная версия
        'desctop' => array(
            'sublist_images' => array(
                'width' => 184,
                'height' => 148,
            )
        )
    ),
    //Вспомогательные переменные - можно использовать вместо констант
    'help_vars' => array(
    ),
);

