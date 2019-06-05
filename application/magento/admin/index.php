<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title = 'Панель администратора';
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require_once('generic' . MY_DS . 'autorize.php');
?>




<div class="list-group">

    <div class="list-group-item  list-group-item-info">
        <h1>Панель администратора </h1>
    </div>

    <a class="list-group-item" style="border-left:15px solid #ffcb81; color:#337ab7 !important" href="admin/collect_users_from_odnoklassniki.php">Собрать/показать пользователей из одноклассников</a>

    <a class="list-group-item" style="border-left:10px solid #f984ff; color:#337ab7 !important" href="admin/update_placemark_categories.php">Управление категориями и релевантностью меток</a>
    <a class="list-group-item" style="border-left:10px solid #f984ff; color:#337ab7 !important" href="admin/update_placemark_seo.php">Управление SEO меток</a>

    <a  class="list-group-item" style="border-left:15px solid #8cff7f; color:#337ab7 !important" href="admin/update_placemark_data.php">Обновить общие данные меток</a>
    <a class="list-group-item" style="border-left:15px solid #8cff7f; color:#337ab7 !important" href="admin/update_placemark_adress.php">Обновить адреса меток</a>

    <a  class="list-group-item" style="border-left:10px solid #78bfff; color:#337ab7 !important" href="admin/create_new_placemark.php">Добавить метку вручную</a>
    <a  class="list-group-item" style="border-left:10px solid #78bfff; color:#337ab7 !important" href="admin/collect_placemarks_from_discoveric_ru.php">Импортировать метки с сайта discoveric.ru</a>

    <a class="list-group-item" style="border-left:15px solid #ff637f; color:#337ab7 !important" href="admin/export_placemarks_index.php">Экспорт меток</a>
    <a class="list-group-item" style="border-left:15px solid #ff637f; color:#337ab7 !important" href="admin/export_placemark_categories.php">Экспорт фотографий меток по категориям</a>
    <a  class="list-group-item" style="border-left:15px solid #ff637f; color:#337ab7 !important" href="admin/export_placemark_countries.php">Экспорт фотографий меток по странам</a>


    <a  class="list-group-item" style="border-left:10px solid #333; color:#337ab7 !important" href="admin/new_article.php">Новая статья</a>
    <a  class="list-group-item" style="border-left:10px solid #333; color:#337ab7 !important" href="admin/update_article.php">Обновить статью</a>

</div>
<?php include('generic/footer.php'); ?>