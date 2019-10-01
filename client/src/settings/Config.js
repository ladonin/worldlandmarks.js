/*
 * File src/settings/Config.js
 * import Config from 'src/settings/Config';
 */

import LandmarksConfig from 'src/../../server/common/services/landmarks/settings/Config';
import LandmarksLanguageEn from 'src/../../server/common/services/landmarks/language/En';
import LandmarksLanguageRu from 'src/../../server/common/services/landmarks/language/Ru';
import Service from 'src/modules/Service';

import Consts from 'src/settings/Constants';


let _config = {
    [Consts.SERVICE_LANDMARKS]: LandmarksConfig
};
let _languages = {
   [Consts.SERVICE_LANDMARKS]: {
       [Consts.LANGUAGE_RU]:LandmarksLanguageRu,
       [Consts.LANGUAGE_EN]:LandmarksLanguageEn
   }
};

export default {
        apiServer: {
            socketUrl: 'http://192.168.56.1:3001'
        },
        getServiceConfig:()=>_config[Service.getName()],
        getText:(val)=> _languages[Service.getName()][val]
    }



        /*
















    'generic': {
        'site_name': Consts.SITE_NAME,
        'need_photos_for_placemarks': true,
        'use_titles': true,
        'show_relevant_placemarks': true,
        'show_another_placemarks': true,
        'max_map_load_size': 90, // В координатах (широты, долготы)
        'max_random_articles': 5,
        'max_last_country_articles': 5,
        'max_last_main_page_articles': 5,
    },
    'map': {//фоновая подгрузка меток на карту
        'autofill': {
            'on': true, //вкл/выкл
            'individual_limit': 30, //сколько меток за раз
            'period': 1, //период загрузки пачек меток на карту в секундах
        }
    },
    'ftp': {//ftp подключения
        [Consts.FTP_DEFAULT_SERVER_NAME]: {
            'url': '140706.selcdn.ru',
            'user_name': '40679',
            'user_password': 'XrhbDnXv',
            'root_directory': 'mapstore',
        }
    },
    'languages': [
        {
            'code': Consts.LANGUAGE_RU,
            'title': 'Русский',
        },
        {
            'code': Consts.LANGUAGE_EN,
            'title': 'English',
        }
        //внимание! если добавляем новый язык, то нужно сразу прогнать все метки по нему через гугл сервис, иначе в режиме этого языка адреса не будут отображаться, поскольку они формируются из записей в базе по конкретному языку
        //делается это в консоли:
        //# php shell/add_new_language_in_geolocate.php landmarks ru - для русского языка
    ],
    'email': [
        {
            'from': 'info@world-landmarks.ru',
            'name': 'World Landmarks',
        }
    ],
    'pages': {
        'catalog': true,
        'main': true,
        'map': true,
        'search': true,
        'article': true,
    },
    'security': {
        'all_can_add_placemarks': false,
    },
    'categories': {
        'categories_add_new_point_form_options': [
            ['none', 'form/map_new_point/category/' + Consts.NONE_CATEGORY_CODE, 'selected'],
            [0, 'form/map_new_point/category/0'],
            [1, 'form/map_new_point/category/1'],
            [2, 'form/map_new_point/category/2'],
            [24, 'form/map_new_point/category/24']
            [26, 'form/map_new_point/category/26']
            [4, 'form/map_new_point/category/4']
            [5, 'form/map_new_point/category/5']
            [6, 'form/map_new_point/category/6']
            [7, 'form/map_new_point/category/7']
            [8, 'form/map_new_point/category/8']
            [28, 'form/map_new_point/category/28']
            [9, 'form/map_new_point/category/9']
            [29, 'form/map_new_point/category/29']
            [30, 'form/map_new_point/category/30']
            [11, 'form/map_new_point/category/11']
            [25, 'form/map_new_point/category/25']
            [10, 'form/map_new_point/category/10']
            [12, 'form/map_new_point/category/12']
            [13, 'form/map_new_point/category/13']
            [14, 'form/map_new_point/category/14']
            [15, 'form/map_new_point/category/15']
            [16, 'form/map_new_point/category/16']
            [17, 'form/map_new_point/category/17']
            [18, 'form/map_new_point/category/18']
            [19, 'form/map_new_point/category/19']
            [20, 'form/map_new_point/category/20']
            [21, 'form/map_new_point/category/21']
            [23, 'form/map_new_point/category/23']
            [22, 'form/map_new_point/category/22']
            [27, 'form/map_new_point/category/27']
            [3, 'form/map_new_point/category/3']
        ],
        'category_codes': [
            {
                'code': 'other',
                'id': 0},
            {
                'code': 'castle',
                'id': 1},
            {
                'code': 'estate',
                'id': 2},
            {
                'code': 'ruin',
                'id': 24},
            {
                'code': 'fortress',
                'id': 26},
            {
                'code': 'historical_monument',
                'id': 4},
            {
                'code': 'architectural_complex',
                'id': 5},
            {
                'code': 'church',
                'id': 6},
            {
                'code': 'mosque',
                'id': 7},
            {
                'code': 'synagogue',
                'id': 8},
            {
                'code': 'buddhist_temple',
                'id': 28},
            {
                'code': 'museum',
                'id': 9},
            {
                'code': 'university',
                'id': 29},
            {
                'code': 'library',
                'id': 30},
            {
                'code': 'theatre',
                'id': 11},
            {
                'code': 'fountain',
                'id': 25},
            {
                'code': 'monument',
                'id': 10},
            {
                'code': 'zoo',
                'id': 12},
            {
                'code': 'circus',
                'id': 13},
            {
                'code': 'industrial',
                'id': 14},
            {
                'code': 'garden',
                'id': 15},
            {
                'code': 'historical_place',
                'id': 16},
            {
                'code': 'interest_place',
                'id': 17},
            {
                'code': 'mountain',
                'id': 18},
            {
                'code': 'volcano',
                'id': 19},
            {
                'code': 'cave',
                'id': 20},
            {
                'code': 'pond',
                'id': 21},
            {
                'code': 'spring',
                'id': 23},
            {
                'code': 'waterfall',
                'id': 22},
            {
                'code': 'street',
                'id': 27},
            {
                'code': 'abandoned_building',
                'id': 3},
        ],
        'generic': {
            'add_category_photo_as_first_in_placemark_view': false
        }
    },
    'dimentions': {
        'ballon': {
            'width': 27,
            'height': 40,
            'top': -13,
            'left': -40,
        },
        'categories_photo_initial_width': 900,
        'categories_photo_initial_height': 675,
    },
    'text_form': {
        'auto_process_links': {
            'free': false,
            'admin': true,
        },
        'tags': [
            {
                'code': Consts.FORM_TEXT_TAG_CODE_A,
                'open_tag': '[a=link]',
                'close_tag': '[/a]',
                'title': 'text_form/tags/a/title',
                'free': false
            },
            {
                'code': Consts.FORM_TEXT_TAG_CODE_P,
                'open_tag': '\n[p]',
                'close_tag': '[/p]\n',
                'title': 'text_form/tags/p/title',
                'free': true
            },
            {
                'code': Consts.FORM_TEXT_TAG_CODE_B,
                'open_tag': '[b]',
                'close_tag': '[/b]',
                'title': 'text_form/tags/b/title',
                'free': true
            },
            {
                'code': Consts.FORM_TEXT_TAG_CODE_STRONG,
                'open_tag': '[strong]',
                'close_tag': '[/strong]',
                'title': 'text_form/tags/strong/title',
                'free': false
            },
            {
                'code': Consts.FORM_TEXT_TAG_CODE_IMAGE_ADVANCED,
                'open_tag': '[img url=\"x\" style=\"x\"]',
                'close_tag': '',
                'title': 'text_form/tags/img/title',
                'free': false
            }
        ]
    }
};
*/