<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Новая статья';

require('generic' . MY_DS . 'constants.php');
require(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require('generic' . MY_DS . 'connection.php');
include('generic/header.php');
require('generic' . MY_DS . 'autorize.php');



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
        if (isset($_POST['title']) && $_POST['title']) {

            $title = $_POST['title'];
            $content = $_POST['content'];

            if ($_POST['source']) {
                $content .= $content . "\n\nИсточник: " . $_POST['source'];
            }

            $categories = $_POST['categories'];
            $seo_description = $_POST['seo_description'];

            $keywords = $_POST['keywords'];
            if ($keywords === '') {
                echo('<div class="alert alert-danger" role="alert">Введите ключевые слова</div>');
                return;
            }


            $country = $_POST['country_id'];
            if ($country === '') {
                echo('<div class="alert alert-danger" role="alert">Введите страну</div>');
                return;
            }

            $url = 'http://' . $site_name . '/admin_access/add_article/ve6bbunu5nmn';
            $data = array(
                'title' => $title,
                'content' => $content,
                'categories' => $categories,
                'country' => $country,
                'keywords' => $keywords,
                'seo_description' =>  $seo_description
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
                echo('Ошибка запроса add_article');
                return;
            } else {
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

        <h5>Категории статьи - цифрой (необязательно)</h5>
        <input type="text" name="categories" class="form-control" style="max-width:50px;" value="<?php echo(isset($_POST['categories']) ? $_POST['categories'] : ''); ?>">

        <h5>Страна</h5>
        <select class="form-control" name="country_id" style="max-width:550px;">
<?php foreach (get_countries(MY_LANGUAGE_RU) as $country) { ?>
                <option
                    value="<?php echo($country['id']); ?>"
                    <?php if (isset($_POST['country_id']) && $_POST['country_id'] && $_POST['country_id'] == $country['id']) {
                        echo("selected");
                    } ?>
                    ><?php echo($country['name']); ?></option>
        <?php } ?>
        </select>

        <?php /*
          <br>

          <div style="cursor:pointer; font-weight:bold;">Импортировать свои фотографии</div>

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
          <script>
          placemark_outer_photos_checking('<?php echo($site_name);?>');
          </script>
         */ ?>
        <br>

        <h5>Содержание</h5>

        <?php $prepare_name_for_articles = 1; require_once('generic' . MY_DS . 'text_redactor.php'); ?>
        <textarea id="content" type="text" name="content" class="form-control" style="height:400px"><?php echo(isset($_POST['content']) ? $_POST['content'] : ''); ?></textarea>

        <h5>Ключевые слова</h5>
        <input type="text" name="keywords" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['keywords']) ? $_POST['keywords'] : ''); ?>">

        <h5>Seo description</h5>
        <textarea type="text" name="seo_description" class="form-control" style="height:400px"><?php echo(isset($_POST['seo_description']) ? $_POST['seo_description'] : ''); ?></textarea>


        <h5>URL источника (если нужно)</h5>
        <input type="text" name="source" class="form-control" style="max-width:350px;" value="<?php echo(isset($_POST['source']) ? $_POST['source'] : ''); ?>">

        <br>
        <input type="submit" value='Создать' class="btn btn-success">
    </form>



    <?php $show_categories_list=true; require_once('generic' . MY_DS . 'categories_list.php'); ?>













</div>






<?php include('generic/footer.php');
?>