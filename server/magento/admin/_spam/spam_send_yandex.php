<?php
$settings_site = 'yandex.ru';
$settings_limit = 100;
$my_email_for_revision = 'alexander.ladonin@yandex.ru'; //куда шлем, чтобы проверить что он отсылается


// чтобы была хаотичность периоде в отправке - иногда много шлем, иногда не шлем вообще
if (rand(1, 2) == 1) {
    exit();
}

error_reporting(E_ALL);
ini_set("display_errors", 1);

date_default_timezone_set('UTC');
define('MY_DS', DIRECTORY_SEPARATOR);
require_once('../generic' . MY_DS . 'constants.php');
require_once(MY_APPLICATION_DIR . 'functions' . MY_DS . 'generic.php');
//define('MY_DOCROOT', realpath(dirname(__FILE__)) . MY_DS . '..' . MY_DS . '..' . MY_DS);
//define('MY_APPLICATION_DIR', MY_DOCROOT . 'application' . MY_DS);


require_once(MY_DOCROOT . 'admin' . MY_DS . 'generic' . MY_DS . 'connection.php');

require_once(MY_APPLICATION_DIR . 'modules' . MY_DS . 'base' . MY_DS . 'mailer' . MY_DS . 'classes' . MY_DS . 'phpmailer.php');

use modules\base\mailer\classes as mailer;

define('INFO_EMAIL', 'alexander.l@world-landmarks.ru');
define('INFO_NAME', 'Ladonin Alexander');

$mailer_subject = 'Монастырь из человеческих останков - знаменитая чешская Костница.';
$mailer_AltBody = 'В чешском городке Кнутна Гора находится удивительный памятник, который называется';


