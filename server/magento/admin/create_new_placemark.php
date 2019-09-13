<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Создать новую метку';

require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require_once('generic' . MY_DS . 'autorize.php');



if (is_valid_service($_REQUEST[MY_SERVICE_VAR_NAME])) {
    $map = $_REQUEST[MY_SERVICE_VAR_NAME];
} else {
    echo('<div class="alert alert-danger" role="alert">Неверно введено название карты</div>');
    exit();
}
////////////////$invite_table = $map . '_invite_odnoklassniki';

$site_name = get_site_name($map);
//$site_name = 'world-landmarks.loc'; ///////////////////////////////////////////////////////////////////////////////////////
include('generic/breadcrumbs.php');
?>
<div class="well well-xs" style="padding-top:10px !important;padding-bottom:10px !important; max-width:800px">

    <br>
    <?php

    function go($site_name)
    {

        if (isset($_POST['title']) && $_POST['title']) {

            $title = $_POST['title'];

            $comment = $_POST['comment'];;



            if ($_POST['source']) {
               $comment .= $comment . "\n\nИсточник: " . $_POST['source'];
            }
            $y = $_POST['y'];
            $x = $_POST['x'];

            if (!$y || !$x) {
                echo('<div class="alert alert-danger" role="alert">Введите координаты</div>');
                return;
            }
            if (!$x || !$y || $x >= 180 || $x <= -180 || $y <= -90 || $y >= 90) {
                echo('<div class="alert alert-danger" role="alert">Координаты введены неверно</div>');
                return;
            }
            $category = $_POST['category'];
            if ($category === '') {
                echo('<div class="alert alert-danger" role="alert">Введите категорию</div>');
                return;
            }
            $subcategories = $_POST['subcategories'];

            $photos=array();
            // Если приложили свои фото
            foreach($_POST['my_photos'] as $photo){
                if($photo){
                    $photos[]=$photo;
                }
            }
            if (!$photos) {
                echo('<div class="alert alert-danger" role="alert">Укажите фотографии</div>');
                return;
            }


            $url = 'http://' . $site_name . '/admin_access/add_placemark/ve6bbunu5nmn';
            $data = array(
                'title' => $title,
                'comment' => $comment,
                'x' => $x,
                'y' => $y,
                'photos' => $photos,
                'category' => $category,
                'subcategories' => $subcategories
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
                echo('Ошибка запроса add_placemark');
                return;
            }else{
                $_POST = array();
                echo($result);
            }
        }
    }
    go($site_name);
    ?>


    <form action='' method="post">
<h5>Заголовок</h5>
        <input type="text" name="title" class="form-control" style="max-width:550px;" value="<?php echo(isset($_POST['title']) ? $_POST['title'] : ''); ?>">

        <h5>Категория метки - цифрой</h5>
        <input type="text" name="category" class="form-control" style="max-width:50px;" value="<?php echo(isset($_POST['category']) ? $_POST['category'] : ''); ?>">

        <h5>Подкатегории метки (если есть)</h5>
        <input type="text" name="subcategories" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['subcategories']) ? $_POST['subcategories'] : ''); ?>">

        <br>
        <div style="cursor:pointer; font-weight:bold;">Импортировать свои фотографии</div>

            <h5>Url фотографий</h5>
            <input type="text" name="my_photos[0]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][0]) ? $_POST['my_photos'][0] : ''); ?>">
            <input type="text" name="my_photos[1]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][1]) ? $_POST['my_photos'][1] : ''); ?>">
            <input type="text" name="my_photos[2]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][2]) ? $_POST['my_photos'][2] : ''); ?>">
            <input type="text" name="my_photos[3]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][3]) ? $_POST['my_photos'][3] : ''); ?>">
            <input type="text" name="my_photos[4]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][4]) ? $_POST['my_photos'][4] : ''); ?>">
            <input type="text" name="my_photos[5]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][5]) ? $_POST['my_photos'][5] : ''); ?>">
            <input type="text" name="my_photos[6]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][6]) ? $_POST['my_photos'][6] : ''); ?>">
            <input type="text" name="my_photos[7]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][7]) ? $_POST['my_photos'][7] : ''); ?>">
            <input type="text" name="my_photos[8]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][8]) ? $_POST['my_photos'][8] : ''); ?>">
            <input type="text" name="my_photos[9]" class="form-control my_photos" style="max-width:350px;" value="<?php echo(isset($_POST['my_photos'][9]) ? $_POST['my_photos'][9] : ''); ?>">
            <script>
                placemark_outer_photos_checking('<?php echo($site_name);?>');
            </script>

        <br>



            <h5>Координата X</h5>
            <input type="text" name="x" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['x']) ? $_POST['x'] : ''); ?>">

            <h5>Координата Y</h5>
            <input type="text" name="y" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['y']) ? $_POST['y'] : ''); ?>">

            <h5>Описание</h5>
            <textarea type="text" name="comment" class="form-control" style="height:200px"><?php echo(isset($_POST['comment']) ? $_POST['comment'] : ''); ?></textarea>

            <h5>URL источника (если нужно)</h5>
            <input type="text" name="source" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['source']) ? $_POST['source'] : ''); ?>">

        <br>
        <input type="submit" value='Импорт' class="btn btn-success">
    </form>








    <?php $show_categories_list=true; require_once('generic' . MY_DS . 'categories_list.php'); ?>











</div>






<?php include('generic/footer.php');
?>