<?php

use \vendor\Component;

if ($config['debug'] === 1) {

    $autoload_history = "<b>Автозагрузка классов:</b> <br>";
}

/*
 * Автозагрузка файлов вызываемых классов
 *
 * @param string $class - имя класса
 */
function __autoload($class)
{
    global $config;

    $filename = '';

    $class = strtolower($class);

    if (preg_match('/^' . MY_SERVICES_NAME . '/', $class)) {
        $class = preg_replace('/^' . MY_SERVICES_NAME . '/', MY_SERVICES_NAME . '\\' . get_service_name(), $class);
    }

    // класс с path, указанным в namespace
    $filename = str_replace('\\', '/', MY_APPLICATION_DIR . $class . '.php');

    if (file_exists($filename)) {

        if ($config['debug'] === 1) {

            global $autoload_history;

            $autoload_history.="[" . round((microtime(1) - MY_START_TIME), 5) . " сек] " . $filename . "<br>";
        }

        require_once($filename);
    } else if ($config['debug'] === 1) {
        var_dump(debug_backtrace());
        exit();
    }
}

/*
 * Проверяет - можно ли отображать view для данного контролера
 *
 * @return boolean
 */
function is_available_to_run_view()
{
    $service_module = \components\base\Modules::get(MY_MODULE_NAME_SERVICE);
    $controller_name = get_controller_name();

    if (($controller_name === MY_CONTROLLER_NAME_CATALOG) && ($service_module->is_show_catalog_pages() === false)) {
        return false;
    }

    return  true;
}

/*
 * Замена двойных кавычек на одинарные
 *
 * @param string $text - передаваемое значение
 *
 * @return string - подготовленное значение
 */
function my_prepare_double_commas($text)
{

    return str_replace("\"", "'", $text);
}

/*
 * Преобразование списка через запятые в массив
 *
 * @param string $string - передаваемое значение
 *
 * @return string - подготовленное значение
 */
function my_get_array_from_string($string)
{
    if (is_null($string) || $string === '') {
        return array();
    }

    if (!is_string($string)){
        Component::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, '$string type:' . gettype($string)));
    }

    return explode(',', trim($string, ','));
}

/*
 * Проверка - пустая переменная или нет (инверсия)
 *
 * @param string $var - передаваемое значение
 *
 * @return boolean
 */
function my_is_not_empty($var)
{
    if (isset($var) && $var) {
        return true;
    }
    return false;
}

/*
 * Проверка - пустая переменная (массив) или нет (инверсия)
 *
 * @param array $var - передаваемый массив
 *
 * @return boolean
 */
function my_array_is_not_empty($var)
{
    if ((!is_array($var)) && (!is_null($var))){
        Component::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, '$var type:' . gettype($var)));
    }
    if (isset($var) && $var) {
        return true;
    }
    return false;
}

/*
 * Проверка - пустая переменная (массив) или нет
 *
 * @param array $var - передаваемый массив
 *
 * @return boolean
 */
function my_array_is_empty($var)
{
    if ((!is_array($var)) && (!is_null($var))){
        Component::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, '$var type:' . gettype($var)));
    }

    if (!isset($var) || !$var) {
        return true;
    }
    return false;
}

/*
 * Проверка - пустая переменная или нет
 *
 * @param string $var - передаваемое значение
 *
 * @return boolean
 */
function my_is_empty($var)
{
    if (!isset($var) || !$var) {
        return true;
    }
    return false;
}

/*
 * Проверка - существует ли метод у класса
 *
 * @param string $class_path - путь до класса
 * @param string $method_name - имя метода
 *
 * @return boolean
 */
function my_is_method_and_class_enable($class_path, $method_name)
{

    if (!\class_exists($class_path)) {
        Component::concrete_error(array(MY_ERROR_CLASS_NOT_FOUNT, 'class_path -> ' . $class_path));
    } else if (!\method_exists($class_path, $method_name)) {
        Component::concrete_error(array(MY_ERROR_METHOD_NOT_FOUNT, $class_path . ' -> ' . $method_name));
    }
    return true;
}

/*
 * Выводит значение переменной с гарантией, что оно не пустое
 *
 * @param string $var - выводимое значение
 *
 * @return string - выводимое значение
 */