function get_template($email, $id_email, $email_code)
{
    $text = <<<EOL
<style>
    img{
        border:0;
        text-decoration:none;
        padding:0;
        margin:0;
    }
</style>
<table width="600" style="font-family: arial,sans-serif; color:#444;" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <div style="font-size:13px; padding:5px 10px; color:#333;">Обзор достопримечательностей со всего мира. Исторические объекты, памятники архитектуры, удивительные места природы с точным размещением места на карте, подробным описанием и фотографиями.</div>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding:5px 0 10px 0;">
            <div style="width:200px;"><a href="http://world-landmarks.ru/not_interest?email=$email&n=$id_email&c=$email_code" target="_blank" style="outline: none;text-decoration:none; border:0;"><div style="background-color:rgb(236, 91, 91); padding:10px 20px; border-radius:5px; color:#fff; font-size:15px; width:160px; box-shadow: 0 0 5px rgba(0,0,0,0.2); text-align:center;"> Мне это совершеннно не интересно</div></a></div>
        </td>
    </tr>
</table>
<div style="background-color:rgb(225, 233, 239); max-height:219px;padding:0; width:600px;font-family: arial,sans-serif;">
    <table width="600" style="color:#333;" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td align="left">
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="290" valign="top" align="left">
                            <a href="http://world-landmarks.ru/map/848/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;"><img src="http://world-landmarks.ru/img/email/57441bff26aec153.jpg" width="290" style="padding:0; margin:0;display:block;"></a>
                        </td>
                        <td width="310" valign="top" align="left">
                            <div style="padding:10px;">
                                <div style="padding-bottom:10px; font-size: 14px;">
                                    <b><a href="http://world-landmarks.ru/map/848/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;color:rgb(0, 56, 98);">Костница в городе Кутна Гора</a></b>
                                </div>
                                <div style="font-size: 13px;line-height: 18px;">
                                    В чешском городке Кнутна Гора находится удивительный памятник, который называется Костница. Это часовня, интерьер которой полностью оформлен человеческими костями. История этого необычного и завораживающего места уходит корнями в 1278 год, когда, вернувшийся из святых мест, аббат Йиндржих привез для кладбища при обители горсть земли с Голгофы...
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</div>
<div style="background-color:rgb(246, 245, 244); padding:0 10px 10px 10px; width:580px;font-family: arial,sans-serif;">
    <table width="580" style="color: rgb(102, 102, 102);" border="0" cellpadding="0" cellspacing="0">
        <tr>
            <td align="left">
                <div style="font-size:19px; color:#333; padding:10px 0;">А также</div>
            </td>
        </tr>
        <tr>
            <td>
                <table border="0" cellpadding="0" cellspacing="0">
                    <tr>
                        <td width="145" valign="top" style="padding-bottom:10px">
                            <a href="http://world-landmarks.ru/map/496/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;"><img src="http://world-landmarks.ru/img/email/571a4632006aa625.jpg" width="145" height="120"></a>
                        </td>
                        <td width="145" valign="top" align="left" style="padding-bottom:10px">
                            <div style="padding-left:10px;">
                                <div style="padding-bottom:10px; font-size: 13px;line-height: 15px;">
                                    <b><a href="http://world-landmarks.ru/map/496/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;color:rgb(0, 56, 98);">Дом C. Есенина</a></b>
                                </div>
                                <img style="display:block;" src="http://world-landmarks.ru/img/landmarks/museum.png">
                                <div style="font-size: 11px;color:#444;padding-top:5px;line-height: 13px;">
                                    Россия, Рязанская область
                                </div>
                            </div>
                        </td>
                        <td width="145" valign="top" style="padding-bottom:10px">
                            <a href="http://world-landmarks.ru/map/89/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;"><img src="http://world-landmarks.ru/img/email/56f581aa9db3c839.jpg" width="145" height="120"></a>
                        </td>
                        <td width="145" valign="top" align="left" style="padding-bottom:10px">
                            <div style="padding-left:10px;">
                                <div style="padding-bottom:10px; font-size: 13px;line-height: 15px;">
                                    <b><a href="http://world-landmarks.ru/map/89/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;color:rgb(0, 56, 98);">Синий камень</a></b>
                                </div>
                                <img style="display:block;" src="http://world-landmarks.ru/img/landmarks/interest_place.png">
                                <div style="font-size: 11px;color:#444;padding-top:5px;line-height: 13px;">
                                    Россия, Ярославская область
                                </div>
                           </div>
                        </td>
                    </tr>
                    <tr>
                        <td width="145" valign="top">
                            <a href="http://world-landmarks.ru/map/1054/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;"><img src="http://world-landmarks.ru/img/email/57599383002ce594.jpg" width="145" height="120"></a>
                        </td>
                        <td width="145" valign="top" align="left">
                            <div style="padding-left:10px;">
                                <div style="padding-bottom:10px; font-size: 13px;line-height: 15px;">
                                    <b><a href="http://world-landmarks.ru/map/1054/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;color:rgb(0, 56, 98);">Гробница Джульетты</a></b>
                                </div>
                                <img style="display:block;" src="http://world-landmarks.ru/img/landmarks/historical_place.png">
                                <div style="font-size: 11px;color:#444;padding-top:5px;line-height: 13px;">
                                    Италия, Верона
                                </div>
                            </div>
                        </td>
                        <td width="145" valign="top">
                            <a href="http://world-landmarks.ru/map/381/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;"><img src="http://world-landmarks.ru/img/email/570b95335ba89411.jpg" width="145" height="120"></a>
                        </td>
                        <td width="145" valign="top" align="left">
                            <div style="padding-left:10px;">
                                <div style="padding-bottom:10px; font-size: 13px;line-height: 15px;">
                                  <b><a href="http://world-landmarks.ru/map/381/m$id_email/c$email_code" target="_blank" style="outline: none;text-decoration:none;border:0;color:rgb(0, 56, 98);">Памятник Фредди Меркьюри</a></b>
                                </div>
                                <img style="display:block;" src="http://world-landmarks.ru/img/landmarks/monument.png">
                                <div style="font-size: 11px;color:#444;padding-top:5px;line-height: 13px;">
                                    Швейцария, Монтрё
                                </div>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        <tr>
            <td align="center">
               <div style="width:200px; margin:20px auto 10px auto; text-align:center;"><a href="http://world-landmarks.ru/interest?email=$email&n=$id_email&c=$email_code" target="_blank" style="outline: none;text-decoration:none; border:0;"><div style="background-color:rgb(108, 173, 72); padding:10px 20px; border-radius:5px; color:#fff; font-size:15px; width:160px; box-shadow: 0 0 5px rgba(0,0,0,0.2);"> Мне это интересно</div></a></div>
            </td>
        </tr>
    </table>
</div>

<table width="600" style="font-family: arial,sans-serif;color: rgb(102, 102, 102); color:#444; padding-top:10px;" border="0" cellpadding="0" cellspacing="0">
    <tr>
        <td align="center">
            <div style="font-size:15px; padding:5px 10px; color:#000;"><a href="http://world-landmarks.ru/map/m$id_email/c$email_code" target="_blank" style="outline: none;color:#505050;">Достопримечательности на карте мира - сайт</a></div>
            <div style="font-size:15px; padding:5px 10px; color:#000;"><a href="https://vk.com/world_landmarks" target="_blank" style="outline: none;color:#597da3;">Мы вконтакте</a></div>
        </td>
    </tr>
    <tr>
        <td align="center" style="padding:5px 0 10px 0;">
            <div style="color:#888; font-size:12px">С уважением, Ладонин Александр.<br>Менеджер по развитию сайта.</div>
        </td>
    </tr>
</table>
EOL;
    return $text;
}
$sql = "SELECT * FROM landmarks_spam WHERE is_sent=0 AND site='$settings_site' ORDER by id ASC LIMIT $settings_limit";
$emails_result = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

//проверяем как шлется вообщем - идет ли в спам или нет
$mailer = new mailer\PHPMailer();
$mailer->CharSet = 'UTF-8';
$mailer->setFrom(INFO_EMAIL, INFO_NAME);
$mailer->isHTML(true); // Set email format to HTML
$mailer->Subject = $mailer_subject;
$mailer->AltBody = $mailer_AltBody;
$mailer->Body = get_template('qwerty', 'qwerty', 'qwerty');
$mailer->addAddress($my_email_for_revision); // Add a recipient
$mailer->send();

$i = 0;
foreach ($emails_result as $email_result) {

    $mailer = new mailer\PHPMailer();
    $mailer->CharSet = 'UTF-8';
    $mailer->setFrom(INFO_EMAIL, INFO_NAME);
    $mailer->isHTML(true); // Set email format to HTML
    $mailer->Subject = $mailer_subject;
    $mailer->AltBody = $mailer_AltBody;
    $mailer->Body = get_template($email_result['email'], $email_result['id'], $email_result['code']);
    $mailer->addAddress($email_result['email']); // Add a recipient

    if (!$mailer->send()) {
        $is_sent = -1;
        $sql = "UPDATE `landmarks_spam` SET is_sent='-1' WHERE id=" . $email_result['id'];
        $connect->query($sql);
    } else {
        $is_sent = 1;
        $i++;
        echo($i . ':' . $email_result['email'] . "\n");
    }
    $sql = "UPDATE `landmarks_spam` SET is_sent='" . $is_sent . "' WHERE id=" . $email_result['id'];
    $connect->query($sql);
    sleep(rand(10, 30));
}