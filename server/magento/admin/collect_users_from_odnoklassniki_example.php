<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);

define('MY_DS', DIRECTORY_SEPARATOR);
$title = $page_name = 'Собрать/показать пользователей из одноклассников';
require_once('generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
require_once('generic' . MY_DS . 'connection.php');
include('generic/header.php');



$invite_table = 'invite_odnoklassniki_example';



?>
<div class="well well-lg" style="padding-top:10px !important;padding-bottom:10px !important;">
    <h3>Сохраненные пользователи</h3><br>
    <?php
    $button_1_added_text = '';
    if (isset($_POST['show_users'])) {
        $button_1_added_text = ' еще';
        $sql = "SELECT * FROM $invite_table WHERE is_invited=0 order by id ASC limit 5";
        $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
        ?>

        <div class="row">
            <div class="alert alert-warning" role="alert">Внимание! Данные пользователи в системе помечены как приглашенные.</div>
            <script>var links = new Array();</script>
            <div class="list-group col-md-3" style="padding-left:15px !important">
                <?php
                foreach ($result as $user) {
                    $link = 'https://ok.ru/profile/' . $user['profile_id'];
                    echo('<a target="_blank" style="color:#337ab7 !important" class="list-group-item" href="' . $link . '" onclick="window.open(\'' . $link . '\',\'_blank\',\'left=300, top=100, width=900, height=800\'); return false">Пользователь #' . $user['id'] . '</a><script>links.push(\'' . $link . '\');</script>');
                    $sql = "update $invite_table set is_invited=1 where profile_id = '" . $user['profile_id'] . "'";
                    $connect->query($sql);
                }
                ?>

                <?php
                if (!$result) {
                    echo('Список неприглашенных пользователей пуст, добавьте их через форму ниже<br>');
                } else {
                    ?>
                    <script>
                        function open_ok_users() {

                            for (index = 0; index < links.length; index++) {
                                window.open(links[index], '_blank', 'left=300, top=100, width=900, height=800');
                            }


                        }
                    </script>
                    <a style="cursor:pointer" class="list-group-item list-group-item-success" onclick='open_ok_users();'>Открыть всех пользователей</a>
                    <?php
                }
                ?>
            </div></div>
        <?php
    }
    ?>

    <form action='' method="post">
        <input name='show_users' type="submit" value='Вывести <?php echo $button_1_added_text; ?>5 пользователей' class="btn btn-info">
    </form>

</div>





<br>
<br>
<div class="well well-lg" style="padding-top:10px !important;padding-bottom:10px !important;">
    <h3>Импорт пользователей</h3><br>
    <?php
    if (isset($_POST['html_text']) && $_POST['html_text']) {
        if ($_POST['type_users'] === 'classes') {
            preg_match_all("#class=\"photoWrapper\" href=\"/profile/([0-9]+)\"#", $_POST['html_text'], $users_result, PREG_SET_ORDER);
        } else if ($_POST['type_users'] === 'group_users') {

            preg_match_all("#<a href=\"/dk\?st\.cmd=friendMain&amp;st\.friendId=([0-9]+)&amp;#", $_POST['html_text'], $users_result, PREG_SET_ORDER);
        }
        $i = 0;
        foreach ($users_result as $user) {
            $profile_id = $user[1];
            // replace тут не подойдет
            $sql = "SELECT * FROM $invite_table WHERE profile_id=$profile_id";
            $result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
            if (!$result) {
                $i++;
                $sql = "INSERT into $invite_table (profile_id) VALUES('$profile_id')";
                $connect->query($sql);
            }
        }
        ?>

        <div class="col-md-4" style="padding-left:0 !important">


            <ul class="list-group">

                <li class="list-group-item list-group-item-info">
                    <span class="badge" style="background-color: #FFF;color:rgb(30, 30, 203);"><?php echo(count($users_result)); ?></span>
                    Найдено пользователей
                </li>

                <li class="list-group-item list-group-item-success">
                    <span class="badge" style="background-color: #FFF;color: #000;"><?php echo($i); ?></span>
                    Добавлено пользователей
                </li>

                <li class="list-group-item list-group-item-warning">
                    <span class="badge" style="background-color: #FFF;color:rgb(207, 38, 38);"><?php echo((count($users_result) - $i)); ?></span>
                    Пользователей, уже присутствующих в базе
                </li>


            </ul></div>
    <?php }
    ?>



    <table width="100%">
        <tr>
            <td width="50%" align="left" valign="top">
                <h4>HTML код</h4>
                <form action='' method="post">


                    <textarea cols="80" rows="10" name="html_text" class="form-control"></textarea>

                    <br>
                    <h4>Откуда взят HTML код:</h4>


                    <div class="radio">
                        <label>
                            <input type="radio" value='classes' name="type_users" checked>
                            Пользователи, поставившие "класс!"
                        </label>
                    </div>

                    <div class="radio">
                        <label>
                            <input type="radio" value='group_users' name="type_users">
                            Мобильная версия - список пользователей группы"
                        </label>
                    </div>

                    <br>

                    <input type="submit" value='Импорт' class="btn btn-success">
                </form>
            </td>
        </tr>
    </table>
</div>
<?php include('generic/footer.php'); ?>