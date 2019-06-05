<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title=$page_name = 'Экспорт фотографий меток по странам';
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require_once('generic' . MY_DS . 'autorize.php');



include('generic/breadcrumbs.php');


if (is_valid_service($_REQUEST[MY_SERVICE_VAR_NAME])) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('<div class="alert alert-danger" role="alert">Неверно введено название карты</div>');
    exit();
}



$sql = "SELECT DISTINCT country_code, country FROM " . $map . "_geocode_collection WHERE language='" . MY_LANGUAGE_RU . "' order by country";
$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
?>
<div class="col-md-5">
<h2>Экспорт фотографий по странам</h2>
<h4>Выберите страну для экспорта</h4>
<div class="alert alert-warning" role="alert">Внимание! При клике на страну начнется экспорт.</div>


            <?php
            foreach ($result as $country) {
                echo('<a class="list-group-item" href="_e5b7rnijjrnrnnb_export_photos.php?code_type=country&country_code=' . $country['country_code'] . '">');

                echo($country['country'] ? $country['country'] : 'Прочие места');
                echo('</a>');
            }
            ?>


<br>
</div>
<?php include('generic/footer.php'); ?>