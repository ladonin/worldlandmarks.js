<?php
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('../generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('../generic' . MY_DS . 'connection.php');


define('MY_SPAM_STATUS_INTEREST', 1);

if (!$_GET['email'] || !(int) $_GET['n'] || !(int) $_GET['c']) {
    echo('Ошибка, не все данные переданы :(');
    exit();
}

$email = $connect->quote($_GET['email']);
$email_id = (int) $_GET['n'];
$email_code = (int) $_GET['c'];
$map = $_REQUEST[MY_SERVICE_VAR_NAME];

$sql = "UPDATE `" . $map . "_spam` SET "
        . "status='" . MY_SPAM_STATUS_INTEREST . "', "
        . "modified='" . time() . "' "
        . "WHERE id=$email_id AND email=$email AND code=$email_code";
$connect->query($sql);


header("location:http://" . get_site_name($map) . "/map/m$email_id/c$email_code/interest");






