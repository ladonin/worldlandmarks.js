<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Экспорт меток';
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


$photos_table = $map . '_map_photos';
$files_dir = $map;
$map_table = $map . '_map_data';

$map_data_id = @(int) $_GET['map_data_id'];
$category_id = isset($_GET['category_id']) ? $_GET['category_id'] : 'none';
if ($category_id === '') {
    $category_id = 'none';
}

$sql = "SELECT * FROM `$map_table` WHERE id=$map_data_id";
$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();


if (!$result['title']) {
    $result['title'] = '<b>метка без названия</b> #' . $result['id'];
}
?>

<div class="col-md-5">



    <a href="export_placemarks.php" class="btn btn-danger">Получить архив всех меток</a><br><br>
    <div class="alert alert-warning" role="alert">Внимание! Архивация всех меток займет от 15 до 30 минут.</div>


    <?php
    if (!$map_data_id) {
        ?>

        <div class="alert alert-warning" role="alert">Выберите метку справа</div>




        <?php
    }






    $class = '';
    if (($category_id === 'none')) {
        $class = ' active';
    }

    echo('<a class="list-group-item' . $class . '" href="?category_id=none">');
    echo('<b>Все метки</b>');
    echo('</a>');
    $categories = get_categories(MY_LANGUAGE_RU);
    foreach ($categories as $category) {
        $class = '';
        if (($category_id !== 'none') && ($category_id == $category['id'])) {
            $class = ' active';
        }
        echo('<a class="list-group-item' . $class . '" href="?category_id=' . $category['id'] . '">');
        echo($category['id'] . ': ' . $category['name']);
        echo('</a>');
    }
    ?>
    <br>
    <br>
    <a href="export_placemarks.php?id=<?php echo($map_data_id); ?>" class="btn btn-success">Получить архив</a>
    <br>
    <br>
    <?php if ($map_data_id) { ?>
        <div class="well well-lg">
            <a href="/map/<?php echo($map_data_id); ?>" target="_blank">посмотреть на карте</a>
            <br><br>
            <?php
            echo(@$result['comment']);
            ?>

            <?php
            $sql = "SELECT * FROM $photos_table WHERE map_data_id = $map_data_id";
            $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
            foreach ($result as $value) {
                $photo_path = prepare_photo_path($map_data_id, $value['path'], '9_', false, true, $map);
                ?>
                <br><img style="margin-top:5px;width:100%" src="<?php echo($photo_path);
                ?>">
                         <?php
                     }
                     ?>
        </div>
        <?php
    }
    ?>


</div>

<div class="list-group col-md-4" style="padding-left: 15px;">

    <?php
    $category_sql = '';
    if ($category_id !== 'none') {
        $category_sql = "WHERE category='" . $category_id . "' OR subcategories REGEXP '[[:<:]]" . $category_id . "[[:>:]]'";
    }

    $sql = "SELECT id, title FROM $map_table $category_sql order by id desc";

    $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
    foreach ($result as $value) {
        if (!$value['title']) {
            $value['title'] = '<b>метка без названия</b> #' . $value['id'];
        }
        ?>
        <a  class="list-group-item<?php
            if ($value['id'] == $map_data_id) {
                echo(" active");
            }
            ?>" href="<?php echo('?map_data_id=' . $value['id'] . '&category_id=' . $category_id); ?>">
                <?php echo($value['id'] . ': ' . $value['title']); ?>
        </a>
        <?php
    }
    ?>
</div>
<?php include('generic/footer.php'); ?>