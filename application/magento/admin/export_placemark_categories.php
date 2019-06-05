<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title=$page_name = 'Экспорт фотографий меток по категориям';
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require_once('generic' . MY_DS . 'autorize.php');




include('generic/breadcrumbs.php');

if (is_valid_service($_REQUEST[MY_SERVICE_VAR_NAME])) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
    $photos_table = $map . '_map_photos';
    $files_dir = $map;
} else {
    echo('<div class="alert alert-danger" role="alert">Неверно введено название карты</div>');
    exit();
}
?>
<div class="col-md-5">
<h2>Экспорт фотографий по категории</h2>
<h4>Выберите категорию для экспорта</h4>
<div class="alert alert-warning" role="alert">Внимание! При клике на категорию начнется экспорт.</div>

            <?php

        $categories = get_categories(MY_LANGUAGE_RU);
        foreach ($categories as $category) {

            echo('<a class="list-group-item" href="_e5b7rnijjrnrnnb_export_photos.php?code_type=category&category_id=' . $category['id'] . '">');
            echo($category['id'] . ': ' . $category['name']);
            echo('</a>');
        }
            ?>

<br>
</div>
<?php include('generic/footer.php'); ?>