function my_pass_through($var)
{
    if (!isset($var)) {
        Component::concrete_error(array(MY_ERROR_VALUE_NOT_PASSED_THROUGH));
    }
    return ($var);
}

/*
 * Возвращает mvc url текущей страницы
 *
 * @return string - mvc url текущей страницы
 */
function my_get_self_mvc_url()
{
    return MY_DOMEN . MY_DS . 'mvc' . MY_DS . \modules\base\Security\Security::get_instance()->get_self_url();
}

/*
 * Редиректит на mvc url текущей страницы
 */
function my_redirect_to_self_mvc_url()
{
    header('Location: ' . my_get_self_mvc_url(), true, 301);
    exit();
}

/*
 * Преобразуем все значения одномерного массива в integer форму
 *
 * @param array $array - преобразуемый массив
 *
 * @return array - преобразованный массив
 */
function my_prepare_int_array($array)
{
    foreach ($array as &$value) {
        $value = (int) $value;
    }
    return $array;
}

/*
 * Запись лога в файл
 *
 * @param string $file - имя файла, куда пишем
 * @param string $message - сообщение
 * @param boolean $generic_error - пишем в общий лог или лог сервиса
 */
function my_write_to_log($file, $message, $generic_error = false)
{

    if ($generic_error) {
        $file = MY_DOCROOT . $file;
    } else {
        $file = MY_SERVICES_DIR . get_service_name() . MY_DS . $file;
    }
    $config = \vendor\Component::get_config();

    if ($config['log']['on'] == 1) {
        $message = stripcslashes(stripcslashes(iconv('cp1251', 'utf-8', $message)));
        file_put_contents($file, date(DATE_RFC2822) . ': ' . $message . "\n\r", FILE_APPEND);
    }
}

/*
 * Проверка правильности введенной даты (есть такая дата в календаре или нет)
 *
 * @param string $day - день
 * @param string $month - месяц
 * @param string $year - год
 *
 * @return boolean
 */
function my_validate_date($day, $month, $year)
{
    $month = (int) $month;
    $day = (int) $day;
    $year = (int) $year;

    if ((!checkdate($month, $day, $year)) && ($month) && ($day) && ($year)) {

        return false;
    }
    return true;
}


//скачано с сайта php.net
/*
  if (!function_exists('hash_equals')) {
    function hash_equals($known_string, $user_string)
    {
        if (func_num_args() !== 2) {
            // handle wrong parameter count as the native implentation
            trigger_error('hash_equals() expects exactly 2 parameters, ' . func_num_args() . ' given', E_USER_WARNING);
            return null;
        }
        if (is_string($known_string) !== true) {
            trigger_error('hash_equals(): Expected known_string to be a string, ' . gettype($known_string) . ' given', E_USER_WARNING);
            return false;
        }
        $known_string_len = strlen($known_string);
        $user_string_type_error = 'hash_equals(): Expected user_string to be a string, ' . gettype($user_string) . ' given'; // prepare wrong type error message now to reduce the impact of string concatenation and the gettype call
        if (is_string($user_string) !== true) {
            trigger_error($user_string_type_error, E_USER_WARNING);
            // prevention of timing attacks might be still possible if we handle $user_string as a string of diffent length (the trigger_error() call increases the execution time a bit)
            $user_string_len = strlen($user_string);
            $user_string_len = $known_string_len + 1;
        } else {
            $user_string_len = $known_string_len + 1;
            $user_string_len = strlen($user_string);
        }
        if ($known_string_len !== $user_string_len) {
            $res = $known_string ^ $known_string; // use $known_string instead of $user_string to handle strings of diffrent length.
            $ret = 1; // set $ret to 1 to make sure false is returned
        } else {
            $res = $known_string ^ $user_string;
            $ret = 0;
        }
        for ($i = strlen($res) - 1; $i >= 0; $i--) {
            $ret |= ord($res[$i]);
        }
        return $ret === 0;
    }
}
*/


/*
 * Функция для "дебажирования" переменной
 *
 * @param $data - переменная
 * @param boolean $return - формат вывода - echo или return
 *
 * @return string - данные пременной
 */
