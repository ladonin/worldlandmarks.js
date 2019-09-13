<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Перевести штат, область';

require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require_once('generic' . MY_DS . 'autorize.php');

if (is_valid_service($_REQUEST[MY_SERVICE_VAR_NAME])) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('<div class="alert alert-danger" role="alert">Неверно введено название карты</div>');
    exit();
}

$country_code=$_GET['country_code'];
$state_code=$_GET['state_code'];
$name=trim(urldecode($_GET['name']));
$language = trim(@$_POST['language']);
$translate = trim(@$_POST['translate']);





$sql = "SELECT *
    FROM country
    WHERE local_code = " . $connect->quote($country_code);
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$country_id = $data['id'];


$sql = "SELECT id
    FROM country_states
    WHERE url_code = " . $connect->quote($state_code);
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$state_id = $data['id'];



$sql = "SELECT name
    FROM country_states_google_names
    WHERE language='EN' AND state_id = " . $state_id;
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$state_google_name = $data['name'];






if (!$country_id || !$state_id || !$name) {
    echo('неверно указаны данные');
    exit();
}
?>

<form method='post' style="margin:50px auto; width:500px;">
    <?=$name?> (<?=$state_google_name;?>) : <input type='text' name="translate"><br>
    язык: <select name="language">
        <option value="RU" selected>RU</option>
        <option value="EN">EN</option>
    </select><br><br>
    <input type="submit" value="отправить">
</form>
<?php


if ($translate) {






$sql = "SELECT id FROM country_states_cities_google_translates WHERE
    country_id=$country_id AND state_id=$state_id AND google_name={$connect->quote($state_google_name)} AND is_city=0 AND language={$connect->quote($language)}";
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$id = $data['id'];
if ($id) {
    // обновляем
    $sql = "UPDATE country_states_cities_google_translates SET translate={$connect->quote($translate)}
        WHERE id = $id";
    $connect->query($sql);
    echo($name. '('.$state_google_name.') обновлено на ' . $translate);
} else {
    // добавляем
    $sql = "INSERT INTO country_states_cities_google_translates
    (`country_id`, `state_id`, `language`, `google_name`, `translate`) VALUES
    ($country_id, $state_id, {$connect->quote($language)}, {$connect->quote($state_google_name)}, {$connect->quote($translate)})";
    $connect->query($sql);
    echo(' добавлен перевод для ' . $name. '('.$state_google_name.') :' . $translate);
}

}
















 include('generic/footer.php');
?>