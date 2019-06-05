<?php
return array(
    'generic' => array(
        'site_name' => 'world-landmarks.ru',
        'need_photos_for_placemarks' => true,
        'use_titles' => true,
        'show_relevant_placemarks' => true,
        'show_another_placemarks' => true,
        'max_map_load_size' => 90, // В координатах (широты, долготы)
        'max_random_articles' => 5,
        'max_last_country_articles' => 5,
        'max_last_main_page_articles' => 5,
    ),
    'map' => array(//фоновая подгрузка меток на карту
        'autofill' => array(
            'on' => true,//вкл/выкл
            'individual_limit' => 30,//сколько меток за раз
            'period' => 1,//период загрузки пачек меток на карту в секундах
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
            'title' => 'Русский',
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
            'from' => 'info@world-landmarks.ru',
            'name' => 'World Landmarks',
        )
    ),
    'pages' => array(
        'catalog' => true,
        'main' => true,
        'map' => true,
        'search' => true,
        'article' => true,
    ),
    'security' => array(
        'all_can_add_placemarks' => false,
    ),
    'categories' => array(
        'categories_add_new_point_form_options' => array(
            array('none', 'form/map_new_point/category/' . MY_NONE_CATEGORY_CODE, 'selected'),
            array(0, 'form/map_new_point/category/0'),
            array(1, 'form/map_new_point/category/1'),
            array(2, 'form/map_new_point/category/2'),
            array(24, 'form/map_new_point/category/24'),
            array(26, 'form/map_new_point/category/26'),
            array(4, 'form/map_new_point/category/4'),
            array(5, 'form/map_new_point/category/5'),
            array(6, 'form/map_new_point/category/6'),
            array(7, 'form/map_new_point/category/7'),
            array(8, 'form/map_new_point/category/8'),
            array(28, 'form/map_new_point/category/28'),
            array(9, 'form/map_new_point/category/9'),
            array(29, 'form/map_new_point/category/29'),
            array(30, 'form/map_new_point/category/30'),
            array(11, 'form/map_new_point/category/11'),
            array(25, 'form/map_new_point/category/25'),
            array(10, 'form/map_new_point/category/10'),
            array(12, 'form/map_new_point/category/12'),
            array(13, 'form/map_new_point/category/13'),
            array(14, 'form/map_new_point/category/14'),
            array(15, 'form/map_new_point/category/15'),
            array(16, 'form/map_new_point/category/16'),
            array(17, 'form/map_new_point/category/17'),
            array(18, 'form/map_new_point/category/18'),
            array(19, 'form/map_new_point/category/19'),
            array(20, 'form/map_new_point/category/20'),
            array(21, 'form/map_new_point/category/21'),
            array(23, 'form/map_new_point/category/23'),
            array(22, 'form/map_new_point/category/22'),
            array(27, 'form/map_new_point/category/27'),
            array(3, 'form/map_new_point/category/3'),
        ),
        'categories_codes' => array(
            array(
                'code' => 'other',
                'id' => 0),
            array(
                'code' => 'castle',
                'id' => 1),
            array(
                'code' => 'estate',
                'id' => 2),
            array(
                'code' => 'ruin',
                'id' => 24),
            array(
                'code' => 'fortress',
                'id' => 26),
            array(
                'code' => 'historical_monument',
                'id' => 4),
            array(
                'code' => 'architectural_complex',
                'id' => 5),
            array(
                'code' => 'church',
                'id' => 6),
            array(
                'code' => 'mosque',
                'id' => 7),
            array(
                'code' => 'synagogue',
                'id' => 8),
            array(
                'code' => 'buddhist_temple',
                'id' => 28),
            array(
                'code' => 'museum',
                'id' => 9),
            array(
                'code' => 'university',
                'id' => 29),
            array(
                'code' => 'library',
                'id' => 30),
            array(
                'code' => 'theatre',
                'id' => 11),
            array(
                'code' => 'fountain',
                'id' => 25),
            array(
                'code' => 'monument',
                'id' => 10),
            array(
                'code' => 'zoo',
                'id' => 12),
            array(
                'code' => 'circus',
                'id' => 13),
            array(
                'code' => 'industrial',
                'id' => 14),
            array(
                'code' => 'garden',
                'id' => 15),
            array(
                'code' => 'historical_place',
                'id' => 16),
            array(
                'code' => 'interest_place',
                'id' => 17),
            array(
                'code' => 'mountain',
                'id' => 18),
            array(
                'code' => 'volcano',
                'id' => 19),
            array(
                'code' => 'cave',
                'id' => 20),
            array(
                'code' => 'pond',
                'id' => 21),
            array(
                'code' => 'spring',
                'id' => 23),
            array(
                'code' => 'waterfall',
                'id' => 22),
            array(
                'code' => 'street',
                'id' => 27),
            array(
                'code' => 'abandoned_building',
                'id' => 3),
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
            ),
            array(
                'code' => MY_FORM_TEXT_TAG_CODE_IMAGE_ADVANCED,
                'open_tag' => '[img url=\"x\" style=\"x\"]',
                'close_tag' => '',
                'title' => 'text_form/tags/img/title',
                'free' => false
            )
        )
    )
);
