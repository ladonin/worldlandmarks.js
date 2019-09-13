<?php
//задаем всем меткам country_code и state_code
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
require_once('generic' . MY_DS . 'autorize.php');

if (is_valid_service($_REQUEST[MY_SERVICE_VAR_NAME])) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('неверно введено название карты');
    exit();
}

$data_table = $map . '_map_data';

$sql = "SELECT * FROM $data_table";
$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

foreach ($result as $data) {

    $query = 'https://maps.googleapis.com/maps/api/geocode/json' . '?latlng=' . $data['y'] . ',' . $data['x'] . '&language=en';
    $request_json = file_get_contents($query);
    $request_array = json_decode($request_json, true);
    $address_components = $request_array['results'][0]['address_components'];

    foreach ($address_components as $parameters) {

        if ($parameters['types'][0] === 'country') {
            $country_code = my_prepare_to_one_word($parameters['long_name']);
        } else if ($parameters['types'][0] === 'administrative_area_level_1') {
            $state_code = my_prepare_to_one_word($parameters['long_name']);
        }
    }
    $sql = "UPDATE " . $map . "_geocode_collection SET state_code='$state_code', country_code='$country_code' WHERE map_data_id='" . $data['id'] . "'";
    $connect->query($sql);
}

echo 'success';
