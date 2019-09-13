<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Перевести локацию, город';

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
$locality_source = trim(urldecode($_GET['locality_source']));
$only_for_state = (int)(@$_POST['only_for_state']);



$sql = "SELECT *
    FROM country
    WHERE local_code = " . $connect->quote($country_code);
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$country_id = $data['id'];


$sql = "SELECT has_states
    FROM country_params
    WHERE country_id = " . $country_id;
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$has_states = $data['has_states'];



if ($has_states == 1) {
$sql = "SELECT id
    FROM country_states
    WHERE url_code = " . $connect->quote($state_code);
    $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
    $state_id = $data['id'];
}
else {
    $state_id='no states';
}


if (!$country_id || !$state_id || !$name || !$locality_source) {
    echo('неверно указаны данные');
    exit();
}
?>

<form method='post' style="margin:50px auto; width:500px;">
    для штата (по умолчанию для <?=$state_code;?>) : <input type='text' name="only_for_state" value="<?=$state_id;?>"><br>
    <?=$name?> (<?=$locality_source;?>) : <input type='text' name="translate"><br>
    язык: <select name="language">
        <option value="RU" selected>RU</option>
        <option value="EN">EN</option>
    </select><br><br>
    <input type="submit" value="отправить">
</form>
<?php


if ($translate) {






$sql = "SELECT id FROM country_states_cities_google_translates WHERE
    country_id=$country_id AND state_id=0 AND google_name={$connect->quote($locality_source)} AND is_city=1 AND only_for_state=$only_for_state AND language={$connect->quote($language)}";
$data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
$id = $data['id'];
if ($id) {
    // обновляем
    $sql = "UPDATE country_states_cities_google_translates SET translate={$connect->quote($translate)}
        WHERE id = $id";
    $connect->query($sql);
    echo($name. '('.$locality_source.') обновлено на ' . $translate);
} else {
    // добавляем
    $sql = "INSERT INTO country_states_cities_google_translates
    (`country_id`, `language`, `google_name`, `translate`, `only_for_state`, `is_city`) VALUES
    ($country_id, {$connect->quote($language)}, {$connect->quote($locality_source)}, {$connect->quote($translate)}, $only_for_state, 1)";
    $connect->query($sql);
    echo(' добавлен перевод для ' . $name. '('.$locality_source.') :' . $translate);
}

}
















 include('generic/footer.php');
?>