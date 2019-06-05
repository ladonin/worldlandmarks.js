<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
date_default_timezone_set('UTC');

define('MY_DS', DIRECTORY_SEPARATOR);
require_once(realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . 'admin' . MY_DS . 'generic' . MY_DS . 'constants.php');

require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once(MY_APPLICATION_DIR . '..' . MY_DS . 'admin' . MY_DS . 'generic' . MY_DS . 'connection.php');
$config_allows = require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'allows.php');
$map = @$GLOBALS['argv'][1];
$language = @$GLOBALS['argv'][2];
$site_name = get_site_name($map);
if (!is_valid_service($map) || !$site_name) {
    echo('Укажите валидный сервис');
    exit();
}

//$site_name = 'world-landmarks.loc';

$available_languages = array(
    MY_LANGUAGE_RU,
    MY_LANGUAGE_EN
);
if (!in_array($language, $available_languages)) {
    echo('Укажите валидный язык');
    exit();
}
$data_table = $map . '_map_data';

$sql = "SELECT id FROM $data_table ORDER by id DESC";
$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
//проходим по каждой метке отдельно
foreach ($result as $data) {
    $result = file_get_contents('http://' . $site_name . '/admin_access/add_language_to_geocode_collection/' . $language . '/' . $data['id'] . '/ve6bbunu5nmn');
    echo $result;
}