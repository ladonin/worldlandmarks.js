<?php
set_time_limit(9999999);
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
require_once('generic' . MY_DS . 'autorize.php');

require_once(MY_APPLICATION_DIR . 'modules' . MY_DS . 'base' . MY_DS . 'archive' . MY_DS . 'modules' . MY_DS . 'zip' . MY_DS . 'classes' . MY_DS . 'zip.php');
$zip = new \modules\base\archive\modules\zip\classes\zip;


$site = get_site_name($_REQUEST[MY_SERVICE_VAR_NAME]);
if ($site) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('неверно введено название карты');
    exit();
}


$map_table = $map . '_map_data';

$placemark_id = isset($_REQUEST['id']) ? (int) $_REQUEST['id'] : '';

$photos_table = $map . '_map_photos';

$sql = "SELECT

        c.id,
        c.title,
        c.comment_plain,
        c.category,
        c.subcategories,

        g.state_code,
        g.administrative_area_level_1,
        g.administrative_area_level_2,
        g.country_code,
        g.country,
        g.locality

        FROM $map_table c
        JOIN " . $map . "_geocode_collection g ON c.id=g.map_data_id AND g.language='" . MY_LANGUAGE_RU . "' ";
if ($placemark_id > 0) {
    $sql.="WHERE c.id=$placemark_id";
}

$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();


$dir = MY_DOCROOT . 'files' . MY_DS . 'export' . MY_DS . 'placemarks' . MY_DS . $map;
foreach ($result as $placemark) {

    $id = $placemark['id'];
    $title = $placemark['title'];
    $comment_plain = preg_replace("/^(?:.*(?:(?:[cС]сылка)|(?:[Ии]сточник)).*?http.+)$/mi", '', $placemark['comment_plain']);
    $category = $placemark['category'];
    $subcategories = $placemark['subcategories'];
    $state_code = $placemark['state_code'];
    $country_code = $placemark['country_code'];
    $state = translate_state_names($country_code, $placemark['administrative_area_level_1'], $state_code, MY_LANGUAGE_RU);
    $country = prepare_country_name($placemark['country']);
    $city = $placemark['locality'];

    //Чистим от возможных спецтегов

     $comment_plain=str_replace('[/p]', "\n", $comment_plain);
     $comment_plain=preg_replace('#\[.+?\]#', '', $comment_plain);

    // --> 1. файлы в папку
    $path = $dir . MY_DS . $id . '__' . $country;
    $comment_plain = preg_replace("/[\n\r]*$/", '', $comment_plain); //убираем переносы строк в конце
    $comment_plain.="\n\nНа карте: http://$site/map/$id"; //ссылка на нас
    // ->адрес
    $addres = $country . '. ';

    if (has_states($country_code)) {
        $addres .= $state . '. ';
    }
    if ($city) {
        $addres .= $city . '.';
    } else if ($placemark['administrative_area_level_2']) {
        $path .= '.' . $placemark['administrative_area_level_2'];
    }
    $comment_plain = $addres . "\n\n" . $comment_plain;
    // <- адрес

    $comment_plain = trim($title, '.') . ".\n" . $comment_plain; //заголовок


    @mkdir($dir);


    if (has_states($country_code)) {
        $path .= '.' . $state;
    }
    $path .= '__' . str_replace("\'\"\/", '', $title);
    $path = my_prepare_strange_words($path);

    @removeDir($path); //удалим сперва старый каталог метки
    mkdir($path);

    $fp = fopen($path . MY_DS . "content.txt", "w");
    // записываем в файл текст
    fwrite($fp, $comment_plain);
    // закрываем
    fclose($fp);

    //берем фотки
    $sql = "SELECT * FROM $photos_table where map_data_id = $id";
    $photos = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    foreach ($photos as $key => $photo) {
        $photo_num = $key == 0 ? 'main' : $key;
        $photo_type = explode('.', $photo['path']);
        $new_current_photo_path = $path . MY_DS . $photo_num . '.' . $photo_type[1];

        $current_photo_path=prepare_photo_path($id, $photo['path'],'1_', false, false, $map);

        if (!copy($current_photo_path, $new_current_photo_path)) {
            //echo "не удалось скопировать $current_photo_path...\n";
        }
    }
    // <-- 1. файлы в папку
}


// --> 1. файлы в папку  - архивация
if ($placemark_id > 0) {
    sleep(1);
    $path_archive = $path . '.zip';
    @unlink($path_archive);

    $zip->archive($path, $path_archive);

    removeDir($path);
    // оставляем только НОВЫЙ архив

    $file_name = prepare_to_dir_name(my_translater_ru_to_en($title));

    if (!$file_name) {
        $file_name = "$placemark_id";
    }
    $file_name.= '.zip';

// <-- 1. файлы в папку  - архивация
} else {
    sleep(5);

// --> 1. файлы в папку  - архивация
    $path_archive = $dir . '.zip';
    @unlink($path_archive);

//Удаляем файл
    $zip->archive($dir, $path_archive);
    removeDir($dir);
    $file_name = $map . '.zip';
    sleep(5);
// <-- 1. файлы в папку  - архивация
}

header("Location: http://" . $_SERVER['HTTP_HOST'] . '/admin/_e5b7rnijjrnrnnb_get_archive.php?filename=' . $file_name . '&path_archive=' . $path_archive);