function my_pre($data = null, $return = false, $exit = true)
{
    if (is_string($data) && strlen($data) > 0)
        $data = 'string(' . strlen($data) . ') "' . $data . '"';

    if (is_bool($data)) {
        if ($data === true)
            $data = 'boolean (true)';
        else
            $data = 'boolean (false)';
    }

    if (is_null($data))
        $data = 'null';

    if (is_string($data) && strlen($data) === 0)
        $data = 'string(o) ""';

    if (PHP_SAPI === 'cli') {
        if ($return)
            return print_r($data, true);
        else
            return print_r($data) . PHP_EOL;
    }

    if ($return == true)
        return print_r($data, true);
    else
        echo '<pre style="white-space: pre-wrap; border: 1px solid #c1c1c1; border-radius: 10px; margin: 10px; padding: 10px; background-color: #fff; font-size: 11px; font-family: Tahoma; line-height: 15px;">' . htmlspecialchars(print_r($data, true)) . '</pre>';
    if ($exit) {
        exit();
    }
}

/*
 * Проверка запроса - ajax или нет
 *
 * @return boolean
 */
function is_ajax()
{
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && !empty($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
        return true;
    }
    return false;
}

/*
 * Возврат типа девайса - мобильный или десктопный
 *
 * @return string - тип девайса
 */
function get_device()
{
    return \vendor\Component::get_device_type();
}

/*
 * Возврат имени текущего контроллера
 *
 * @return string - имя текущего контроллера
 */
function get_controller_name()
{
    $security = \modules\base\Security\Security::get_instance();
    $controller = $security->get_controller();
    return $controller;
}

/*
 * Возврат имени action текущего контроллера
 *
 * @return string - имя action текущего контроллера
 */
function get_action_name()
{
    $security = \modules\base\Security\Security::get_instance();
    $action = $security->get_action();
    return $action;
}

/*
 * Проверка - мы на странице карты или нет
 *
 * @return boolean
 */
function is_map_page()
{
    return (get_controller_name() === MY_MODULE_NAME_MAP) ? true : false;
}

/*
 * Проверка - устройство мобильное или нет
 *
 * @return boolean
 */
function is_mobile()
{
    return \vendor\Component::get_device_type() === MY_DEVICE_MOBILE_TYPE_CODE ? true : false;
}

/*
 * Переименование имени картинки с любым расширением в "имя".jpeg
 *
 * @param string $name - имя картинки с расширением
 *
 * @return string - "имя".jpeg
 */
function prepare_image_name_to_jpeg($name)
{
    return preg_replace('/\.[a-z]+$/', '.jpeg', $name);
}


function is_image_type($type)
{
    $types=array(
        'jpeg','jpg','png','gif'
    );

    if (in_array(strtolower($type),$types)){
        return true;
    }
    return false;
}



/*
 * Поучение типа расширения картинки
 *
 * @param string $path - путь до картинки
 * @param boolean $full - вернуть полный mime тип или просто расширение
 * @param boolean $by_url - по урлу или по файлу
 *
 * @return string - тип расширения картинки
 */
function my_get_image_type($path, $full = false, $by_url = false)
{

    if($by_url===true){
        return preg_replace('/(?:.+?)\.([a-z]+)$/i','$1',$path);
    }

    $sizes = getimagesize($path);
    if (my_array_is_empty(@$sizes)) {
        Component::concrete_error(array(MY_ERROR_IMAGE_GET_TYPE, 'path:' . $path));
    }
    if ($full) {
        return $sizes['mime'];
    }
    $type_format_array = explode("/", $sizes['mime']);
    $format = $type_format_array[1];
    return $format;
}

/*
 * Перезаписываем картинку в jpeg формате, если он в другом
 *
 * @param string $source - путь до картинки
 *
 * @return string - путь до .jpeg картинки
 */
