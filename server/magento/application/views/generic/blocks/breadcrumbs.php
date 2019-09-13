<?php

namespace app\views\generic\blocks\breadcrumbs;

if (get_controller_name() === MY_CONTROLLER_NAME_CATALOG){
    $module_name = MY_MODULE_NAME_CATALOG;
} elseif (get_controller_name() === MY_CONTROLLER_NAME_ARTICLE){
    $module_name = MY_MODULE_NAME_ARTICLE;
}
$breadcrumbs = self::get_module($module_name)->get_breadcrumbs_data();



if (my_array_is_not_empty(@$breadcrumbs)):
    ?>
    <div class="breadcrumbs">
        <div class="left_10">
    <?php foreach ($breadcrumbs as $crumb) : ?>
            <?php if (my_is_not_empty(@$crumb['url'])) : ?>
                <a href="<?php echo($crumb['url']); ?>"><?php echo($crumb['name']); ?></a>
                <?php else:
                ?>
                <h3><?php echo($crumb['name']); ?></h3>
            <?php endif;



        endforeach;
        ?>
    </div></div>
    <?php
 endif;


