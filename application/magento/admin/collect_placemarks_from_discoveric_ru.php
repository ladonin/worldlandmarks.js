<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Импортировать метки с сайта discoveric.ru';

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
<div class="well well-lg" style="padding-top:10px !important;padding-bottom:10px !important; width:50%">

    <br>
    <?php


    function go($site_name)
    {
        $domain = 'http://discoveric.ru';

        if (isset($_POST['url']) && $_POST['url']) {

            $html = file_get_contents($_POST['url']);

            preg_match("#<h1(?:.+?)>(.+?)<\/h1>#", $html, $result);
            $title = preg_replace('/<span>(.+?)<\/span>/im', '', $result[1]);

            preg_match_all("#<div itemscope (?:.+?)>(?:.+?)(<p>.*</p>)(?:.+?)<div class=\"footer\">#sm", $html, $result, PREG_SET_ORDER);

            $comment = isset($result[0][1]) && $result[0][1] ? $result[0][1] : null;

            if (!$comment) {
                // Ищем по-другому
                preg_match_all('#\$\(function\(\)\{initialize\(\);\}\);(?:.+?)<\/script>(?:.+?)<\!--\/noindex-->(?:.+?)<\/div>(?:[\t\n\r]+?)(.+?)(?:[\t\n\r]+?)<\!--noindex-->#sm', $html, $result, PREG_SET_ORDER);

                $comment = isset($result[0][1]) && $result[0][1] ? $result[0][1] : $_POST['comment'];
            }

            if (!$comment) {
                echo('<div class="alert alert-danger" role="alert">Описание не найдено на сайте, пожалуйста, введите его вручную</div>');
                return;
            }
            $comment .= $comment . "\n\nИсточник: " . $_POST['url'];

            $comment = trim($comment," \t\n\r");


            preg_match_all("#var fenway = new google\.maps\.LatLng\(([-\d\.]+), ([-\d\.]+)\);#sm", $html, $result, PREG_SET_ORDER);
            $coods = isset($result[0]) ? $result[0] : null;
            $y = isset($coods[1]) && $coods[1] ? $coods[1] : $_POST['y'];
            $x = isset($coods[2]) && $coods[2] ? $coods[2] : $_POST['x'];

            if (!$y || !$x) {
                echo('<div class="alert alert-danger" role="alert">Введите координаты, на сайте их нет</div>');
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

            // если не приложили свои фото, то берем с сайта
            if (!$photos){

                preg_match_all("#<a rel=\"fb_group\" href=\"(.+?)\"#sm", $html, $result, PREG_SET_ORDER);
                foreach ($result as $photo) {
                    //list($width, $height, $type, $attr) = getimagesize($domain . $photo[1]);
                    //if ($width>=900){
                    $photos[] = $domain . $photo[1];
                    //}
                }
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
            }else {
            $_POST = array();
            echo($result);
            }
        }
    }
    go($site_name);
    ?>


    <form action='' method="post">
        <h3>Укажите url метки</h3>
        <input type="text" name="url" class="form-control" value="<?php echo(isset($_POST['url']) ? $_POST['url'] : ''); ?>">

        <h3>Категория метки - цифрой</h3>
        <input type="text" name="category" class="form-control" style="width:50px;" value="<?php echo(isset($_POST['category']) ? $_POST['category'] : ''); ?>">

        <h3>Подкатегории метки (если есть)</h3>
        <input type="text" name="subcategories" class="form-control" style="width:350px;" value="<?php echo(isset($_POST['subcategories']) ? $_POST['subcategories'] : ''); ?>">

        <br>
        <div style="cursor:pointer; font-weight:bold;" onclick="$('#photos').toggle()">Импортировать свои фотографии</div>
        <div id="photos" style="display:none; background-color:#fff;" class="well well-lg">
            <h5>Url фотографий</h5>
            <input type="text" name="my_photos[0]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][0]) ? $_POST['my_photos'][0] : ''); ?>">
            <input type="text" name="my_photos[1]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][1]) ? $_POST['my_photos'][1] : ''); ?>">
            <input type="text" name="my_photos[2]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][2]) ? $_POST['my_photos'][2] : ''); ?>">
            <input type="text" name="my_photos[3]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][3]) ? $_POST['my_photos'][3] : ''); ?>">
            <input type="text" name="my_photos[4]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][4]) ? $_POST['my_photos'][4] : ''); ?>">
            <input type="text" name="my_photos[5]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][5]) ? $_POST['my_photos'][5] : ''); ?>">
            <input type="text" name="my_photos[6]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][6]) ? $_POST['my_photos'][6] : ''); ?>">
            <input type="text" name="my_photos[7]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][7]) ? $_POST['my_photos'][7] : ''); ?>">
            <input type="text" name="my_photos[8]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][8]) ? $_POST['my_photos'][8] : ''); ?>">
            <input type="text" name="my_photos[9]" class="form-control my_photos" style="width:350px;" value="<?php echo(isset($_POST['my_photos'][9]) ? $_POST['my_photos'][9] : ''); ?>">
        </div>
            <script>
                placemark_outer_photos_checking('<?php echo($site_name);?>');
            </script>

        <br>
        <div style="cursor:pointer;" onclick="$('#additional_options').toggle()">Дополнительные опции</div>
        <div id="additional_options" style="display:none; background-color:#fff;" class="well well-lg">

            <h5>Координата X (если нужно)</h5>
            <input type="text" name="x" class="form-control" style="width:350px;" value="<?php echo(isset($_POST['x']) ? $_POST['x'] : ''); ?>">

            <h5>Координата Y (если нужно)</h5>
            <input type="text" name="y" class="form-control" style="width:350px;" value="<?php echo(isset($_POST['y']) ? $_POST['y'] : ''); ?>">

            <h5>Описание (если нужно)</h5>
            <textarea type="text" name="comment" class="form-control" style="height:200px"><?php echo(isset($_POST['comment']) ? $_POST['comment'] : ''); ?></textarea>
        </div>

        <br>
        <input type="submit" value='Импорт' class="btn btn-success">
    </form>










    <h5>Категории:</h5>
    <?php
    $categories = get_categories(MY_LANGUAGE_RU);
    foreach ($categories as $category) {

        echo($category['id'] . ': ' . $category['name'] . '<br>');
    }
    ?>













</div>






<?php include('generic/footer.php');
?>