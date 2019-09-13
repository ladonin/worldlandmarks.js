<?php
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('../generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('../generic' . MY_DS . 'connection.php');

define('MY_SPAM_STATUS_NOT_INTEREST', -1);

if (!$_GET['email'] || !(int) $_GET['n'] || !(int) $_GET['c']) {
    echo('Ошибка, не все данные переданы :(');
    exit();
}

$email = $connect->quote($_GET['email']);
$email_id = (int) $_GET['n'];
$email_code = (int) $_GET['c'];
$map = $_REQUEST[MY_SERVICE_VAR_NAME];

$sql = "UPDATE `" . $map . "_spam` SET "
        . "status='" . MY_SPAM_STATUS_NOT_INTEREST . "', "
        . "modified='" . time() . "' "
        . "WHERE id=$email_id AND email=$email AND code=$email_code";
$connect->query($sql);
?>
<div style="width:100%; font-family: arial,sans-serif;">
    <div style="margin:0 auto; width:500px;">
        <img src="/img/email/cat_palms.jpg">
        <div style="margin:10px auto; font-size:17px; font-weight:bold; color:#333; text-align:center">Благодарим вас за уделенное нам время. Извините.</div>
    </div>
</div>