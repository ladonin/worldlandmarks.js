<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Обновить общие данные меток';
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
$site_name = get_site_name($map);
//$site_name = 'world-landmarks.loc'; ///////////////////////////////////////////////////////////////////////////////////////
//////////////
if ($_POST) {


    $url = 'http://' . $site_name . '/admin_access/update_placemark/ve6bbunu5nmn';
    $data = array(
        'id' => $map_data_id,
        'title' => $_POST['title'],
        'replace_my_photos' => isset($_POST['replace_my_photos']) ? true : false,
        'comment' => $_POST['comment'],
        'x' => $_POST['x'],
        'y' => $_POST['y'],
        'photos' => $_POST['my_photos'],
        'category' => $_POST['category'],
        'subcategories' => $_POST['subcategories'],
    );

    // use key 'http' even if you send the request to https://...
    $options = array(
        'http' => array(
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        )
    );
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    if ($result === FALSE) {
        echo('Ошибка запроса update_placemark');
    } else {
        echo($result);
        $_POST = array();
    }
}

///////////////




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



                <input type="checkbox" name="replace_my_photos" style="float:left; margin-right:10px;"> перезаписать существующие фото на новые<br>



                <h5>Добавить к текущим/перезаписать фотографии - введите URL или оставьте поля пустыми, если вообще не хотите обновлять фото</h5>
                <input type="text" name="my_photos[0]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][0]) ? $_POST['my_photos'][0] : ''); ?>"><br>
                <input type="text" name="my_photos[1]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][1]) ? $_POST['my_photos'][1] : ''); ?>"><br>
                <input type="text" name="my_photos[2]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][2]) ? $_POST['my_photos'][2] : ''); ?>"><br>
                <input type="text" name="my_photos[3]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][3]) ? $_POST['my_photos'][3] : ''); ?>"><br>
                <input type="text" name="my_photos[4]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][4]) ? $_POST['my_photos'][4] : ''); ?>"><br>
                <input type="text" name="my_photos[5]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][5]) ? $_POST['my_photos'][5] : ''); ?>"><br>
                <input type="text" name="my_photos[6]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][6]) ? $_POST['my_photos'][6] : ''); ?>"><br>
                <input type="text" name="my_photos[7]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][7]) ? $_POST['my_photos'][7] : ''); ?>"><br>
                <input type="text" name="my_photos[8]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][8]) ? $_POST['my_photos'][8] : ''); ?>"><br>
                <input type="text" name="my_photos[9]" class="form-control my_photos" style="max-width:550px;" value="<?php echo(isset($_POST['my_photos'][9]) ? $_POST['my_photos'][9] : ''); ?>">

            <script>
                placemark_outer_photos_checking('<?php echo($site_name);?>');
            </script>

            <br>



                <h5>Заголовок</h5>
                <input type="text" name="title" class="form-control" style="max-width:550px;" value="<?php echo(@$result['title']); ?>">
                <br><br>

                <h5>Категория метки - цифрой</h5>
                <input type="text" name="category" class="form-control" style="max-width:50px;" value="<?php echo(@$result['category']); ?>">
                <br><br>
                <h5>Подкатегории метки</h5>
                <input type="text" name="subcategories" class="form-control" style="max-width:550px;" value="<?php echo(@$result['subcategories']); ?>">




                <h5>Координата X</h5>
                <input type="text" name="x" class="form-control" style="max-width:550px;" value="<?php echo(@$result['x']); ?>">
                <br><br>
                <h5>Координата Y</h5>
                <input type="text" name="y" class="form-control" style="max-width:550px;" value="<?php echo(@$result['y']); ?>">
                <br><br>
                <h5>Описание</h5>
                <textarea type="text" name="comment" class="form-control" style="height:200px"><?php echo(@$result['comment_plain']); ?></textarea>


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
                <br><img style="margin-top:5px;width:100%" src="<?php echo($photo_path);
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