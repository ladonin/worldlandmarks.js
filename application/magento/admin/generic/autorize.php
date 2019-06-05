<?php
// авторизация
define('MY_MODULE_ACCOUNT_ROLE_ADMIN_CODE', 9);
$id = isset($_COOKIE['ID']) ? (int) $_COOKIE['ID'] : null;
$cookies_hash = isset($_COOKIE['HASH']) ? $_COOKIE['HASH'] : null;
if ($id && $cookies_hash) {
    $sql = "SELECT * FROM users_registered WHERE id=$id AND role='" . MY_MODULE_ACCOUNT_ROLE_ADMIN_CODE . "'";
    $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
    $password_hash = $result['password_hash'];
}
if (!$id || !$cookies_hash || ($password_hash !== $cookies_hash)) {
    ?>

<div class="alert alert-danger" role="alert">
    Нужно авторизоваться под администратором - <a href="/admin/login.php">перейти</a>
</div>

    <?php exit();
}