<?php
//общий доступ к сайту

namespace controllers;

use \components\app as components;
use \models\forms;
use \components\app\image;

final class Generic_Access extends \vendor\controller
{


    //проверяем доступность стороннего url фото
    public function action_check_avialability_outer_photo_url()
    {

        $photo_url = isset($_POST['url']) && $_POST['url'] ? $_POST['url'] : null;

        if ($photo_url) {
            $mime = my_get_image_type($photo_url, true, true);
            if ($mime == 'jpg') {
                $mime = 'jpeg';
            }

            if (is_image_type($mime)) {
                $temp_file_name = 'checking_' . my_get_unique() . '.' . $mime;

                $new_path = MY_TEMP_FILES_DIR . $temp_file_name;

                // копируем себе удаленную фотку
                if (download_image_by_url($photo_url, $new_path) && getimagesize($new_path)) {
                    //удаляем
                    @unlink($new_path);
                    echo 1;
                    return $this->data;
                }
            }
        }

        echo 0;
        return $this->data;
    }
}
