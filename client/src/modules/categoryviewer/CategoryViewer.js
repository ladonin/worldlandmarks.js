



$catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
$categories = $catalog_module->get_categories();
$category_dimentions = $catalog_module->get_category_dimentions();
?>
<script type="text/javascript">
    $(document).ready(function () {


        my_map_category_object = (function () {
//делаем объект с категориями
            var categories = {<?php

foreach ($categories as $category) {
    echo ($category['id'] . ':{0:\'' . $category['code'] . '\',1:\'' . $category['title'] . '\'},');
}
?>};
            var init_status = false;
            var init = function () {
                //только один раз
                if (init_status) {
                    return;
                }
                init_status = true;
                if (typeof (ymaps) !== 'undefined') {
                    $.each(categories, function (id, value) {
                        ymaps.option.presetStorage.add('custom#' + value[0], {
                            iconLayout: 'default#image',
                            iconImageHref: '<?php echo(MY_SERVICE_IMGS_URL_CATEGORIES); ?>' + value[0] + '.png',
                            iconImageSize: [<?php echo($category_dimentions['width']); ?>, <?php echo($category_dimentions['height']); ?>],
                            iconImageOffset: [<?php echo($category_dimentions['top']); ?>, <?php echo($category_dimentions['left']); ?>],
                        });
                        ymaps.option.presetStorage.add('custom#' + value[0] + '_selected', {
                            iconLayout: 'default#image',
                            iconImageHref: '<?php echo(MY_SERVICE_IMGS_URL_CATEGORIES); ?>' + value[0] + '_selected.png',
                            iconImageSize: [<?php echo($category_dimentions['width']); ?>, <?php echo($category_dimentions['height']); ?>],
                            iconImageOffset: [<?php echo($category_dimentions['top']); ?>, <?php echo($category_dimentions['left']); ?>],
                        });
                    });
                }
            }

            var interface = {
                get_category_image_url: function (category) {
                    category = parseInt(category);
                    if (typeof (categories[category]) !== 'undefined') {
                        return '<?php echo(MY_SERVICE_IMGS_URL_CATEGORIES); ?>' + categories[category][0] + '.png';
                    } else {
                        return '<?php echo(MY_IMG_URL); ?>other.png';
                    }
                },
                get_category_title: function (category) {
                    return categories[category][1];
                },
                get_baloon_image: function (category, is_selected) {
                    init();
                    if (typeof (category) === 'undefined') {
                        return {};
                    }
                    var selected = '';
                    if ((typeof (is_selected) !== 'undefined') && (is_selected)) {
                        selected = '_selected';
                    }
                    return {
                        preset: 'custom#' + categories[category][0] + selected
                    };
                },
                is_photo_by_category: function (photo) {
                    var status = false;
                    $.each(categories, function (id, value) {
                        if (photo === (value[0] + '.jpg')) {
                            status = true;
                            return false;///////////$.each
                        }
                    });
                    return status;
                }
            }
            return interface;
        })();
        my_placemark_category_viewer = my_map_category_object;
    });
</script>