function change_image_to_jpeg($source)
{
    $sizes = getimagesize($source);
    $source_width = $sizes[0];
    $source_height = $sizes[1];
    $format = my_get_image_type($source);

    // задаем путь новому изображению с новым форматом - может статься, что jpeg картинка имеет в названии .png расширение
    //поэтому делаем это преобразование имени всегда без проверки какого расширения картинка
    $path_to = prepare_image_name_to_jpeg($source);
    if ($path_to != $source) {
        $picfunc = 'imagecreatefrom' . $format; //какую функцию использовать для ее создания
        $picsource = $picfunc($source); //создаем переменную исходного изображения
        $picout = imagecreatetruecolor($source_width, $source_height); // Создание итогового изображения в переменной
        $background = imagecolorallocate($picout, 255, 255, 255);
        imagefill($picout, 0, 0, $background); // Заполнение её цветом
        imagecopyresampled($picout, $picsource, 0, 0, 0, 0, $source_width, $source_height, $source_width, $source_height); //вносим в нашу переменную обработанное изображение исходника
        if (imagejpeg($picout, $path_to, 100) == false) {// Создание файла итогового изображения
            Component::concrete_error(array(MY_ERROR_IMAGE_CREATE, '[imagejpeg] picout:' . $picout . ', path_to:' . $path_to));
        }
        imagedestroy($picsource); // Очистка памяти
        imagedestroy($picout); // Очистка памяти
        @unlink($source);
    }
    return $path_to;
}

/*
 * Создаем картинку с указанными параметрами
 *
 * @param string $path_to - путь назначения
 * @param string $source - путь до исходника
 * @param integer $neww - ширина
 * @param integer $newh - высота
 * @param integer $quality - качество
 * @param boolean $use_old_image - использовать данные исходного изображения,
 *    указанные в static переменных или определять параметры исходника снова,
 *    сделано для снижения нагрузки при обработке одного и того же изображения несколько раз
 *   (например - создание от исходника картинок с разными размерами)
 *
 * @return boolean - результат выполнения запроса
 */
function image_resize($path_to, $source, $neww, $newh, $quality, $use_old_image = false)
{
    static $source_width = null;
    static $source_height = null;
    static $format = null;

    if ((!$source_width) || (!$source_height) || (!$format) || (!$use_old_image)) {
        $sizes = getimagesize($source);
        $source_width = $sizes[0];
        $source_height = $sizes[1];
        $type_format_array = explode("/", $sizes['mime']);
        $format = $type_format_array[1];
    }

    if (($neww === 0) && ($newh === 0)) {
        $width = $source_width;
        $height = $source_height;
    } else if ($newh === 0) {
        $k = $neww / $source_width;
        $width = $neww;
        $height = intval($source_height * $k);
    } else if ($neww === 0) {
        $k = $newh / $source_height;
        $width = intval($source_width * $k);
        $height = $newh;
    } else {
        $width = $neww;
        $height = $newh;
    }

    $picfunc = 'imagecreatefrom' . $format; //какую функцию использовать для ее создания

    $picsource = $picfunc($source); //создаем переменную исходного изображения
    $picout = imagecreatetruecolor($width, $height); // Создание итогового изображения в переменной
    //imagefill($picout, 0, 0, $bgcolor); // Заполнение её цветом
    imagecopyresampled($picout, $picsource, 0, 0, 0, 0, $width, $height, $source_width, $source_height); //вносим в нашу переменную обработанное изображение исходника

    if (imagejpeg($picout, $path_to, $quality) == false) {// Создание файла итогового изображения
        Component::concrete_error(array(MY_ERROR_IMAGE_CREATE, '[imagejpeg] picout:' . $picout . ', path_to:' . $path_to));
    }

    imagedestroy($picsource); // Очистка памяти
    imagedestroy($picout); // Очистка памяти

    return true;
}

/*
 * Возвращает сгенерированный случайный удобочитаемый пароль
 *
 * @return string
 */
function my_create_password()
{
    $gl = array(
        'a',
        'e',
        'i',
        'o',
        'u',
    );

    $so = array(
        'b',
        //'c',
        'd',
        'f',
        'g',
        'h',
        //'j',
        'k',
        'l',
        'm',
        'n',
        'p',
        //'q',
        'r',
        's',
        't',
        'v',
        //'w',
        'x',
        //'y',
        'z',
    );

    $result = '';
    for ($i = 0; $i < 8; $i++) {
        if ($i % 2 == 0) {
            $result .= $so[rand(0, 15)];
        } else {
            $result .= $gl[rand(0, 4)];
        }
    }

    return $result;
}

/*
 * Возвращает уникальное слово
 *
 * @return string
 */
function my_get_unique()
{
    return uniqid() . rand(1, 999);
}


/*
 * Проверяем локальный файл на наличие
 */
function check_local_file($path) {
    if (!file_exists($path)){
        Component::concrete_error(array(MY_ERROR_LOCAL_FILE_NOT_FOUND, 'path:' . $path));
    }
    return true;
}