<div class="main_block">

    <!--<div class="main_block_description">
    <?php echo my_pass_through(@self::trace('main/description')); ?>
    </div>-->

    <div class="main_block_map_block" onclick="javascript:document.location.href = '<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_MAP); ?>'">
        <img src="<?php echo(MY_IMG_URL); ?>map_240.png">
        <div class="main_block_map_block_title">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_MAP); ?>"><?php echo my_pass_through(@self::trace('main/map/title')); ?></a>
        </div>
    </div>

    <div class="main_block_catalog_block" onclick="javascript:document.location.href = '<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG); ?>'">
        <img src="<?php echo(MY_IMG_URL); ?>catalog_240.png">
        <div class="main_block_catalog_block_title">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG); ?>"><?php echo my_pass_through(@self::trace('main/catalog/title')); ?></a>
        </div>
    </div>

    <div class="main_block_search_block" style="margin-bottom:20px" onclick="javascript:document.location.href = '<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_MODULE_NAME_SEARCH); ?>'">
        <img src="<?php echo(MY_IMG_URL); ?>search_240.png">
        <div class="main_block_search_block_title">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_MODULE_NAME_SEARCH); ?>"><?php echo my_pass_through(@self::trace('main/search/title')); ?></a>
        </div>
    </div>


    <div class="clear"></div>

   <?php $this->trace_block('_outer_services' . MY_DS . 'vk_widgets' . MY_DS . 'recomendations', false, $data); ?>

<?php /*
    <div class="main_block_last_placemarks_title">
        <div class="padding_10">
            <?php echo my_pass_through(@self::trace('main/last_placemarks/text')); ?>
            <div class="main_block_last_placemarks_title_count">
            <?php echo($data['placemarks_count']); ?>
        </div>
        </div>
    </div>
*/?>



</div>
<div class="clear"></div>







<?php
$this->trace_block('_models/catalog/infinity_scroll');
$this->trace_block('_models' . MY_DS . 'category_viewer', false, $data);
?>
<script type="text/javascript">
    $(document).ready(function () {

        var buttons_number = 3;


        var window_width = $(window).width();
        var window_height = $(window).height();
        var margin = 10;


        var button_width = Math.floor((window_width / buttons_number) - (margin * 2 / buttons_number));


        $('.main_block_map_block, .main_block_catalog_block').width(button_width);
        $('.main_block_map_block, .main_block_catalog_block').css('margin-right', margin + 'px');
        $('.main_block_search_block').width(button_width);

        $('.main_block_map_block img, .main_block_catalog_block img, .main_block_search_block img').width(button_width - margin * 4);


        $('.main_block_map_block, .main_block_catalog_block, .main_block_search_block').css('padding-bottom', margin + 'px');

$('.main_block_map_block img, .main_block_catalog_block img, .main_block_search_block img').css('margin-top', margin + 'px');
$('.main_block_map_block img, .main_block_catalog_block img, .main_block_search_block img').css('margin-left', margin + 'px');
$('.main_block_map_block img, .main_block_catalog_block img, .main_block_search_block img').css('margin-bottom', margin + 'px');


$('.main_block_map_block_title, .main_block_catalog_block_title,.main_block_search_block_title').css('margin-right', margin + 'px');






        var url = '<?php echo (self::get_path('get_placemarks_list')); ?>';
        my_infinity_scroll.init('#list', url);
        my_infinity_scroll.get_placemarks();
    });
</script>
<div id="list"></div>