/*
 * File application/common/services/landmarks/settings/Config.js
 * const Config = require('application/common/services/landmarks/settings/Config');
 *
 * Specific service config
 */

const Consts = require('../../../settings/Constants');


module.exports = {
    map: {
        // Background loading placemarks on map
        autofill: {
            on: true,
            // How much placemarks at once
            individual_limit: 30,
            // Period of loading placemark bunches in seconds
            period: 1,
        }
    },
    security: {
        all_can_add_placemarks: false,
    },
    // Map ballons settings
    dimentions: {
        ballon: {
            width: 27,
            height: 40,
            top: -13,
            left: -40,
        },
        categories_photo_initial_width: 900,
        categories_photo_initial_height: 675,
    },
    // Text formatting settings
    text_form: {
        auto_process_links: {
            free: false,
            admin: true,
        },
        tags: [
            {
                code: Consts.FORM_TEXT_TAG_CODE_A,
                open_tag: '[a=link]',
                close_tag: '[/a]',
                title: 'text_form/tags/a/title',
                free: false
            },
            {
                code: Consts.FORM_TEXT_TAG_CODE_P,
                open_tag: '\n[p]',
                close_tag: '[/p]\n',
                title: 'text_form/tags/p/title',
                free: true
            },
            {
                code: Consts.FORM_TEXT_TAG_CODE_B,
                open_tag: '[b]',
                close_tag: '[/b]',
                title: 'text_form/tags/b/title',
                free: true
            },
            {
                code: Consts.FORM_TEXT_TAG_CODE_STRONG,
                open_tag: '[strong]',
                close_tag: '[/strong]',
                title: 'text_form/tags/strong/title',
                free: false
            },
            {
                code: Consts.FORM_TEXT_TAG_CODE_IMAGE_ADVANCED,
                open_tag: '[img url=\"x\" style=\"x\"]',
                close_tag: '',
                title: 'text_form/tags/img/title',
                free: false
            }
        ]
    },
    pages: {
        catalog: true,
        main: true,
        map: true,
        search: true,
        article: true,
    },
    categories: {

        //#???????????????????????????? - то, что возможно не нужно
        /*
         // For create/update placemark
         categories_add_new_point_form_options: [
         ['none', 'form/map_new_point/category/' + Consts.NONE_CATEGORY_CODE, 'selected'],

         [0, 'form/map_new_point/category/0'],
         [1, 'form/map_new_point/category/1'],
         [2, 'form/map_new_point/category/2'],
         [24, 'form/map_new_point/category/24'],
         [26, 'form/map_new_point/category/26'],
         [4, 'form/map_new_point/category/4'],
         [5, 'form/map_new_point/category/5'],
         [6, 'form/map_new_point/category/6'],
         [7, 'form/map_new_point/category/7'],
         [8, 'form/map_new_point/category/8'],
         [28, 'form/map_new_point/category/28'],
         [9, 'form/map_new_point/category/9'],
         [29, 'form/map_new_point/category/29'],
         [30, 'form/map_new_point/category/30'],
         [11, 'form/map_new_point/category/11'],
         [25, 'form/map_new_point/category/25'],
         [10, 'form/map_new_point/category/10'],
         [12, 'form/map_new_point/category/12'],
         [13, 'form/map_new_point/category/13'],
         [14, 'form/map_new_point/category/14'],
         [15, 'form/map_new_point/category/15'],
         [16, 'form/map_new_point/category/16'],
         [17, 'form/map_new_point/category/17'],
         [18, 'form/map_new_point/category/18'],
         [19, 'form/map_new_point/category/19'],
         [20, 'form/map_new_point/category/20'],
         [21, 'form/map_new_point/category/21'],
         [23, 'form/map_new_point/category/23'],
         [22, 'form/map_new_point/category/22'],
         [27, 'form/map_new_point/category/27'],
         [3, 'form/map_new_point/category/3'],
         ],*/
        category_codes: [
            {
                code: 'other',
                id: 0},
            {
                code: 'castle',
                id: 1},
            {
                code: 'estate',
                id: 2},
            {
                code: 'ruin',
                id: 24},
            {
                code: 'fortress',
                id: 26},
            {
                code: 'historical_monument',
                id: 4},
            {
                code: 'architectural_complex',
                id: 5},
            {
                code: 'church',
                id: 6},
            {
                code: 'mosque',
                id: 7},
            {
                code: 'synagogue',
                id: 8},
            {
                code: 'buddhist_temple',
                id: 28},
            {
                code: 'museum',
                id: 9},
            {
                code: 'university',
                id: 29},
            {
                code: 'library',
                id: 30},
            {
                code: 'theatre',
                id: 11},
            {
                code: 'fountain',
                id: 25},
            {
                code: 'monument',
                id: 10},
            {
                code: 'zoo',
                id: 12},
            {
                code: 'circus',
                id: 13},
            {
                code: 'industrial',
                id: 14},
            {
                code: 'garden',
                id: 15},
            {
                code: 'historical_place',
                id: 16},
            {
                code: 'interest_place',
                id: 17},
            {
                code: 'mountain',
                id: 18},
            {
                code: 'volcano',
                id: 19},
            {
                code: 'cave',
                id: 20},
            {
                code: 'pond',
                id: 21},
            {
                code: 'spring',
                id: 23},
            {
                code: 'waterfall',
                id: 22},
            {
                code: 'street',
                id: 27},
            {
                code: 'abandoned_building',
                id: 3},
        ],
        generic: {
            add_category_photo_as_first_in_placemark_view: false
        }
    }
};
