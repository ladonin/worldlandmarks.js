<?php

namespace components\app;

use \modules\base\Security\Security;
use \vendor\component;

final class Image extends Component
{

    public $upload_data = array();
    protected $valid_mime_types = array();
    protected $mime_type;

    public function __construct($image = null)
    {
        $config = self::get_config();
        $this->valid_mime_types = $config['allows']['mime_types_for_upload'];

        if (my_array_is_not_empty(@$image)) {

            $this->upload_data = $image;

            // Get real type
            $this->upload_data['type'] = my_get_image_type($image['tmp_name'], true);

            if (my_is_not_empty(@$image['error'])) {
                self::concrete_error(array(MY_ERROR_LOADING_FILE, 'error_loading_file:' . json_encode($this->upload_data)));
            }
        } else {
            self::set_error(MY_ERROR_IMAGE_NOT_PASSED_TO_OBJECT);
        }
    }


    public function check_and_upload_to_temp()
    {

        if ($this->is_valid_mime_type($this->upload_data['type']) === false) {
            self::concrete_error(array(MY_ERROR_LOADING_IMAGE_WRONG_TYPE, 'wrong_uploaded_image_type:' . json_encode($this->upload_data)));
        }

        // Unique file name
        $temp_file_name = my_get_unique() . '.' . $this->mime_type;
        $new_path = MY_TEMP_FILES_DIR . $temp_file_name;
        if (move_uploaded_file($this->upload_data['tmp_name'], $new_path)) {
            //файл должен быть в формате jpeg
            // NOTE - если файл img.gif но реальный формат его jpeg, то change_image_to_jpeg с ним ничего не сделает,
            // потому что он берет его настойщий формат а не то, что на конце названия,
            // поэтому нужно в массиве данных картинки иметь тоже достоверные данные о формате,
            // а не брать, nxj что указал пользователь после точки
            change_image_to_jpeg($new_path);
            return prepare_image_name_to_jpeg($temp_file_name);
        } else {
            self::concrete_error(array(MY_ERROR_MOVE_IMAGE_TO_TEMP_FILES_DIR_FROM_TMP, 'tmp_name:' . $this->upload_data['tmp_name'] . ', new_path:' . $new_path));
        }
    }


    public function is_valid_mime_type($mime)
    {
        if (array_key_exists($mime, $this->valid_mime_types)) {
            $this->mime_type = $this->valid_mime_types[$mime];
            return true;
        } else {
            return false;
        }
    }


}
