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

    <div class="main_block_search_block" onclick="javascript:document.location.href = '<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_MODULE_NAME_SEARCH); ?>'">
        <img src="<?php echo(MY_IMG_URL); ?>search_240.png">
        <div class="main_block_search_block_title">
            <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_CATALOG . '/' . MY_MODULE_NAME_SEARCH); ?>"><?php echo my_pass_through(@self::trace('main/search/title')); ?></a>
        </div>
    </div>


    <div class="clear"></div>


   <?php $this->trace_block('_outer_services' . MY_DS . 'vk_widgets' . MY_DS . 'recomendations', false, $data); ?>
<?php /*
    <div class="main_block_last_placemarks_title">
        <?php echo my_pass_through(@self::trace('main/last_placemarks/text')); ?>
        <div class="main_block_last_placemarks_title_count">
            <?php echo($data['placemarks_count']); ?>
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
        var url = '<?php echo (self::get_path('get_placemarks_list')); ?>';
        my_infinity_scroll.init('#list', url);
        my_infinity_scroll.get_placemarks();
    });
</script>
<div id="list"></div>