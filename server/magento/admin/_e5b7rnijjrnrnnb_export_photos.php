<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
require_once('generic' . MY_DS . 'autorize.php');


require_once(MY_APPLICATION_DIR . 'modules' . MY_DS . 'base' . MY_DS . 'archive' . MY_DS . 'modules' . MY_DS . 'zip' . MY_DS . 'classes' . MY_DS . 'zip.php');
$zip = new \modules\base\archive\modules\zip\classes\zip;







//$countries_data = require_once(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'countries' . MY_DS . 'countries_data.php');











$countries_names_replaces = require_once(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'countries' . MY_DS . 'countries_names_replaces.php');


$site = get_site_name($_REQUEST[MY_SERVICE_VAR_NAME]);
if ($site) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('неверно введено название карты');
    exit();
}



$map_table = $map . '_map_data';


$code_type_get = isset($_REQUEST['code_type']) ? $_REQUEST['code_type'] : '';
if (($code_type_get !== 'country') && ($code_type_get !== 'category')) {
    echo('укажите верный тип экспорта');
    exit();
}

$country_code_get = isset($_REQUEST['country_code']) ? $_REQUEST['country_code'] : '';
$category_id_get = isset($_REQUEST['category_id']) ? (int) $_REQUEST['category_id'] : '';



$photos_table = $map . '_map_photos';

$sql = "SELECT
        c.id,
        g.country,
        g.country_code,
        c.category,
        c.subcategories

        FROM $map_table c
        JOIN " . $map . "_geocode_collection g ON c.id=g.map_data_id AND g.language='" . MY_LANGUAGE_RU . "' ";

if (($code_type_get === 'country') && ($country_code_get)) {
    $sql.="WHERE g.country_code=" . $connect->quote($country_code_get);
} else if ($code_type_get === 'category') {
    $sql.="WHERE c.category = " . $category_id_get . " OR subcategories REGEXP '[[:<:]]" . $category_id_get . "[[:>:]]'";


    $categories = require(MY_SERVICES_DIR . $map . MY_DS . 'config' . MY_DS . 'config.php');
    $categories=$categories['categories']['categories_codes'];
    $category = null;
    foreach ($categories as $category) {
        if ($category['id'] === $category_id_get) {
            $category_name = $category['code'];
            break;
        }
    }
    if (!$category_name) {
        echo('укажите верный код категории');
        exit();
    }
}



$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

$dir = MY_DOCROOT . 'files' . MY_DS . 'export' . MY_DS . 'photos' . MY_DS . $map . '_' . $code_type_get;
@removeDir($dir);
@mkdir($dir);
if (!$result) {
    echo('ничего не найдено');
    exit();
}
foreach ($result as $placemark) {

    $id = $placemark['id'];



    if ($code_type_get === 'country') {

        // --> 1. файлы в папку
        $code = $placemark['country_code'];
    } else if ($code_type_get === 'category') {

        // --> 1. файлы в папку
        $code = $category_name;
    }
    $path = $dir . MY_DS . $code;


    @mkdir($path);

    //берем фотки
    $sql = "SELECT * FROM $photos_table where map_data_id = $id ORDER by id ASC";
    $photos = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    foreach ($photos as $key => $photo) {
        $photo_num = $id . '___' . ($key + 1);
        $photo_type = explode('.', $photo['path']);
        $new_current_photo_path = $path . MY_DS . $photo_num . '.' . $photo_type[1];
        $current_photo_path = prepare_photo_path($id, $photo['path'], '1_', false, false, $map);
        if (!copy($current_photo_path, $new_current_photo_path)) {
            echo "не удалось скопировать $current_photo_path\n";
        }
    }
    // <-- 1. файлы в папку
}


// --> 1. файлы в папку  - архивация
$file_name = $code . '.zip';
sleep(1);
if (($code_type_get === 'country') && (!$country_code_get)) {
    sleep(5);
}


if (($code_type_get === 'country') && ($country_code_get)) {
    $file_name = $code_type_get . '_' . $country_code_get . '.zip';
}
$path_archive = $dir . '.zip';
@unlink($path_archive);
//Удаляем файл
$zip->archive($dir, $path_archive);

removeDir($dir);
// оставляем только НОВЫЙ архив

header("Location: http://" . $_SERVER['HTTP_HOST'] . '/admin/_e5b7rnijjrnrnnb_get_archive.php?filename=' . $file_name . '&path_archive=' . $path_archive);
// <-- 1. файлы в папку  - архивация