import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import consts from 'src/settings/Constants';


            //разрешаем выводить данные
            var block = true;
            //номер страницы для вывода
            var id_next = 0;
            var block_selector;
            var ajax_url;
            var correction = 200;
            var is_search = 0;
            var photo_width_desctop = 340;
            var photo_height_desctop = 260;

            // подготавливаем просмотр метки
            var get_placemarks = function () {
                $.ajax({
                    type: 'POST',
                    data: {id: id_next, is_search: is_search},
                    url: ajax_url,
                    success: function (data) {

                        var result = '';
                        try {
                            var ajax_result = JSON.parse(data);
                            if (ajax_result['status'] === consts.MY_AJAX_SUCCESS_CODE) {

                                if (typeof (ajax_result['data']) === 'object') {

                                    var id_current = 0;
                                    var text;
                                    // мы не знаем какой ключ придет, поэтому для одинарного массива делаем перебрку
                                    $.each(ajax_result['data'], function (index, value) {
                                        text = '';
                                        //value['id']
                                        // берем одну из фоток метки
                                        var photos_count = value['photos'].length;
                                        var photo = value['photos'][getRandomInt(0, photos_count - 1)];
                                        if ((value['state_code'] === consts.MY_AJAX_UNDEFINED) || (!value['state_code'])) {
                                            var state_url = '';
                                        } else {
                                            var state_url = '/' + value['state_code'];
                                        }

                                        var url_placemark = process.env.REACT_APP_DOMAIN+'/catalog/' + value['country_code'] + state_url + '/' + value['id'];
                                        var categories = '<img src="' + my_placemark_category_viewer.get_category_image_url(value['category']) + '" onclick="category_info_show(\'' + value['category'] + '\');">';
                                        var subcategories = my_placemark_object.get_subcategories(value['subcategories']);
                                        $.each(subcategories, function (id, subcategory) {
                                            categories += '<img src="' + my_placemark_category_viewer.get_category_image_url(subcategory) + '" onclick="category_info_show(\'' + subcategory + '\');">';
                                        });
                                        if (isMobile) {
                                            var image_prefix = my_image_dimensions.get_prefix($(window).width(), 0);
                                            var photo_insert = '<img src="' + photo['dir'] + image_prefix + photo['name'] + '" width="' + $(window).width() + 'px">';
                                            var url_target = '';
                                            var js_location = 'javascript:window.location=\'' + url_placemark + '\'';
                                            var catalog_scroll_placemark_row_content_width = '';
                                            var catalog_scroll_placemark_row_photo_width = '';
                                        } else {
                                            var image_prefix = "6_"; // с запасом при кропе
                                            var photo_insert = view_cropped_photo(photo['dir'] + image_prefix + photo['name'], photo['width'], photo['height'], photo_width_desctop, photo_height_desctop);
                                            var url_target = 'target=\'_blank\'';
                                            var js_location = 'javascript:window.open(\'' + url_placemark + '\')';
                                            var catalog_scroll_placemark_row_content_width =<?php echo(MY_DIMENTIONS_DESCTOP_CONTENT_WIDTH); ?> - photo_width_desctop - 20;
                                            var catalog_scroll_placemark_row_photo_width = photo_width_desctop;
                                        }

                                        text += '<div class="catalog_scroll_placemark_row">\n\
                                                    <div class="catalog_scroll_placemark_row_photo"';

                                        if (catalog_scroll_placemark_row_photo_width) {
                                            text += ' style="width:' + catalog_scroll_placemark_row_photo_width + 'px"';
                                        }

                                        text += ' onclick="' + js_location + '">\n\
                                                        ' + photo_insert + '\n\
                                                    </div>\n\
                                                    <div class="catalog_scroll_placemark_row_content"';







                                        if (catalog_scroll_placemark_row_content_width) {
                                            text += ' style="width:' + catalog_scroll_placemark_row_content_width + 'px"';
                                        }

                                        text += '>';

<?php if (self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()): ?>
                                            text += '<div class="catalog_scroll_placemark_row_content_title"><a href=\'' + url_placemark + '\' ' + url_target + '>' + value['title'] + '</a></div>';
<?php endif; ?>
                                        text += '<div class="catalog_scroll_placemark_row_content_description">\n\
                                                            <div class="catalog_scroll_placemark_row_content_comment">' + value['comment'] + '</div>\n\
                                                            <div class="catalog_scroll_placemark_row_content_adress"><b><?php echo(my_pass_through(@self::trace('map/placemark/adress/text'))); ?></b>' + value['formatted_address'] + '</div>\n\
                                                            <div class="catalog_scroll_placemark_row_content_category">\n\
                                                                ' + categories + '\n\
                                                            </div>\n\
                                                            <div class="clear"></div>\n\
<div class="catalog_scroll_placemark_row_content_map_lnk"><a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_MAP . '/'); ?>' + value['id'] + '" ' + url_target + '><img src="/img/map_240.png" style="margin-left:1px;display: inline-block;width: 24px;/*! padding: 0; */vertical-align: bottom; margin-right:5px;"><?php echo(my_pass_through(@self::trace('catalog/placemark/link_to_map/text'))); ?></a></div>\n\
                                                        </div>\n\
                                                    </div>\n\
                                                    <div class="clear"></div>\n\
                                                    <div class="line_under"></div>\n\
                                                </div>\n\
                                        ';
                                        result = text + result;

                                        if (!id_current) {
                                            id_current = index;
                                        }
                                    });
                                    var is_retry = false;
                                    if (id_next == id_current) {
                                        is_retry = true; // обычно случается когда браузер после перезагрузки страницы автоматом раньше всех наших действий начинает скроллить до старой прокрутки, делаем это во избежание дублирования результатов скроллинга
                                    }


                            if (!id_current && !id_next){// когда еще ничего не подгружено, но и ничего не пришло
                                my_get_message('<?php echo(my_pass_through(@self::trace('warning/search/empty_result'))); ?>', 'warning');
                            }

                                    id_next = id_current;
                                }
                            }
                        } catch (error) {
                            //my_get_message('<?php echo(my_pass_through(@self::trace('errors/system'))); ?>', 'error');
                        }
                        //alert(id_next);

                        if (result == '') {
                            block = false;
                        } else {
                            if (is_retry == false) {
                                $(block_selector).append(result);
                            }
                            block = true;
                        }
                    }
                });
            }










export default {
                init: function (selector, url, width, height) {
                    block_selector = selector;
                    ajax_url = url;
                    if ((typeof (width) !== 'undefined') && (typeof (height) !== 'undefined')) {
                        photo_width_desctop = width;
                        photo_height_desctop = height;
                    }


                    //скроллинг
                    $(window).scroll(function () {
                        if ($(window).height() + $(window).scrollTop() + correction >= $(document).height() && block) {
                            block = false;
                            get_placemarks();
                        }
                    });
                },
                get_placemarks: function () {

                    get_placemarks();
                },
                clear: function () {
                    $(block_selector).html('');
                    id_next = 0;
                },
                set_is_search: function () {
                    is_search = 1;
                }
            }