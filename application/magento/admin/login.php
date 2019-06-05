<?php

error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title='Вход в панель администратора';
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');

include('generic/header.php');

if ($_POST) {

    $name = $connect->quote($_POST['name']);
    $password = $_POST['password'];
    $sql = "SELECT * FROM users_registered WHERE name=$name";

    $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
    $password_hash = $result['password_hash'];

    if (hash_equals_to_value($password, $password_hash)) {
        $host_without_www = str_replace('www.', '', $_SERVER['HTTP_HOST']);
        $host_with_www = 'www.' . $host_without_www;

        setcookie("HASH", $result['password_hash'], time() + 36000000, '/', $host_without_www, 0, 1);
        setcookie("ID", $result['id'], time() + 36000000, '/', $host_without_www, 0, 1);

        setcookie("HASH", $result['password_hash'], time() + 36000000, '/', $host_with_www, 0, 1);
        setcookie("ID", $result['id'], time() + 36000000, '/', $host_with_www, 0, 1);

        $_COOKIE["HASH"] = $result['password_hash'];
        $_COOKIE["ID"] = $result['id'];

header("location:/admin");


        exit();
    } else {
        echo('<div class="alert alert-danger" role="alert">Данные введены неверно</div>');
    }
}
?><div class="row">

<div class="well well-lg" style="width:242px; margin:30px auto">
<form action='' method="post">
    <h3>Авторизация</h3>


<div class="input-group">

  <input type="text" name="name" class="form-control" placeholder="Логин" aria-describedby="basic-addon1">
</div>

    <br>
<div class="input-group">

  <input type="password" name="password" class="form-control" placeholder="Пароль" aria-describedby="basic-addon1">
</div>
    <br>
    <input type="submit" class="btn btn-success" value="Войти">
</form>
</div>
</div>
<?php include('generic/footer.php'); ?>