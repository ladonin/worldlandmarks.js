<?php
$config_mysql = require_once(MY_APPLICATION_DIR . 'config' . MY_DS . 'ignore' . MY_DS . 'mysql.php');

try {
    $db = $config_mysql['mysql'];
    $pdo = new \PDO(
            'mysql:host=' . $db['host'] . ';dbname=' . $db['dbase'] . ';charset=' . $db['charset'], $db['user'], $db['password'], array(
        \PDO::ATTR_PERSISTENT => $db['persistent'],
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION)
    );
    $pdo->exec('set names ' . $db['charset']);
} catch (\PDOException $e) {
    echo '[connect error]';
    exit();
}
if (@$pdo) {
    $connect = $pdo;
} else {
    echo '[connect error]';
    exit();
}