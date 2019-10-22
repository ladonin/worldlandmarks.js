/*
 * File server/common/settings/Restrictions.js
 *
 * Application restrinctions
 */

module.exports = {
    'mime_types_for_upload':{
        'image/png':'png',
        'image/jpeg':'jpeg',
        'image/gif':'gif',
    },
    'sizes':{
        'images':{
            'widths':{
                //permanent
                1:0,
                // mobile
                2:104,
                3:144,
                4:184,

                5:340,
                6:500,

                //7:820,
                // desctop
                8:230, //list
                9:670, //content cluster
                10:900, //content
                11:1500,
            },
        }
    },
    'max_upload_files_per_point':20,
    'max_rows_per_scroll_load':10,
    'max_upload_files_size':1149600 * 12,
    'max_cropped_text_length':210,
    'max_cropped_seo_description_length':200,
    'max_items_at_sublist':10,
    'max_pager_rows':20,
    'desctop_content_width':900
};