<?php

use \components\app as components;

$config = self::get_config();

$current_map_module = self::get_module(MY_MODULE_NAME_MAP);
$security = \modules\base\Security\Security::get_instance();
$controller = $security->get_controller();
$account_module = self::get_module(MY_MODULE_NAME_ACCOUNT);
//удаляем метки, которые должны игнорить, поскольку карта загрузилась заново и все метки надо загружать снова
$current_map_module->clear_loaded_ids_from_session();
$available_to_change = false;
if ($current_map_module->is_available_to_change()) {
    $available_to_change = true;
}

// анализируем посетилией через внешние ссылки
$visitors_analyze_module = self::get_module(MY_MODULE_NAME_ANALYZE);

$this->trace_block('_models' . MY_DS . 'category_viewer', false, $data);
$this->trace_block('_models' . MY_DS . 'placemark_photos_viewer', false);
?>
<script type="text/javascript">
    $(document).ready(function () {

    my_map_vendor = (function () {





    var filter_category = false;
            var object_name = 'my_map_vendor';
            var link_id = '<?php echo($this->get_get_var(MY_ID_VAR_NAME)); ?>';
            // id метки, на которой остановились в последний раз
            var current_placemark_id;
            //статус что можно делать изменения на карте
            var is_enable_to_change_map_status = false;
            //статус что метка редактируется
            var is_redacted_status = false;
            //var preset_cluster = 'islands#invertedGreenClusterIcons';
            //var preset_cluster_selected = 'islands#invertedRedClusterIcons';
            //var preset_cluster_viewed = 'islands#invertedBlackClusterIcons';
            var device_type = '<?php echo(get_device()); ?>';
            var device_mobile_name = '<?php echo(MY_DEVICE_MOBILE_TYPE_CODE); ?>';
            var device_desctop_name = '<?php echo(MY_DEVICE_DESCTOP_TYPE_CODE); ?>';
            if (device_type === device_mobile_name) {
    var buttons_placemark_viewer_hide_position = '-75px';
            var buttons_new_point_place_at_map_position = '-75px';
            var buttons_placemark_viewer_show_position = '-187px';
            var buttons_new_point_return_to_editor__position = '-150px';
            var zoom_where_am_i = 17;
            var placemark_view_zoom = 16;
            var zoom; // = 14;
    } else {
    var buttons_placemark_viewer_hide_position = '-120px';
            var buttons_new_point_place_at_map_position = '-120px';
            var buttons_placemark_viewer_show_position = '-300px';
            var buttons_new_point_return_to_editor__position = '-240px';
            var zoom_where_am_i = 14;
            var placemark_view_zoom = 17;
            var zoom; // = 12;
    }
        var is_too_big_requested_area = 0;//по умолчанию область маленькая и мы можем подгружать метки по координатам, даже есть это не так, после первого запроса get_by_coords is_too_big_requested_area будет равна верному результату

        //var preset_placemark = 'islands#greenDotIcon';
    //var preset_placemark_selected = 'islands#redDotIcon';
    //var preset_placemark_viewed = 'islands#blackDotIcon';

            // кластер, который открыт в данный момент на карте
            var cluster_opened;
            // метка, которая открыта в данный момент на карте
            var placemark_opened_id;
            var balloon_content_body = 'ожидание действия...';
            var grid_size = 50;
            var buttons_height;
            var cluster_list_image_width;
            var cluster_list_image_height;
            var cluster_list_image_width_max = 220;
            var placemark_height;
            var placemarks = new Object();
            var target_placemark = undefined;
            var map = undefined;
            var clusterer = undefined;
            var window_height = $(window).height();
            var window_width = $(window).width();
            // Selectors:
            // Определяются селекторы, потому что объект еще рано инициализировать, его может попросту еще быть
            //*********************** ->
            var x_add_new_point_selector = '#<?php echo(my_pass_through(@self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT)->get_id('x'))); ?>';
            var y_add_new_point_selector = '#<?php echo(my_pass_through(@self::get_model(MY_MODEL_NAME_FORM_ADD_NEW_POINT)->get_id('y'))); ?>';
            //var toggle_add_new_point_selector = '#toggle_add_new_point';
            var block_add_new_point_selector = '#add_new_point';
            var _placemarkSelector = '#placemark';
            var placemark_buttons_selector = '#placemark_buttons';
            var placemark_buttons_block_selector = '#placemark_buttons_block';
            var placemark_toggle_selector = '#placemark_toggle';
            var placemark_close_selector = '#placemark_close';
            var placemark_add_buttons_selector = '#placemark_add_buttons';
            var placemark_add_set_point_selector = '#placemark_add_set_point';
            var button_image_selector = 'div.icon img';
            var _placemarkBlockSelector = '#placemark_block';
            var placemark_close_side_1_selector = '#placemark_close_side_1';
            var placemark_close_side_2_selector = '#placemark_close_side_2';
            var placemark_buttons_block_selector = '#placemark_buttons_block';
            var placemark_add_commit_selector = '#placemark_add_commit';
            var placemark_content_margin;
            var placemark_list_element_selector = '.placemark_list_element';
            var placemark_list_selector = '#placemark_list';
            var placemark_list_block_selector = '#placemark_list_block';
            var placemark_add_buttons_block_selector = '#placemark_add_buttons_block';
            var placemark_list_element_div_selector = '.placemark_list_element div';
            var placemark_content_img_selector = '#placemark_content img';
            var placemark_content_selector = '#placemark_content';
            var shadow_block_selector = '#shadow_block';
            var shadow_selector = '#shadow';
            //var image_sizes = <?php echo(json_encode($config['allows']['sizes']['images']['widths'])); ?>;
            var mCustomScrollbar_selector = '.mCustomScrollbar'
            var alert_selector = '#alert'
            var placemark_content_block_selector = '#placemark_content_block';
            var placemark_add_cancel_selector = '#placemark_add_cancel';
            var placemark_add_block_selector = '#placemark_add_block';
            var placemark_add_selector = '#placemark_add';
            var placemark_add_open_selector = '#placemark_add_open';
            var placemark_update_open_from_viewer_selector = '#placemark_update_open_from_viewer';
            var open_panel_selector = '#open_panel';
            var where_am_i_selector = '#where_am_i';
            var panel_tools_selector = '#panel_tools';
            var update_placemark_field_selector = '#update_placemark_field';
            var ya_shield_1_selector = '#ya_shield_1';
            var ya_shield_1_timer;
            var placemark_add_set_point_timer;
            var YMaps_ID_selector = '#YMapsID';
            var _contentImageWithClusterWidth;
            var content_image_without_cluster_with;
            var cluster_list_image_prefix = null;
            var _contentImageWithClusterPrefix = null;
            var _contentImageWithoutClusterPrefix = null;
            var prefix;
            var bunch_filling_timer;
            var bunch_filling_end=0;
























            // подготавливаем общие габариты - в частности height элементов










    // подготавливаем габариты окна просмотра балуна - NOTE:  нельзя прописать это в css, потому что теги еще не существуют
    var prepare_placemark_content_dimensions = function (is_at_cluster) {
        $(placemark_list_selector).width(_clusterListImageWidth+ (placemark_content_margin * 2)); // отступ только слева у него
                if (device_type === device_mobile_name) {
        if (is_at_cluster) {
        $(placemark_content_selector).width(window_width - $(placemark_list_selector).width()); //'#placemark_content';
        } else {
        $(placemark_content_selector).width(window_width); //'#placemark_content';
        }

        } else {
        if (is_at_cluster) {
        $(placemark_content_selector).width($(_placemarkBlockSelector).width() - $(placemark_list_selector).width()); //'#placemark_content';
        } else {
        $(placemark_content_selector).width($(_placemarkBlockSelector).width()); //'#placemark_content';
        }
        }
    }









    // подготавливаем габариты окна просмотра балуна - NOTE:  нельзя прописать это в css, потому что теги еще не существуют
    var prepare_placemark_viewer_dimensions = function (id, is_at_cluster, is_from_cluster) {

        $(placemark_content_block_selector + ' div.text_1').css('margin-top', placemark_content_margin + 'px');
        $(placemark_content_block_selector + ' div.header_1').css('padding-top', placemark_content_margin * 2 + 'px');
        $(placemark_content_block_selector + ' div.header_1').css('padding-bottom', '0px');
        /*$(placemark_content_block_selector + ' div.link_1').css('padding-top', placemark_content_margin*2 + 'px');*/


        $(placemark_content_block_selector).css('padding-bottom', placemark_content_margin + 'px');
        $(placemark_list_element_selector).css('padding', placemark_content_margin + 'px'); //'.placemark_list_element';
        $(placemark_list_element_div_selector).css('margin-bottom', placemark_content_margin + 'px');
        if (device_type === device_mobile_name) {
            $(_placemarkBlockSelector).width(window_width);
            $(placemark_buttons_block_selector).width(window_width);
            <?php if ($available_to_change): ?>
                $(placemark_close_selector).width(Math.floor(window_width / 3) - parseFloat($(placemark_close_selector).css('margin-right')) + 'px');
                $(placemark_toggle_selector).width(Math.floor(window_width / 3) - parseFloat($(placemark_toggle_selector).css('margin-right')) + 'px');
                $(placemark_update_open_from_viewer_selector).width(window_width - $(placemark_close_selector).width() - $(placemark_toggle_selector).width()
                        - parseFloat($(placemark_close_selector).css('margin-right'))
                        - parseFloat($(placemark_toggle_selector).css('margin-right'))
                        - (parseFloat($(placemark_update_open_from_viewer_selector).css('margin-right')) * 2)
                        + 'px'); //подгоняем без приближений
            <?php else: ?>
                $(placemark_close_selector).width(Math.floor(window_width / 2) - parseFloat($(placemark_close_selector).css('margin-right')) - Math.ceil(parseFloat($(placemark_close_selector).css('margin-right'))/2) + 'px');
                $(placemark_toggle_selector).width(Math.floor(window_width / 2) - parseFloat($(placemark_toggle_selector).css('margin-right')) - Math.floor(parseFloat($(placemark_toggle_selector).css('margin-right'))/2) + 'px');
            <?php endif; ?>

            $(placemark_add_set_point_selector).width(window_width - (parseFloat($(placemark_add_set_point_selector).css('margin-right')) * 2) + 'px');
            $(placemark_add_cancel_selector).width(Math.floor(window_width / 2) - parseFloat($(placemark_add_cancel_selector).css('margin-right')) - Math.ceil(parseFloat($(placemark_add_cancel_selector).css('margin-right'))/2) + 'px');
            $(placemark_add_commit_selector).width(Math.floor(window_width / 2) - parseFloat($(placemark_add_commit_selector).css('margin-right')) - Math.floor(parseFloat($(placemark_add_commit_selector).css('margin-right'))/2) + 'px');

            $('.sublist_placemarks_block .placemarks_category_html_content').hide();
            if (is_at_cluster) {
                $('.sublist_placemarks_block').width($(placemark_content_block_selector).width());
                    $('.sublist_placemarks_content').width($('.sublist_placemarks_block').width() - $('.cropped_image_div').width() - 30);
            } else {
                if ($(placemark_content_block_selector).width() < ($('.cropped_image_div').width() * 6)) {
                    $('.sublist_placemarks_block').width($(placemark_content_block_selector).width());
                }
                else {
                     $('.sublist_placemarks_block').width(($(placemark_content_block_selector).width() / 2));
                }
                $('.sublist_placemarks_content').width($('.sublist_placemarks_block').width() - $('.cropped_image_div').width() - 30);
            }

        } else {
            if (is_at_cluster) {
                    $('.sublist_placemarks_block').width($(placemark_content_block_selector).width() - 30);
                    $('.sublist_placemarks_content').width($('.sublist_placemarks_block').width() - $('.cropped_image_div').width() - 10);
            } else {
                    $('.sublist_placemarks_block').width(($(placemark_content_block_selector).width() / 2) - 30);
                    $('.sublist_placemarks_content').width($('.sublist_placemarks_block').width() - $('.cropped_image_div').width() - 10);
            }
        }
        $(placemark_close_side_1_selector).width(Math.floor((window_width - $(_placemarkBlockSelector).width()) / 2));
        $(placemark_close_side_2_selector).width($(placemark_close_side_1_selector).width());
    }

















    // подготавливаем просмотр метки
    var get_placemark_link = function (id) {
        return '<?php echo(MY_DOMEN . '/' . $controller . '/'); ?>' + id;
    }



    var get_placemarks_ids_from_array = function () {
            var placemarks_ids = new Array();
            $.each(placemarks, function (id, value) {
            placemarks_ids.push(id);
            });
            return placemarks_ids;
    }






















    var prepare_content_image_dimentions = function (width, height) {


            var block_height = $(placemark_content_selector).height() - 50;
            var block_width = $(placemark_content_selector).width();
            return my_placemark_object.prepare_content_image_dimentions(width, height, block_width, block_height);
    }



































// отделяем от кластера метку
    var remove_from_cluster = function (id) {
        if ((typeof (placemarks[id]) !== 'undefined') && (typeof (placemarks[id]['object']) !== 'undefined')) {
        clusterer.remove(placemarks[id]['object']);
                map.geoObjects.add(placemarks[id]['object']);
        }
    }

// возвращаем метку в кластер
    var move_to_cluster = function (id) {

        if ((typeof (placemarks[id]) !== 'undefined') && (typeof (placemarks[id]['object']) !== 'undefined')) {

        clusterer.add(placemarks[id]['object']);
                map.geoObjects.remove(placemarks[id]['object']);
                map.geoObjects.add(clusterer);
        }
    }



// удаление метки с id из кластера и из массива
    var delete_placemark = function (id_placemark) {

        $.each(placemarks, function (id, value) {
            if (id == id_placemark) {
                clusterer.remove(value['object']);
                map.geoObjects.remove(value['object']);
                placemarks[id_placemark] = undefined;
                placemark_opened_id = undefined;
                return false;///////////$.each
            }
        });
    }




    var delete_all_placemarks = function () {
    clusterer.removeAll();
            $.each(placemarks, function (id, value) {
            if ((typeof (value) !== 'undefined') && (typeof (value['object']) !== 'undefined')) {
            map.geoObjects.remove(value['object']);
                    placemarks[id] = undefined;
                    placemark_opened_id = undefined;
            }
            });
    }


    // убираем все метки из карты, в массиве сохраняем
    var hide_all_placemarks_from_map = function () {
            placemark_opened_id = undefined;
            clusterer.removeAll();
            $.each(placemarks, function (id, value) {
            if ((typeof (value) !== 'undefined') && (typeof (value['object']) !== 'undefined')) {
            map.geoObjects.remove(value['object']);
            }
            });
    }








    var close_add_new_point = function (status) {
            is_enable_to_change_map_status = false;
            clearTimeout(placemark_add_set_point_timer);
            delete_target_placemark();
            $(placemark_add_buttons_selector).hide();
            $(ya_shield_1_selector).trigger('show', ['off']);
            $(placemark_add_selector).hide();
//$(shadow_selector).hide();
            $(placemark_add_open_selector).show();
            $(open_panel_selector).show();
            $(YMaps_ID_selector).css('opacity', 1);
            $(placemark_add_set_point_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/new_point/place_at_map'))); ?>');
            $(placemark_add_set_point_selector + ' ' + button_image_selector).css('top', buttons_new_point_place_at_map_position);
            my_new_point.reset();
        // если было редактирование (удаление, редактирование текущей метки), то убираем также дополнительно созданные поля
                    if (is_redacted() === true) {
            reset_updater(status);
        //возвращаем в кластер
                    move_to_cluster(current_placemark_id);
            }
        //$(alert_selector).hide();
    }







    var add_target_placemark = function (coords) {
        if (typeof (target_placemark) === 'object') {
    //перемещаем
        target_placemark.geometry.setCoordinates(coords);
        } else if (typeof (target_placemark) === 'undefined') {
        target_placemark = new ymaps.Placemark(coords, {}, {
        preset: preset_placemark_new
        });
                map.geoObjects.add(target_placemark);
        }
    }



    var delete_target_placemark = function () {
        if (typeof (target_placemark) === 'object') {
        map.geoObjects.remove(target_placemark);
    // clear
                target_placemark = undefined;
        }
    }



















    var show_cluster_list = function (target) {

        if (typeof (target) === 'undefined') {
            return;
        }


        //задаем размеры блоков - content и cluster list
        prepare_placemark_content_dimensions(1);
        var content = '';
        var first_id = null;
        // выбираем все данные кластера и отображаем их в попапе
        $.each(target.getGeoObjects(), function (id, value) {
            var id = value.properties.get('own_id');
            if (first_id === null) {
                first_id = id;
            }

            var photo = placemarks[id]['data']['photos'][0];
            var element = '\
                <div class="placemark_list_element" id="placemark_list_element_' + id + '" \
                onclick="my_map_vendor.placemark_preview(' + id + ', 1,1)">\
                ' + view_cropped_photo(photo['dir'] + cluster_list_image_prefix + photo['name'], photo['width'], photo['height'], cluster_list_image_width, cluster_list_image_height) + '\
                <?php if (self::get_module(MY_MODULE_NAME_SERVICE)->is_use_titles()): ?><div class="placemark_list_element_title">' + placemarks[id]['data']['title'] + '</div>\<?php endif; ?>
                </div>';
                content += element;
        });
        $(placemark_list_block_selector).html(content);
        $(placemark_list_selector).show();
        //$(shadow_selector).show();

        $(YMaps_ID_selector).css('opacity', 0.62);
        $(_placemarkSelector).show();
        $(placemark_buttons_selector).show();
        $(ya_shield_1_selector).trigger('show', ['on']);
        colorize_cluster(target);
        colorize_placemark(0); // делаем потенциально открытые ранее метки как просмотренные, не знаем какая, но она должна быть закрыта
        $(placemark_list_block_selector + ' > div:even').addClass('even_cluster_list_element');
        placemark_preview(first_id, 1, 0);
    }



















    var prepare_loaded_placemarks = function (data, is_bunch) {
        try {
            var result = JSON.parse(data);
            if (result['status'] === '<?php echo(MY_SUCCESS_CODE); ?>') {
                if (typeof (result['data']) === 'object') {
                    var is_set_placemarks_data = false;
                    $.each(result['data'], function (index, value) {
                        if (set_placemarks_data(value) === true) {
                            is_set_placemarks_data = true;
                            //$.each(value['photos'], function (index, value) {/////////////////////////////////////////////////
                            //    // подгружаем её картинки
                            //    $([value['path']]).preload();
                            //});
                        }
                    });
                    // Если хоть одна новая метка добавилась
                    if (is_set_placemarks_data === true) {
                        add_and_clustering();
                    }
                    if ((typeof(is_bunch)==='undefined') || (!is_bunch)){
                        is_too_big_requested_area=0;
                    }
                } else if (result['data']==='<?php echo(MY_TOO_BIG_MAP_REQUEST_AREA_CODE);?>'){
                    if ((typeof(is_bunch)==='undefined') || (!is_bunch)){
                        is_too_big_requested_area=1;
                    }

                }
            }
        } catch (error) {
            my_get_message('<?php echo(my_pass_through(@self::trace('errors/system'))); ?>', 'error');
        }
    }





    var run_bunch_filling_timer = function () {
        bunch_filling();//сразу и потом
        <?php if(self::get_module(MY_MODULE_NAME_SERVICE)->is_map_autofill_enabled()):?>
        bunch_filling_timer = setInterval(bunch_filling, <?php echo(my_pass_through(@self::get_module(MY_MODULE_NAME_SERVICE)->get_map_autofill_period()));?>);
        <?php endif;?>
    }



    var stop_bunch_filling_timer = function () {
       clearInterval(bunch_filling_timer);
       bunch_filling_end=1;
    }




    var bunch_filling = function () {

        if(is_too_big_requested_area==0){
            //если запрашиваемая область не велика и может подгружаться с помощью координат, то не "заливаем" карту
            //эта функция может выполняться только, когда масштаб карты очень маленький
            return;
        }


        if(bunch_filling_end){
            //если вдруг еще раз запустили, чтобы не дергать по пустякам сервер
            return;
        }
        $.ajax({
            type: "POST",
            url: '<?php echo (self::get_path('fill_placemarks_on_map')); ?>',
            success: function (data) {
                var result = JSON.parse(data);
                // if (typeof (result['data']) === 'object') {

                //}
                if($.isEmptyObject(result['data'])){
                    //если нет данных, то останавливаемся
                    stop_bunch_filling_timer();
                }

                prepare_loaded_placemarks(data, true);
            },
            error: function (jqXHR) {
                var text = jqXHR.responseText;
                if (!text) {
                    text = '<?php echo(my_pass_through(@self::trace('errors/system'))); ?>';
                }
                my_get_message(text, 'error');
            }
        }).always(function () {
        });
    }


    var load_by_coords = function (coords) {
        if (typeof (coords) === 'undefined') {
            var coords_array = map.getBounds();
            var params = {
                'Y1': coords_array[1][0],
                'Y2': coords_array[0][0],
                'X1': coords_array[0][1],
                'X2': coords_array[1][1]
            };
        } else {
            params = coords;
        }

        params.zoom = map.getZoom();
        params.center = map.getCenter();

        $.ajax({
            type: "POST",
            url: '<?php echo (self::get_path('get_placemarks_by_coords')); ?>',
            data: params,
            success: function (data) {
                prepare_loaded_placemarks(data);
            },
            error: function (jqXHR) {
                var text = jqXHR.responseText;
                if (!text) {
                    text = '<?php echo(my_pass_through(@self::trace('errors/system'))); ?>';
                }
                my_get_message(text, 'error');
            }
        }).always(function () {
        });
    }





    var close_placemark_viewer = function () {
            colorize_cluster(0);
            colorize_placemark(0);
            $(_placemarkSelector).hide();
            $(placemark_content_block_selector).html('');
            $(placemark_list_block_selector).html('');
            $(placemark_buttons_selector).hide();
            $(ya_shield_1_selector).trigger('show', ['off']);
            $(placemark_add_open_selector).show();
            $(open_panel_selector).show();
            $(YMaps_ID_selector).css('opacity', 1);
//$(shadow_selector).hide();
            $(placemark_toggle_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/placemark/viewer/hide'))); ?>');
            $(placemark_toggle_selector + ' ' + button_image_selector).css('top', buttons_placemark_viewer_hide_position);
            move_to_cluster(current_placemark_id);
    }




// сбрасываем настройки обновления записи
    var reset_updater = function (status) {
        my_new_point.reset_updater();
    //если объект есть (если мы его не удалили при реадактировании)
                if (typeof (placemarks[current_placemark_id]) !== 'undefined') {
    // возвращаем на прежднее место
        placemarks[current_placemark_id]['object'].geometry.setCoordinates([placemarks[current_placemark_id]['data']['y'], placemarks[current_placemark_id]['data']['x']]);
        }
        is_redacted_status = false;
                if ((typeof (status) == 'undefined') || (status != 'delete')) {
        my_map_vendor.placemark_preview(current_placemark_id, 0, 0);
        }
    }












    var is_enable_to_change_map = function () {
        // если создается новая метка
        if (is_enable_to_change_map_status === true) {
        return true;
        }
        return false;
    }


    var show_placemarks_by_category = function (category_id) {
        var cluster_is_updated = false;
        var placemarks_to_add = new Array();
        $.each(placemarks, function (id, value) {
            if (value['data']['subcategories']) {
                var subcategories = value['data']['subcategories'].split(',');
            } else {
                var subcategories = new Array();
            }
            if ((typeof (value) !== 'undefined') && ((value['data']['category'] === category_id) || ($.inArray(category_id, subcategories) >= 0))) {
                placemarks_to_add.push(add_placemark(id, value['data']));
                cluster_is_updated = true;
            }
        });
        if (cluster_is_updated === true) {
            clusterer.add(placemarks_to_add);
            map.geoObjects.add(clusterer);
        }
        return true;
    }





    var show_all_placemarks = function () {
        var cluster_is_updated = false;
        var placemarks_to_add = new Array();
        $.each(placemarks, function (id, value) {
            if (typeof (value) !== 'undefined') {
                placemarks_to_add.push(add_placemark(id, value['data']));
                cluster_is_updated = true;
            }
        });
        if (cluster_is_updated === true) {
            clusterer.add(placemarks_to_add);
            map.geoObjects.add(clusterer);
        }
    }




    var filter_by_categories = function (category_id) {
    $("#panel_tools").hide();
            close_placemark_viewer();
            //delete_all_placemarks();//////
            filter_category = category_id;
            //load_by_coords();//////////
            my_get_message('<?php echo(my_pass_through(@self::trace('notice/map/filter/start/text'))); ?>', 'notice', false, 'my_map_vendor.hide_all_placemarks_from_map();my_map_vendor.show_placemarks_by_category(\'' + category_id + '\');alert_timer = setTimeout(function () {hide();}, 1000);');
    }



    var reset_filter_by_categories = function () {
    filter_category = false;
            $("#panel_tools").hide();
            my_get_message('<?php echo(my_pass_through(@self::trace('notice/map/filter/reset/text'))); ?>', 'notice', false, 'my_map_vendor.hide_all_placemarks_from_map();my_map_vendor.show_all_placemarks();hide();alert_timer = setTimeout(function () {hide();}, 1000);');
            //delete_all_placemarks();/////////////

            //load_by_coords();//////////

    }








    var interface = {


            hide_all_placemarks_from_map: function () {
                hide_all_placemarks_from_map();
            },


            show_placemarks_by_category: function (category_id) {
                show_placemarks_by_category(category_id);
            },

            show_all_placemarks: function () {
                show_all_placemarks();
            },

            // сохранение отметки в массих для дальнейшего добавления их на карту
            set_placemarks_data: function (data) {
                set_placemarks_data(data);
            },


            set_zoom: function (value) {
                zoom = value;
            },

            //дебажная функция
            get_count_of_placemarks: function () {
                var count = 0;
                        for (var prs in placemarks)
                {
                count++;
                }
                alert(count);
            },

            // отоюбражение данных балуна
            placemark_preview: function (id, is_at_cluster, is_from_cluster) {
                placemark_preview(id, is_at_cluster, is_from_cluster);
            },


            get_placemark: function (id) {
                get_placemark(id);
            },


            init: function (coords) {






         sssssssssssssssssssssssssssssssssssssssss





                /**
                 * Кластеризатор расширяет коллекцию, что позволяет использовать один обработчик
                 * для обработки событий всех геообъектов.
                 * Будем менять цвет иконок и кластеров при наведении.
                 */
                clusterer.events
        //при клике на кластер, подгружаем данные первого в списке элемента
                    .add(['click'], function (e) {

                    if ($(placemark_add_buttons_selector).is(":visible") != true) {


                    var target = e.get('target');
        // только для кластера с элементами
                            if (typeof target.getGeoObjects === "function") {
                    show_cluster_list(target);
        // переводим скролл вверх, если вдруг он не там
                            document.getElementById("placemark_list").scrollTop = 0;
                    }
                    } else {
                    my_get_message('<?php echo(my_pass_through(@self::trace('errors/new_point/another_actions'))); ?>', 'error');
                    }


                    });
        // события:
        // при клике по полю, в случае добавления новой точки или смены координат существующей, определяем координаты клика и записываем их форму
                    map.events.add('click', function (e) {
                    if ((is_enable_to_change_map() && $(panel_tools_selector).is(":visible") !== true) && ($(placemark_toggle_selector).is(":visible") !== true) && ($(placemark_add_selector).is(":visible") !== true)) {
                    var coords = e.get('coords');
                            $(y_add_new_point_selector).val(coords[0].toPrecision(6));
                            $(x_add_new_point_selector).val(coords[1].toPrecision(6));
        //если редактируем
                            if (is_redacted() === true) {
        // меняем местоположение метки
                    placemarks[current_placemark_id]['object'].geometry.setCoordinates(coords);
                    } else {
                    add_target_placemark(coords);
                    }
                    my_get_message('<?php echo(my_pass_through(@self::trace('success/new_point/placemark_added'))); ?>', 'success');
                            clearTimeout(placemark_add_set_point_timer);
                            placemark_add_set_point_timer = setTimeout(function () {
                            if ($(placemark_add_selector).is(":visible") !== true) {
                            $(placemark_add_set_point_selector).trigger('click');
                            }
                            kick_1_nicescroll('placemark_add_block');
                            kick_1_nicescroll('placemark_list');
                            }, 2000);
                    }
                    }).add('boundschange', function (event) {

            // Если масштаб не меньше допустимого
            // if (newZoom <= gZoomMinForLoad) {
                        /*
             var old_coords = event.get("oldBounds");
             // верх по y
             var old_Y1 = old_coords[1][0];
             // низ по y
             var old_Y2 = old_coords[0][0];
             // лево по х
             var old_X1 = old_coords[0][1];
             // право по x
             var old_X2 = old_coords[1][1];
             var new_coords = event.get("newBounds");
             // верх по y
             var new_Y1 = new_coords[1][0];
             // низ по y
             var new_Y2 = new_coords[0][0];
             // лево по х
             var new_X1 = new_coords[0][1];
             // право по x
             var new_X2 = new_coords[1][1];
             var coords = {
             'old_Y1': old_Y1,
             'old_X1': old_X1,
             'old_Y2': old_Y2,
             'old_X2': old_X2,
             'Y1': new_Y1,
             'X1': new_X1,
             'Y2': new_Y2,
             'X2': new_X2
             };
             load_by_coords(coords);*/
            load_by_coords(); /////////////////
//}
            });





            run_bunch_filling_timer();
                        load_by_coords();

    //показать метку на карте или вернуться к просмотру
                        $(placemark_toggle_selector).click(function () {
                if ($(_placemarkSelector).is(":visible") === true) {
                $(_placemarkSelector).hide();
                        $(YMaps_ID_selector).css('opacity', 1);
                        $(placemark_toggle_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/placemark/viewer/show'))); ?>');
                        $(placemark_toggle_selector + ' ' + button_image_selector).css('top', buttons_placemark_viewer_show_position);
                        map.setCenter([placemarks[current_placemark_id]['data']['y'], placemarks[current_placemark_id]['data']['x']]);
                        map.setZoom(placemark_view_zoom);
    //отделяем её от кластера
                        remove_from_cluster(current_placemark_id);
                } else {
                $(_placemarkSelector).show();
                        $(YMaps_ID_selector).css('opacity', 0.62);
                        $(placemark_toggle_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/placemark/viewer/hide'))); ?>');
                        $(placemark_toggle_selector + ' ' + button_image_selector).css('top', buttons_placemark_viewer_hide_position);
    //возвращаем в кластер
                        move_to_cluster(current_placemark_id);
                }
                });
                        $(placemark_close_selector).click(function () {
                close_placemark_viewer();
                });
                        $(placemark_add_open_selector).click(function () {

                $(panel_tools_selector).hide();
                        is_enable_to_change_map_status = true;
                        close_placemark_viewer();
                        $(placemark_add_open_selector).hide();
                        $(placemark_add_selector).hide();
                        $(placemark_add_set_point_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/new_point/return_to_editor'))); ?>');
                        $(placemark_add_set_point_selector + ' ' + button_image_selector).css('top', buttons_new_point_return_to_editor__position);
                        my_get_message('<?php echo(my_pass_through(@self::trace('notice/new_point/check_place'))); ?>', 'notice');
                        kick_1_nicescroll('placemark_add_block');
                        kick_1_nicescroll('placemark_list');
                });
                        $(placemark_update_open_from_viewer_selector).click(function () {
                close_placemark_viewer();
                        $(open_panel_selector).hide();
                        $(placemark_add_open_selector).hide();
                        $(placemark_add_selector).show();
                        $(YMaps_ID_selector).css('opacity', 0.62);
                        $(placemark_add_buttons_selector).show();
                        $(ya_shield_1_selector).trigger('show', ['on']);
                        $(placemark_add_set_point_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/new_point/place_at_map'))); ?>');
                        $(placemark_add_set_point_selector + ' ' + button_image_selector).css('top', buttons_new_point_place_at_map_position);
                        is_redacted_status = true;
                        my_new_point.prepare_update(current_placemark_id);
    //подсвечиваем текущую метку
                        placemarks[current_placemark_id]['object'].options.set('preset', preset_placemark_new);
                        remove_from_cluster(current_placemark_id);
                        kick_1_nicescroll('placemark_add_block');
                        kick_1_nicescroll('placemark_list');
                });
                        $(placemark_close_side_1_selector + ',' + placemark_close_side_2_selector).click(function () {
                $(placemark_close_selector).trigger('click');
                });
                        $(placemark_add_set_point_selector).click(function () {
                is_enable_to_change_map_status = true;
                        if ($(placemark_add_selector).is(":visible") === true) {
                $(placemark_add_selector).hide();
                        $(open_panel_selector).show();
                        $(YMaps_ID_selector).css('opacity', 1);
    //$(shadow_selector).hide();
                        $(placemark_add_set_point_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/new_point/return_to_editor'))); ?>');
                        $(placemark_add_set_point_selector + ' ' + button_image_selector).css('top', buttons_new_point_return_to_editor__position);
                        my_get_message('<?php echo(my_pass_through(@self::trace('notice/new_point/check_place'))); ?>', 'notice');
                } else {
                $(open_panel_selector).hide();
                        $(placemark_add_selector).show();
                        $(alert_selector).hide();
                        $(YMaps_ID_selector).css('opacity', 0.62);
    //$(shadow_selector).show();
                        $(placemark_add_buttons_selector).show();
                        $(ya_shield_1_selector).trigger('show', ['on']);
                        $(placemark_add_set_point_selector).html('<?php echo(my_htmlller_buttons(self::trace('buttons/new_point/place_at_map'))); ?>');
                        $(placemark_add_set_point_selector + ' ' + button_image_selector).css('top', buttons_new_point_place_at_map_position);
                }
                clearTimeout(placemark_add_set_point_timer);
                });
                        $(placemark_add_cancel_selector).click(function () {

                var text = '';
                        if (!is_redacted()) {
                text = "<?php echo(my_pass_through(@self::trace('sweet_alert/new_point/close/notation'))); ?>";
                } else {
                text = "<?php echo(my_pass_through(@self::trace('sweet_alert/redact_point/close/notation'))); ?>";
                }
                swal({
                title: "<?php echo(my_pass_through(@self::trace('sweet_alert/are_you_sure'))); ?>",
                        text: text,
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#964271",
                        confirmButtonText: "<?php echo(my_pass_through(@self::trace('sweet_alert/yes'))); ?>",
                        cancelButtonText: "<?php echo(my_pass_through(@self::trace('sweet_alert/no'))); ?>",
                        closeOnConfirm: true
                },
                        function () {
                        if (is_redacted()) {
                        placemarks[current_placemark_id]['object'].options.set('preset', my_placemark_category_viewer.get_baloon_image(placemarks[current_placemark_id]['data']['category']));
                        }
                        close_add_new_point();
                        });
                });
                        $(where_am_i_selector).click(function () {
                my_map_prepare_location('replace');
                });
    // защита от ссылок ya
                        $(ya_shield_1_selector).bind('show', function (event, param) {
                clearTimeout(ya_shield_1_timer);
                        if (param == 'on') {
                $(ya_shield_1_selector).show();
                } else {

                ya_shield_1_timer = setTimeout(function () {
                $(ya_shield_1_selector).hide();
                }, 2000);
                }
                });
            },




            locate: function (coords) {
                map.setCenter(coords);
                    map.setZoom(zoom_where_am_i);
            },


            go: function (coords) {
                map.setCenter(coords);
                    map.setZoom(18);
                    add_target_placemark(coords);
            },



            filter_by_categories: function (category_id) {
                filter_by_categories(category_id);
            },



            reset_filter: function () {
                reset_filter_by_categories();
            },



            delete_placemark: function (id_placemark) {
                delete_placemark(id_placemark);
            },



            close_add_new_point: function (action) {
                close_add_new_point(action);
            },



            is_redacted: function () {
                return is_redacted();
            },



            get_point_data: function (id, is_at_cluster, is_from_cluster) {
                get_point_data(id, is_at_cluster, is_from_cluster);
            },



            init_target_placemark: function (id) {

                // метка новая, поэтому все возьмем через аякс
                var data = $.ajax({
                type: "POST",
                        url: '<?php echo (self::get_path('get_placemarks_by_ids')); ?>',
                        data: {id: id},
                        async: false,
                        error: function (jqXHR) {
                        var text = jqXHR.responseText;
                                if (!text) {
                        text = '<?php echo(my_pass_through(@self::trace('errors/system'))); ?>';
                        }
                        my_get_message(text, 'error');
                        }
                }).responseText;
                    var result = '';
                    try {
                    var result = JSON.parse(data);
                            if (result['status'] === '<?php echo(MY_SUCCESS_CODE); ?>') {

                    if (typeof (result['data']) === 'object') {

// мы не знаем какой ключ придет, поэтому для одинарного массива делаем перебрку
                    $.each(result['data'], function (index, value) {
// Если метка добавилась или обновилась
                    if (set_placemarks_data(value) === true) {

                    if (is_redacted() === false) {
//только если добавляем новую метку
                    add_and_clustering();
                    }
//подсвечиваем новую метку
                    placemarks[id]['object'].options.set('preset', my_placemark_category_viewer.get_baloon_image(value.category));
                    }
                    });
                    }
                    } else {
                    my_get_message('<?php echo(my_pass_through(@self::trace('errors/system'))); ?>', 'error');
                    }

                    } catch (error) {
                my_get_message('<?php echo(my_pass_through(@self::trace('errors/system'))); ?>', 'error');
                    }



            close_add_new_point();
            if (is_redacted() === false) {
                // убираем метку таргета с карты
                delete_target_placemark();
            }

            }



    }
    return interface;

    })();






            function my_map_prepare_location(action) {
                    var device_type = '<?php echo(get_device()); ?>';
                    var device_mobile_name = '<?php echo(MY_DEVICE_MOBILE_TYPE_CODE); ?>';
                    function ymaps_geolocation() {
                    ymaps.geolocation.get({
                    provider: 'yandex',
                            mapStateAutoApply: true
                    }).then(function (result) {
                    var bounds = result.geoObjects.get(0).properties.get('boundedBy');
                            var coords = ymaps.util.bounds.getCenter(bounds); //[55.733835, 37.588227];
                            if (action === 'init') {
                    my_map_vendor.init(coords);
                    } else if (action === 'replace') {
                    my_map_vendor.locate(coords);
                    }
                    });
                    }

//максимально точное определение (применимо лучше в мобильниках)
                if ((navigator.geolocation) && (device_type === device_mobile_name)) {
                navigator.geolocation.getCurrentPosition(function (position) {
                var latitude = position.coords.latitude;
                        var longitude = position.coords.longitude;
                        var coords = [latitude, longitude]; //[55.733835, 37.588227];
                        if (action === 'init') {
                my_map_vendor.init(coords);
                } else if (action === 'replace') {
                my_map_vendor.locate(coords);
                }
                },
                        function () {
    // иначе - обычный способ
                        ymaps_geolocation();
                        });
                } else {
    // иначе - обычный способ
                ymaps_geolocation();
                }
            }




    ymaps.ready(function () {

        <?php if (isset($_SESSION['user']['map']['coords']['x']) && isset($_SESSION['user']['map']['coords']['y']) && isset($_SESSION['user']['map']['zoom'])) : ?>
                my_map_vendor.set_zoom(<?php echo($_SESSION['user']['map']['zoom']); ?>);
                        my_map_vendor.init([<?php echo($_SESSION['user']['map']['coords']['x']); ?>,<?php echo($_SESSION['user']['map']['coords']['y']); ?>]);
        <?php else: ?>
                my_map_vendor.set_zoom(5);
                        my_map_vendor.init([50.733835, 27.588227]);
        <?php endif; ?>

    });


    });
</script>