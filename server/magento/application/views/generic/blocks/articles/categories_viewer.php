<?php
namespace app\views\generic\blocks\placemarks\categories_viewer;

use \components\app as components;

$catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
?>


    <?php
    foreach ($catalog_module->get_subcategories($data['categories']) as $category): ?>
        <a href="<?php echo(MY_DOMEN . '/' . MY_MODULE_NAME_ARTICLE . '/' . MY_ACTION_NAME_ARTICLES_CATEGORIES_NAME . '/' . $catalog_module->get_category_code($category) . '/1'); ?>"><?php echo($catalog_module->get_category_title($category)); ?></a>
         <?php endforeach; ?>
