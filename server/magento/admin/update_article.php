<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Обновить статью';

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

  <div class="col-md-5">
    <?php


    function go($site_name)
    {
        $id = @(int)$_GET['id'];

        if (isset($_POST['delete']) && $_POST['delete'] == 1) {

            $url = 'http://' . $site_name . '/admin_access/delete_article/ve6bbunu5nmn';
            $data = array(
                'id' => $id,
                'title' => $_POST['title']
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
                echo('Ошибка запроса delete_article');
                return;
            } else {
                $_POST = array();
                echo($result);
            }
      } else if ($id && isset($_POST['title']) && $_POST['title']) {

            $title = $_POST['title'];
            $content = $_POST['content'];

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

            $url = 'http://' . $site_name . '/admin_access/update_article/ve6bbunu5nmn';
            $data = array(
                'id' => $id,
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
                echo('Ошибка запроса update_article');
                return;
            } else {
                $_POST = array();
                echo($result);
            }
        }
    }
    go($site_name);
    $article_id = @(int)$_GET['id'];
    $data = array();
    if (isset($_POST['title'])) {
        //если обновляем
        $data = $_POST;
    } else if ($article_id) {
        //если только начали обновлять конкретную метку
        $data = get_articles($article_id);
    }




    if ($data) {

    ?>

    <form action='' method="post">
        <h5>Заголовок</h5>
        <input type="text" name="title" class="form-control" style="max-width:550px;" value="<?php echo($data['title']); ?>">

        <h5>Категории статьи - цифрой (необязательно)</h5>
        <input type="text" name="categories" class="form-control" style="max-width:50px;" value="<?php echo($data['categories']); ?>">

        <h5>Страна</h5>
        <select class="form-control" name="country_id" style="max-width:550px;">
<?php foreach (get_countries(MY_LANGUAGE_RU) as $country) { ?>
                <option
                    value="<?php echo($country['id']); ?>"
                    <?php if ($data['country_id'] == $country['id']) {
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
        <?php require_once('generic' . MY_DS . 'text_redactor.php'); ?>
        <h5>Содержание</h5>
        <textarea id="content" type="text" name="content" class="form-control" style="height:400px"><?php echo($data['content_plain']); ?></textarea>

        <h5>Ключевые слова</h5>
        <input type="text" name="keywords" class="form-control" style="max-width:350px;" value="<?php echo($data['keywords']); ?>">

        <h5>Seo description</h5>
        <textarea type="text" name="seo_description" class="form-control" style="height:400px"><?php echo($data['seo_description']); ?></textarea>

        <br>
        <input type="submit" value='Обновить' class="btn btn-success">
    </form>

    <?php $show_categories_list=true; $prepare_name_for_articles = 1;  require_once('generic' . MY_DS . 'categories_list.php'); ?>


    <br>
    <form action='' method="post" onsubmit='return confirm("Вы уверены, что хотите удалить статью \"<?php echo($data['title']); ?>\"?")';>
        <input type="hidden" name='delete' value='1'>
        <input type="hidden" name='title' value='<?php echo($data['title']); ?>'>
        <input type="submit" value='Удалить' class="btn btn-danger">


    </form>
    <?php } else {
        ?>
        <div class="alert alert-warning" role="alert">Выберите статью справа</div>
    <?php }
    ?>

<br>





















</div>


<div class="list-group col-md-4" style="padding-left: 15px;">
    <?php


    $articles = get_articles();

    foreach ($articles as $value) {
        ?>
        <a  class="list-group-item<?php
            if ($value['id'] == $article_id) {
                echo(" active");
            }
            ?>" href="<?php echo('?id=' . $value['id']); ?>">
                <?php echo($value['id'] . ': ' . $value['title']); ?>
        </a>
        <?php
    }
    ?><br>

</div>


<?php include('generic/footer.php');
?>