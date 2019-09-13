<?php
return array(
    'generic' => array(
        'site_name' => 'routestore.ru',
        'need_photos_for_placemarks' => false,
        'use_titles' => false,
        'show_relevant_placemarks' => false,
        'show_another_placemarks' => false,
        'max_map_load_size' => 90, // В координатах (широты, долготы)
        'max_random_articles' => 5,
        'max_last_country_articles' => 5,
        'max_last_main_page_articles' => 5,
    ),
    'map' => array(//фоновая подгрузка меток на карту
        'autofill' => array(
            'on' => true, //вкл/выкл
            'individual_limit' => 50, //сколько меток за раз
            'period' => 3, //период загрузки пачек меток на карту в секундах
        )
    ),
    'ftp' => array(//ftp подключения
        MY_FTP_DEFAULT_SERVER_NAME => array(
            'url' => '140706.selcdn.ru',
            'user_name' => '40679',
            'user_password' => 'XrhbDnXv',
            'root_directory' => 'mapstore',
        )
    ),
    'languages' => array(
        array(
            'code' => MY_LANGUAGE_RU,
            'title' => 'Русский'
        ),
        array(
            'code' => MY_LANGUAGE_EN,
            'title' => 'English',
        )
        //внимание! если добавляем новый язык, то нужно сразу прогнать все метки по нему через гугл сервис, иначе в режиме этого языка адреса не будут отображаться, поскольку они формируются из записей в базе по конкретному языку
        //делается это в консоли:
        //# php shell/add_new_language_in_geolocate.php landmarks ru - для русского языка
    ),
    'email' => array(
        1 => array(
            'from' => 'routestore.ru',
            'name' => 'RouteStore',
        )
    ),
    'pages' => array(
        'catalog' => false,
        'main' => false,
        'map' => true,
        'search' => false,
        'article' => false,
    ),
    'security' => array(
        'all_can_add_placemarks' => true,
    ),
    'categories' => array(
        'categories_add_new_point_form_options' => array(
            array('none', 'form/map_new_point/category/' . MY_NONE_CATEGORY_CODE, 'selected'),
            array(0, 'form/map_new_point/category/0'),
            array(1, 'form/map_new_point/category/1'),
            array(2, 'form/map_new_point/category/2'),
            array(3, 'form/map_new_point/category/3'),
            array(4, 'form/map_new_point/category/4'),
        ),
        'categories_codes' => array(
            array(
                'code' => 'none',
                'id' => 0),
            array(
                'code' => 'worst',
                'id' => 1),
            array(
                'code' => 'bad',
                'id' => 2),
            array(
                'code' => 'good',
                'id' => 3),
            array(
                'code' => 'excellent',
                'id' => 4),
        ),
        'generic' => array(
            'add_category_photo_as_first_in_placemark_view' => false
        )
    ),
    'dimentions' => array(
        'ballon' => array(
            'width' => 27,
            'height' => 40,
            'top' => -13,
            'left' => -40,
        ),
        'categories_photo_initial_width' => 900,
        'categories_photo_initial_height' => 675,
    ),
    'text_form' => array(
        'auto_process_links' => array(
            'free' => false,
            'admin' => true,
        ),
        'tags' => array(
            array(
                'code' => MY_FORM_TEXT_TAG_CODE_A,
                'open_tag' => '[a=link]',
                'close_tag' => '[/a]',
                'title' => 'text_form/tags/a/title',
                'free' => false
            ),
            array(
                'code' => MY_FORM_TEXT_TAG_CODE_P,
                'open_tag' => '\n[p]',
                'close_tag' => '[/p]\n',
                'title' => 'text_form/tags/p/title',
                'free' => true
            ),
            array(
                'code' => MY_FORM_TEXT_TAG_CODE_B,
                'open_tag' => '[b]',
                'close_tag' => '[/b]',
                'title' => 'text_form/tags/b/title',
                'free' => true
            ),
            array(
                'code' => MY_FORM_TEXT_TAG_CODE_STRONG,
                'open_tag' => '[strong]',
                'close_tag' => '[/strong]',
                'title' => 'text_form/tags/strong/title',
                'free' => false
            )
        )
    )
);
