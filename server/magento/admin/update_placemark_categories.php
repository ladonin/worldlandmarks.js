<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Управление категориями и релевантностью меток';
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

if ($_POST) {
    $sql = "UPDATE `$map_table` SET "
            . "category='" . (int) $_POST['category'] . "', "
            . "subcategories=" . $connect->quote(str_replace(' ', '', $_POST['subcategories'])) . ", "
            . "relevant_placemarks=" . $connect->quote(str_replace(' ', '', $_POST['relevant_placemarks'])) . " "
            . "WHERE id=$map_data_id";
    $connect->query($sql);
}

$sql = "SELECT * FROM `$map_table` WHERE id=$map_data_id";
$result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();


if (!$result['title']) {
    $result['title'] = '<b>метка без названия</b> #' . $result['id'];
}
?>
<div class="col-md-5">


    <?php if (@$result['id']) { ?>
        <form action='' method="post">
            <h3><?php echo(@$result['id'] . ': ' . @$result['title']) ?></h3>


            <div class="input-group">

                <h5>Категория</h5>
                <textarea cols="80" class="form-control" name="category"><?php echo(@$result['category']) ?></textarea><br>
            </div>

            <div class="input-group">

                <h5>Подкатегории</h5>
                <textarea cols="80" class="form-control" name="subcategories"><?php echo(@$result['subcategories']) ?></textarea><br>
            </div>

            <div class="input-group">

                <h5>Релевантные метки</h5>
                <textarea cols="80" class="form-control" name="relevant_placemarks"><?php echo(@$result['relevant_placemarks']) ?></textarea><br>
            </div>




            <br>
            <input type="submit" value="Сохранить" class="btn btn-success">
        </form>
    <?php } else {
        ?>

        <div class="alert alert-warning" role="alert">Выберите метку справа</div>




        <?php }
    ?>
    <div class="list-group">
        <?php
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

    </div>
    <?php $show_categories_list=true; require_once('generic' . MY_DS . 'categories_list.php'); ?>
        <?php if (@$result['id']) { ?>
        <div class="well well-lg">
            <a href="/map/<?php echo($result['id']); ?>" target="_blank">посмотреть на карте</a>
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
                <br><img style="margin-top:5px; width:100%" src="<?php echo($photo_path);
                ?>">
                <?php
            }
            ?>
        </div>
                 <?php } ?>
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