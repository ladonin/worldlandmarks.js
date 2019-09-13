<?php
set_time_limit(9999999);
error_reporting(E_ALL);
ini_set("display_errors", 1);

define('MY_DS', DIRECTORY_SEPARATOR);
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
require_once('generic' . MY_DS . 'autorize.php');





$file_name = $_REQUEST['filename'];
$path_archive = $_REQUEST['path_archive'];

//Высылаем пользователю архив
header("Content-Type: application/zip");
header("Content-Disposition: attachment; filename=$file_name");
header("Content-Length: " . filesize($path_archive));
readfile($path_archive);


// <-- 1. файлы в папку  - архивация


