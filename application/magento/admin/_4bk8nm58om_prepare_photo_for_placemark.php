<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);
set_time_limit(9999999);


define('MY_DS', DIRECTORY_SEPARATOR);
require_once('generic' . MY_DS . 'constants.php');


function imageresize($outfile, $infile, $neww, $newh, $quality)
{

    $im = imagecreatefromjpeg($infile);
    $im1 = imagecreatetruecolor($neww, $newh);
    imagecopyresampled($im1, $im, 0, 0, 0, 0, $neww, $newh, imagesx($im), imagesy($im));

    imagejpeg($im1, $outfile, $quality);
    imagedestroy($im);
    imagedestroy($im1);
}
$dimentions = array(
    //permanent
    1 => 0,
    // mobile
    2 => 104,
    3 => 144,
    4 => 184,
    //4 => 204,
    5 => 340,
    6 => 500,
    //7 => 640,
    //7 => 820,
    // desctop
    8 => 230, //list
    9 => 670, //content cluster
    10 => 900, //content
    11 => 1500,
);

if (isset($_POST['submit'])) {

    $sizes = getimagesize($_FILES['photo']['tmp_name']);
    $source_width = $sizes[0];
    $source_height = $sizes[1];

    foreach ($dimentions as $prefix => $dimention) {

        if ($dimention == 0) {
            $new_height = $source_height;
            $new_width = $source_width;
        } else {
            $new_height = floor($source_height * $dimention / $source_width);
            $new_width = $dimention;
        }
        $url='admin' . MY_DS . 'temp' . MY_DS . $prefix . '_' . $_POST['photo_name'] . '.jpg';
        imageresize(MY_DOCROOT . $url, $_FILES['photo']['tmp_name'], $new_width, $new_height, 100);

        echo('<a href="/'.$url.'">фото '.$new_width.'x'.$new_height.'</a><br>');

    }
}
?>
<br><br>


<table width="100%">
    <tr>
        <td width="50%" align="left" valign="top">
            <h3>Подготовка фотографии для отображения в метке</h3>
            <form action='' method="post"  enctype="multipart/form-data">

                название фото:<br>
                <input type="text" name='photo_name'><br><br>
                приложите фото (в jpg формате):<br>
                <input type="file" name='photo'>
                <br>
                <br>
                <input type="submit" name="submit" value='обработать'>
            </form>
        </td>
    </tr>
</table>
