/*
 * File application/express/functions/BaseFunctions.js
 *
 * Base functions collection
 */




const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const Fs = require('fs');
const SizeOf = require('image-size');
const _num = require('lodash/number');
const _lang = require('lodash/util');
const _string = require('lodash/string');
const Uniqid = require('uniqid');
const IsMobile = require('react-device-detect');
const Consts = require('application/express/settings/Constants');
const Request = require('application/express/components/base/Request');
const Config = require('application/express/settings/Config.js');

function deleteFile(path) {
    try {
        Fs.unlinkSync(path);
    } catch (e) {
    }
}







function clone(obj) {
    return _lang.cloneDeep(obj);
}




function isSet(val) {
    return !isUndefined(val);
}




function isNull(val) {
    return _lang.isNull(val);
}
function isUndefined(val) {
    return _lang.isUndefined(val);
}

function isString(val) {
    if (isUndefined(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}

function checkOnString(val){
    if (!isString(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'string[' + typeof(val) + ']');
    }
    return true;
}

function isArray(val) {
    return _lang.isArray(val);
}

function checkOnArray(val){
    if (!isArray(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'array[' + typeof(val) + ']');
    }
    return true;
}


function trim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return _string.trim(text, val);
}


function rtrim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return _string.trimEnd(text, val);
}

function ltrim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return _string.trimStart(text, val);
}



/*
 * Замена двойных кавычек на одинарные
 *
 * @param string $text - передаваемое значение
 *
 * @return string - подготовленное значение
 */
function prepare_double_commas(text)
{
    return text.replace(/"/g, "'");
}

/*
 * Преобразование списка через запятые в массив
 *
 * @param string $string - передаваемое значение
 *
 * @return string - подготовленное значение
 */
function get_array_from_string(string)
{
    if (string === '') {
        return [];
    }

    if (!isString(string)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not a string type: ' + typeof (string));
    }

    return trim(string, ',').split(',');
}



/*
 * Проверка - пустая переменная или нет (инверсия)
 *
 * @param string $var - передаваемое значение
 *
 * @return boolean
 */
function is_not_empty(val)
{
    if (!isUndefined(val) && val) {
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
function array_is_not_empty(val)
{
    if (!isArray(val) || isUndefined(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not an array type: ' + typeof (string));
    }
    return !_lang.isEmpty(val);
}



/*
 * Проверка - пустая переменная (массив) или нет
 *
 * @param array $var - передаваемый массив
 *
 * @return boolean
 */
function array_is_empty(val)
{
    return !array_is_not_empty(val);
}










/*
 * Проверка - пустая переменная или нет
 *
 * @param string $var - передаваемое значение
 *
 * @return boolean
 */
function is_empty(val)
{
    return !is_not_empty(val);
}


//function is_method_and_class_enable($class_path, $method_name)


/*
 * Выводит значение переменной с гарантией, что оно не пустое
 *
 * @param string $var - выводимое значение
 *
 * @return string - выводимое значение
 */
function pass_through(val)
{
    if (!val && val !== "") {
        ErrorHandler.process(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH, '[' + val + ']');
    }
    return (val);
}


//function get_self_mvc_url()



//redirect_to_self_mvc_url()


/*
 * Преобразуем все значения одномерного массива в integer форму
 *
 * @param array $array - преобразуемый массив
 *
 * @return array - преобразованный массив
 */
function prepare_int_array(arr)
{
    for (var index in arr) {
        arr[index] = toInt(arr[index]);
    }
    return arr;
}


//write_to_log($file, $message, $generic_error = false)




function toInt(val) {
    return _lang.toInteger(val);
}




function toString(val) {
    return _lang.toString(val);
}















//function checkdate( month, day, year )    // Validate a Gregorian date



/*
 * Проверка правильности введенной даты (есть такая дата в календаре или нет)
 *
 * @param string $day - день
 * @param string $month - месяц
 * @param string $year - год
 *
 * @return boolean
 */
function validate_date(day, month, year)
{
    month = toInt(month);
    day = toInt(day);
    year = toInt(year);

    var myDate = new Date();
    myDate.setFullYear(year, (month - 1), day);
    return ((myDate.getMonth() + 1) == month && day < 32);
}










/*
 * Delete HTML tags
 *
 * @param string str - text with html tags
 *
 * @return string - stripped text without html tags
 */
function strip_tags(str){
    return str.replace(/<\/?[^>]+>/gi, '');
}



/*
 * Escape HTML tags from a string
 *
 * @param string str - text with html tags
 *
 * @return string - text with escaped html tags
 */
function escapeHtml(text) {
  return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
}








/*
 * Change image to .jpeg extention if necessary
 *
 * @param string source - source image path
 *
 * @return string - path to .jpeg image
 */
function change_image_to_jpeg(source)
{
    // Define path to image with .jpeg extention
    let path_to = prepare_image_name_to_jpeg(source);

    // If defined path differs from source path - create a new file with .jpeg extention
    if (path_to != source) {

        let finished = false;
        ImageMagick.convert(
                [
                    source,
                    '-background',
                    'rgb(255,255,255)',
                    '-flatten',
                    path_to
                ],
                function (err, stdout) {
                    if (err) {
                        deleteFile(source);
                        ErrorHandler.process(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
                    }
                    finished = true;
                }
        );
        // Wait for convertation to be finished
        Deasync.loopWhile(function () {
            return !finished;
        });

        // Delete source image
        deleteFile(source);
    }
    return path_to;
}









/*
 * Create image with specified parameters
 *
 * @param string path_to - destination path
 * @param string source - source path
 * @param integer neww - destination width (default 0)
 * @param integer newh - destination height (default 0)
 *   If one or both sizes are not specified, then using special calculations (see code)
 * @param integer quality - destination quality (default 100)
 *
 * @return boolean - result
 */
function image_resize(path_to, source, neww = 0, newh = 0, quality = 100)
{
    let dimensions = getImageDimentions(source);
    let source_width = dimensions.width;
    let source_height = dimensions.height;

    let width, height, k;

    if ((neww === 0) && (newh === 0)) {
        width = source_width;
        height = source_height;
    } else if (newh === 0) {
        k = neww / source_width;
        width = neww;
        height = parseInt(source_height * k, 10);
    } else if (neww === 0) {
        k = newh / source_height;
        width = parseInt(source_width * k, 10);
        height = newh;
    } else {
        width = neww;
        height = newh;
    }

    let finished = false;

    ImageMagick.resize({
        srcPath: source,
        dstPath: path_to,
        width: width,
        height: height,
        quality: quality
    }, function (err, stdout, stderr) {
        if (err) {
            deleteFile(source);
            ErrorHandler.process(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
        }
        finished = true;
    });

    // Wait for convertation to be finished
    Deasync.loopWhile(function () {
        return !finished;
    });
    // Delete source image
    deleteFile(source);
    return true;
}

/*

 /*
 * Generate comfortable to remember password
 *
 * @return string password
 */
function create_password()
{
    let vowel = [
        'a',
        'e',
        'i',
        'o',
        'u',
    ];

    let consonant = [
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
    ];

    result = '';
    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            result += consonant[_num.random(0, 15)];
        } else {
            result += vowel[_num.random(0, 4)];
        }
    }

    return result;
}




/*
 * Check if file exists
 *
 * @return boolean
 */
function check_local_file(path) {
    if (!Fs.existsSync(path)) {
        ErrorHandler.process(ErrorCodes.ERROR_LOCAL_FILE_NOT_FOUND, '[' + path + ']');
    }
    return true;
}




















//pre($data = null, $return = false, $exit = true)

//is_ajax()

//get_device()


/*
 function get_controller_name()
 {
 import Url from 'src/modules/controller/Controller'; getControllerName
 Url.getControllerName()
 }
 */


/*
 function get_action_name
 import Url from 'src/modules/controller/Controller'; getActionName
 */



/*
 function is_map_page
 import Url from 'src/modules/controller/Controller'; isMapPage
 */








/*
 * Rename either image's extension to jpeg
 *
 * @param string name - image name with any extension
 *
 * @return string - image name with .jpeg extension
 */
function prepare_image_name_to_jpeg(name)
{
    return name.replace(/\.[a-z]+$/, '.jpeg');
}

/*
 * Detect either type is image or not
 *
 * @param string type - verifiable type
 *
 * @return boolean
 */
function is_image_type(type)
{
    return ['jpeg', 'jpg', 'png', 'gif'].includes(type.toLowerCase())
}




/*
 * Detect if value exists in array
 *
 * @param mix value - value
 * @param array arr - array
 *
 * @return boolean
 */
function in_array(value, arr)
{
    return arr.includes(value)
}







/*
 * Get image dimentions
 *
 * @param string path - image path
 *
 * @return object - image's dimentions
 */
function getImageDimentions(path) {
    try {
        let dimensions = SizeOf(path);
        return dimensions;
    } catch (e) {
        ErrorHandler.process(ErrorCodes.ERROR_IMAGE_GET_TYPE, '[' + path + ']' + '. ' + e.message);
    }
}





/*
 * Get image type (extension)
 *
 * @param string path - image's path
 * @param boolean by_url - detect by path or by file itself
 *
 * @return string - image's type
 */
function get_image_type(path, by_url = false)
{
    if (by_url === true) {
        return path.replace(/(?:.+?)\.([a-z]+)$/i, '$1');
    }

    return getImageDimentions(path).type;
}


/*
 * Return
 *
 * @param current date with time
 *
 * @return string
 */
function getDate()
{
    let date = new Date();

    return date.getFullYear() + '.' + date.getMonth() + '.' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes()
}

/*
 * Return unique word
 *
 * @return string
 */
function get_unique()
{
    return Uniqid() + _num.random(1, 999);
}















































function htmlller_buttons(title = null)
{
    let icons = 'icons_' + (IsMobile ? Consts.DEVICE_NAME_MOOBILE : Consts.DEVICE_NAME_DESCTOP) + '.png';

    let html = ''
            + '<div class="icon">'
            + '<img src="/img/' + icons + '">'
            + '</div>';
    if (title) {
        html += '<div class="button_text">'
                + pass_through(title)
                + '</div>';
    }
    return html;
}






/*
 * Check map coordinates on correctness
 *
 * @param float x - x coordinate
 * @param float y - y coordinate
 *
 * @return boolean
 */
function check_coords(x = null, y = null, error_call = true)
{
    if (!x || !y || x >= 180 || x <= -180 || y <= -90 || y >= 90) {
        if (error_call) {
            ErrorHandler.process(ErrorCodes.ERROR_WRONG_COORDS, 'x:' + x + ', y:' + y);
        } else {
            return false;
        }
    }
    return true;
}





/*
 * Return url flag's picture
 *
 * @param string country_code - country code
 *
 * @return string
 */
function get_flag_url(country_code)
{
    return Consts.MY_IMG_URL + "flags/" + country_code + ".png";
}


























/*
 * Return random placemark's photo
 *
 * @param array photos - placemark's photos
 * @param string prefix - size photo's prefix
 * @param boolean return_sizes - return array of url and sizes or just string url
 *
 * @return string/array
 */
function get_random_placemark_photo(photos, prefix, return_sizes = false)
{
    checkOnArray(photos);

    let count = photos.length;
    let photo_id = 0; //photo_id = _num.random(0, count-1);
    let url = pass_through(photos[photo_id]['dir']) + pass_through(prefix) + '_' + pass_through(photos[photo_id]['name']);

    if (return_sizes) {
        return {
            'url':url,
            'width':photos[photo_id]['width'],
            'height':photos[photo_id]['height']
        };
    }

    return url;
}






/*
 * Cutting text with saving word integrity
 *
 * @param string text - text for cutting
 * @param integer length - cutting length
 *
 * @return string - cutted text
 */
function get_cutted_text(text, length, dots = true)
{
    checkOnString(text);

    if (text === '') {
        return '';
    }

    // Clear from html tags
    text = strip_tags(text);


    // Maybe text length is not too big
    if (text.length < length) {
        return text;
    }

    // Cut text
    text = text.substring(0, length);

    // Ensure that text is not ending with specific symbols
    text = rtrim(text, "!,.-");

    // Find the last space and delete it with a possible chunk of the word on the right
    text = text.replace(/(.*?)(?: [^ ]*)$/gi, '$1');

    return text + (dots ? ' ...' : '');
}




/*
 * Return service name from url
 *
 * @return string
 */
function get_service_data()
{
    return Config.services[get_service_name()];
}



/*
 * Return service name from url
 *
 * @return string
 */
function get_service_name()
{
    let service_name = Request.get(Consts.SERVICE_VAR_NAME);

    if (Config.services.hasOwnProperty(service_name)) {
        return service_name;
    }

    ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_SERVICE_NAME, '[' + service_name + ']');
}

























/*
 * Перевод имени региона на язык пользователя
 *
 * @param string $state_name - имя региона
 * @param string $state_code - код региона
 *
 * @return string - переведенное имя региона
 */
function auto_translate_state($state_name, $state_code)
{
    $language_component = components\Language::get_instance();
    $countries_component = components\Countries::get_instance();
    $language = $language_component->get_language();
    $country_code = $countries_component->get_country_code_from_url();
    return $countries_component->translate_state_names($language, $country_code, $state_name, $state_code);
}


function get_request_uri(){
return  MY_DOMEN . $_SERVER['REQUEST_URI'];

}

















<?php

/*
 * Копирует директорию
 *
 * @param string $srcdir - копируемый путь папки
 * @param string $dstdir - путь куда копируем
 * @param boolean $verbose - отображение хода событий
 */
function dircopy($srcdir, $dstdir, $verbose = false)
{
    $num = 0;
    if (!is_dir($dstdir))
        mkdir($dstdir);
    if ($curdir = opendir($srcdir)) {
        while ($file = readdir($curdir)) {
            if ($file != '.' && $file != '..') {
                $srcfile = $srcdir . '/' . $file;
                $dstfile = $dstdir . '/' . $file;
                if (is_file($srcfile)) {
                    if (is_file($dstfile))
                        $ow = filemtime($srcfile) - filemtime($dstfile);
                    else
                        $ow = 1;
                    if ($ow > 0) {
                        if ($verbose)
                            echo "Copying $srcfile to $dstfile...";
                        if (copy($srcfile, $dstfile)) {
                            touch($dstfile, filemtime($srcfile));
                            $num++;
                            if ($verbose)
                                echo "OKn";
                        } else
                            echo "Error: File $srcfile could not be copied!n";
                    }
                }
                else if (is_dir($srcfile)) {
                    $num += dircopy($srcfile, $dstfile, $verbose);
                }
            }
        }
        closedir($curdir);
    }
    return $num;
}

/*
 * Очищает текст от возможных тегов и прочих ненужных, нечитаемых символов
 * Функция пустая, но можно добавить функционал при необходимости
 *
 * @param string $text
 * @return string
 */
function naking_text($text)
{
    return $text;
}

/*
 * Преобразование нелатинских символов в латинские
 *
 * @param string $var - преобразуемое слово
 *
 * @return string - преобразованное слово
 */
function prepare_strange_words($var)
{
    $words_from = array('ö', 'ü', 'ß', 'ć', 'ț', 'ș', 'í', 'ó', 'á', 'ñ', 'ô', 'Î', 'Ō', 'é','č', 'ž', 'ō','É');
    $words_to = array('o', 'u', 'ss', 't', 't', 's', 'i', 'o', 'a', 'n', 'o', 'i', 'o', 'e', 'c', 'z', 'o', 'e');
    return str_replace($words_from, $words_to, $var);
}

/*
 * Преобразование текста в одно слово на латинском языке
 *
 * @param string $var - преобразуемый текст
 * @param string $default - дефолтное значение, если преобразуемый текст пустой
 *
 * @return string - подготовленный текст
 */
function prepare_to_one_word($var = null, $default = MY_UNDEFINED_VALUE)
{
    if (!$var) {
        $var = $default;
    }

    $var = prepare_strange_words($var);
    return preg_replace('#[,\(\)\']*#', '', strtolower(prepare_to_dir_name($var)));
}

/*
 * Преобразование текста в одно слово, которое можно использовать в названии директории
 *
 * @param string $var - преобразуемый текст
 *
 * @return string - подготовленное слово
 */
function prepare_to_dir_name($var)
{
    return preg_replace('/[ \-\.\,\|«»]/', '_', preg_replace('/[\'\"]/', '', trim($var)));
}

/*
 * Убираем из текста специальные символы
 *
 * @param string $var - преобразуемый текст
 *
 * @return string - подготовленный текст
 */
function clear_special_symbols($text)
{
    return preg_replace('/[ \,\|«»]\'\"\`\!/', ' ', $text);
}

/*
 * Удаляем директорию вместе с содержимым
 *
 * @param string $delfile - путь до директории
 */
function removeDir($delfile)
{
    if (file_exists($delfile)) {
        chmod($delfile, 0777);
        if (is_dir($delfile)) {
            $handle = opendir($delfile);
            while ($filename = readdir($handle))
                if ($filename != "." && $filename != "..") {
                    removeDir($delfile . "/" . $filename);
                }

            closedir($handle);
            @rmdir($delfile);
        } else {
            @unlink($delfile);
        }
    }
}

function is_dir_empty($dir)
{
    $iterator = new \FilesystemIterator($dir);
    return !$iterator->valid();
}




/*
 * Переводим буквы текста с русского на английский (латинский)
 *
 * @param string $var - подготавливаемый текст
 *
 * @return string - подготовленный текст
 */
function translater_ru_to_en($text)
{
    $rus = array('А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я', 'а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'ъ', 'ы', 'ь', 'э', 'ю', 'я', ' ');
    $lat = array('a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya', 'a', 'b', 'v', 'g', 'd', 'e', 'e', 'gh', 'z', 'i', 'y', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'f', 'h', 'c', 'ch', 'sh', 'sch', 'y', 'y', 'y', 'e', 'yu', 'ya', ' ');
    return str_replace($rus, $lat, $text);
}

/*
 * Подготавливаем путь до фотографии метки
 * Если фотография отсутствует на локальном сервере, то возвращается путь до удаленного хранилища, где она должна быть
 * Сделано, для экономии ресурсов локального сервера
 *
 * @param integer $id - id метки
 * @param string $name - название фотографии без префикса
 * @param string $prefix - префикс (обозначает размер фотографии)
 * @param boolean $only_dir - возвратить только путь до папки
 * @param boolean $is_url - путь - URL или внутреннний
 * @param string $service_name - название сервиса (имя сайта) - для многосервисных проектов
 *
 * @return string - подготовленный путь
 */
function prepare_photo_path($id, $name, $prefix, $only_dir = false, $is_url = false, $service_name = null)
{
    if (!$service_name) {
        $service_name = get_service_name();
    }

    $photo_path = MY_FILES_DIR . 'map/' . $service_name . '/' . $id . '/' . $prefix . $name;
    if (file_exists($photo_path)) {
        $photo_name = '';
        if (!$only_dir) {
            $photo_name = $prefix . $name;
        }
        if ($is_url) {
            $current_photo_path = MY_FILES_MAP_URL . $service_name . '/' . $id . '/' . $photo_name;
        } else {
            $current_photo_path = MY_FILES_DIR . 'map/' . $service_name . '/' . $id . '/' . $photo_name;
        }
    } else {
        $photo_name = '';
        if (!$only_dir) {
            $photo_name = $prefix . $name;
        }
        $current_photo_path = 'http://140706.selcdn.ru/mapstore/map/' . $service_name . '/' . $id . '/' . $photo_name;
    }
    return $current_photo_path;
}

/*
 * Возвращает имя сайта, прописанного в конфигурации сервиса
 *
 * @param string $service_name - имя сервиса
 *
 * @return string - имя сайта
 */
function get_site_name($service_name)
{
    $config = require(MY_SERVICES_DIR . $service_name . MY_DS . 'config' . MY_DS . 'config.php');
    if (isset($config['generic']['site_name'])) {
        return $config['generic']['site_name'];
    }
    return false;
}


/*
 * Проверяет - есть ли сервис с таким именем
 *
 * @param string $service_name - имя сервиса
 *
 * @return boolean
 */
function is_valid_service($service_name)
{
    if (is_dir(MY_SERVICES_DIR . $service_name)) {
        return true;
    }

    return false;
}

/*
 * Подготавливает имя страны:
 * Пример:
 *     Папский Престол (Государство-город Ватикан) (преобразует в)=> Ватикан
 *
 * @param string $name - имя страны
 *
 * @return string - подготовленное имя страны
 */
function prepare_country_name($name)
{
    $countries_names_replaces = require(MY_APPLICATION_DIR . 'components' . MY_DS . 'app' . MY_DS . 'countries' . MY_DS . 'countries_names_replaces.php');
    foreach ($countries_names_replaces as $replaced_name => $replace) {
        if ($name === $replaced_name) {
            return $replace;
        }
    }
    return $name;
}

/*
 * Подготавливает имя региона:
 * Пример (если у пользователя русский язык):
 *     'Niederösterreich' (преобразует в)=> 'Нижняя Австрия'
 *
 * @param string $country_code - код страны
 * @param string $state_name - имя региона
 * @param string $state_code - код региона
 * @param string $language - язык
 *
 * @return string - подготовленное имя региона
 */
function translate_state_names($country_code, $state_name, $state_code, $language)
{
    global $connect;

    // Дефолтное значение
    $result = $state_name;

    $sql = "SELECT ct.*, cs.url_code
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $state_name . "\" AND language = '" . $language . "' AND is_city=0";
    // NOTE  - cs.url_code может равняться null, когда нет указан only_for_state, в таком случае может сработать только первое условие ниже
    $datas = $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();

    if (count($datas) === 1) {// по сути это единственное условие, условие ниже может сработать если как раньше было (город санкт перербург был указан гуглом 2 раза для двух мест сразу одним названием)
        if ((!$datas[0]['url_code']) || ($datas[0]['url_code'] === $state_code)) {
            $result = $datas[0]['translate'];
        }
    } else {
        foreach ($datas as $data) {
            if ($data['url_code'] === $state_code) {
                $result = $data['translate'];
            }
        }
    }






    return $result ?: $state_name;
}








/*
 * Подготавливает имя города:
 * Пример (если у пользователя русский язык):
 *     'Matale' (преобразует в)=> 'Матале'
 *
 * @param string $country_code - код страны
 * @param string $state_name - имя города
 * @param string $state_code - код региона
 * @param string $language - язык
 *
 * @return string - подготовленное имя города
 */
function translate_city_names($country_code, $city_name, $state_code, $language)
{
    global $connect;

    // Дефолтное значение
    $result = $city_name;

    $sql = "SELECT ct.translate
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE cs.url_code = '" . $state_code . "' AND c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";
    // NOTE  - cs.url_code может равняться null, когда нет указан only_for_state, в таком случае может сработать только первое условие ниже
    $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();


    if (!$data['translate']) {
        // значит страна без штатов (или гугл думает что в ней нет штатов) и надо подобрать перевод для города не относящегося к штату
    $sql = "SELECT ct.translate
            FROM country c
            LEFT JOIN country_states_cities_google_translates ct on c.id = ct.country_id
            LEFT JOIN country_states cs on cs.id = ct.only_for_state
            WHERE c.local_code = '" . $country_code . "' AND ct.google_name = \"" . $city_name . "\" AND language = '" . $language . "' AND is_city=1 LIMIT 1";

        $data = $conn->query($sql, \PDO::FETCH_ASSOC)->fetch();

    }


    if ($data['translate']) {
        $result = $data['translate'];
    }

    return $result ?: $city_name;
}







/*
 * Проверяет - имеет ли страна регионы
 *
 * @param string $country_code - код страны
 *
 * @return boolean
 */
function has_states($country_code)
{
    global $connect;

    if ($country_code === MY_UNDEFINED_VALUE) {
        // например в случае, если гугл не знает местопложения и country_code от этого стал undefined
        return false;
    }

    $sql = "SELECT cp.has_states
        FROM country c
        LEFT JOIN country_params cp on c.id = cp.country_id
        WHERE c.local_code = '".$country_code."'";

    $data = $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();

    $result = isset($data['has_states']) ? (boolean)$data['has_states'] : false;

    return $result;
}






/*
 * Берет все страны
 *
 * @return array
 */
function get_countries($language = MY_LANGUAGE_RU)
{
    global $connect;

    $sql = "SELECT
            c.id as id,
            c.local_code as code,
            cn.name as name
        FROM country c
        LEFT JOIN country_name cn on c.id = cn.country_id
        WHERE cn.language = '".$language."'
        ORDER by cn.name";

    return $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
}



/*
 * Берет статью по id
 *
 * @return array
 */
function get_articles($id=null)
{
    global $connect;

    $id = (int)$id;
    if ($id) {
        $sql = "SELECT *
            FROM ".get_service_name()."_articles
            WHERE id = " .(int)$id;

        return $connect->query($sql, \PDO::FETCH_ASSOC)->fetch();
    } else {
        $sql = "SELECT *
            FROM ".get_service_name()."_articles";

        return $connect->query($sql, \PDO::FETCH_ASSOC)->fetchAll();
    }
}



/*
 * Хеширует введенное значение
 *
 * @param string $value - хешируемое значение
 *
 * @return string - хешированное значение
 */
function hashing($value)
{
    $salt = generate_salt();
    $hash = crypt($value, $salt);
    return $hash;
}

/*
 * Возвращает соль для хеширования
 *
 * @return string - соль
 */
function generate_salt()
{
    $random = return_random();
    return MY_CRYPT_HASH_ALGORYTM_CODE . $random;
}

function is_same($a, $b)
{
    if (!is_string($a) || !is_string($b))
        return false;

    $mb = function_exists('mb_strlen');
    $length = $mb ? mb_strlen($a, '8bit') : strlen($a);
    if ($length !== ($mb ? mb_strlen($b, '8bit') : strlen($b)))
        return false;

    $check = 0;
    for ($i = 0; $i < $length; $i+=1)
        $check|=(ord($a[$i]) ^ ord($b[$i]));

    return $check === 0;
}
/*
 * Проверяет соответствие пароля хешу
 *
 * @param string $value - сравниваемое значение
 * @param string $hash - хеш
 *
 * @return boolean
 */
function hash_equals_to_value($value, $hash)
{
    $test = crypt($value, $hash);
    return is_same($test, $hash);
}

/*
 * Возвращает случайное слово
 *
 * @param integer $lenght - длина слова
 *
 * @return string - случайное слово
 */
function return_random($lenght = 3)
{
    $random = '';
    for ($i = 0; $i < $lenght; $i++) {
        $random.=chr(rand(97, 122));
    }
    return $random;
}

/*
 * Подготавливает из переменной массив,
 * если переменная не массив, то возвратится пустой массив
 *
 * @param mix $value - переменная
 *
 * @return array - подготовленный массив
 */
function prepare_to_array($value)
{
    return array_is_not_empty($value) ? $value : array();
}

/*
 * Возвращает тип базы данных (mysql, redis и т.д.)
 *
 * @return string - тип базы данных
 */
function get_db_type()
{
    static $config;
    if (!isset($config) || !$config) {
        $config = require(MY_APPLICATION_DIR . 'config' . MY_DS . 'config.php');
    }
    return key($config['db']);
}



/*
 * Возвращает список данных категорий сервиса
 *
 * @param string $language - язык, на котором требуется получить именя категорий
 * @param integer $sort_by_id - сортировка по id или нет
 * @param string $service_name - имя сервиса
 *
 * @return array - список данных категорий сервиса
 */
function get_categories($language, $sort_by_id = true, $service_name=null)
{
    if(is_null($service_name)){
        $service_name = $_REQUEST[MY_SERVICE_VAR_NAME];
    }
    $string = 'form/map_new_point/category/';
    $categories = require(MY_SERVICES_DIR . $service_name . MY_DS . 'config' . MY_DS . 'config.php');
    $words = require(MY_SERVICES_DIR . $service_name . MY_DS . 'language' . MY_DS . $language . '.php');

    foreach ($categories['categories']['categories_codes'] as &$data) {
        $data['name'] = $words['form/map_new_point/category/' . $data['id']];
    }
    unset($data);

    $result = $categories['categories']['categories_codes'];

    if ($sort_by_id) {
        $result_sorted = array();
        foreach ($result as $data) {

            $result_sorted[$data['id']] = $data;
        }
        ksort($result_sorted);
        $result = $result_sorted;
    }
    return $result;
}


/*
 * Копируем файлы со сторонних сайтов, даже защищенных
 */
function download_image_by_url($image_url, $image_file)
{
    $fp = \fopen($image_file, 'w+');// open file handle

    $ch = \curl_init($image_url);

    $agent = 'Accept:image/jpeg,text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8 User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_7_5) AppleWebKit/537.11 (KHTML, like Gecko) Chrome/23.0.1271.64 Safari/537.11';

    \curl_setopt($ch, CURLOPT_USERAGENT, $agent);

    \curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    \curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
    \curl_setopt($ch, CURLOPT_TIMEOUT, 44000);
    \curl_setopt($ch, CURLOPT_AUTOREFERER, false);
    \curl_setopt($ch, CURLOPT_REFERER, "http://google.com");
    \curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);
    \curl_setopt($ch, CURLOPT_HEADER, 0);
    \curl_setopt($ch, CURLOPT_FOLLOWLOCATION, TRUE); // Follows redirect responses.
    \curl_setopt($ch, CURLOPT_USERPWD, "user:password");

    $raw = \curl_exec($ch);

    $httpCode = \curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if (($raw === false) || ($httpCode == 404) || ($httpCode == 403)) {
        return false;
    }

    \curl_close($ch);
    $localName = $image_file; // The file name of the source can be used locally
    if (\file_exists($localName)) {
        \unlink($localName);
    }

    $fp = \fopen($localName, 'x');
    \fwrite($fp, $raw);
    \fclose($fp);
    return true;
}









function real_ip()
{
    $header_checks = array(
        'HTTP_CLIENT_IP',
        'HTTP_PRAGMA',
        'HTTP_XONNECTION',
        'HTTP_CACHE_INFO',
        'HTTP_XPROXY',
        'HTTP_PROXY',
        'HTTP_PROXY_CONNECTION',
        'HTTP_VIA',
        'HTTP_X_COMING_FROM',
        'HTTP_COMING_FROM',
        'HTTP_X_FORWARDED_FOR',
        'HTTP_X_FORWARDED',
        'HTTP_X_CLUSTER_CLIENT_IP',
        'HTTP_FORWARDED_FOR',
        'HTTP_FORWARDED',
        'ZHTTP_CACHE_CONTROL',
        'REMOTE_ADDR'
    );

    foreach ($header_checks as $key)
    {
        if (array_key_exists($key, $_SERVER) === true)
        {
            foreach (explode(',', $_SERVER[$key]) as $ip)
            {
                $ip = trim($ip);

                //filter the ip with filter functions
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false)
                {
                    return $ip;
                }
            }
        }
    }
}
function isSearchBot($ip=''){

    if (!$ip) {
        $ip = real_ip();
    }
    $ips = array(
        '77.88.22.',
        '77.88.23.',
        '87.250.224.',
        '87.250.255.',
        '93.158.12',
        '93.158.13',
        '93.158.14',
        '93.158.15',
        '93.158.16',
        '93.158.17',
        '93.158.18',
        '93.158.19',
        '95.108.12',
        '95.108.13',
        '95.108.14',
        '95.108.15',
        '95.108.16',
        '95.108.17',
        '95.108.18',
        '95.108.19',
        '95.108.20',
        '95.108.21',
        '95.108.22',
        '95.108.23',
        '95.108.24',
        '95.108.25',
        '213.180.19',
        '213.180.20',
        '213.180.21',
        '64.68.80.',
        '64.68.81.',
        '64.68.82.',
        '64.68.83.',
        '64.68.84.',
        '64.68.85.',
        '64.68.86.',
        '64.68.87.',
        '64.233.160.',
        '64.233.161.',
        '64.233.162.',
        '64.233.163.',
        '64.233.164.',
        '64.233.165.',
        '64.233.166.',
        '64.233.167.',
        '64.233.168.',
        '64.233.169.',
        '64.233.170.',
        '64.233.171.',
        '64.233.172.',
        '64.233.173.',
        '64.233.174.',
        '64.233.175.',
        '66.102.0.',
        '66.102.1.',
        '66.102.2.',
        '66.102.3.',
        '66.102.4.',
        '66.102.5.',
        '66.102.6.',
        '66.102.7.',
        '66.102.8.',
        '66.102.9.',
        '66.102.10.',
        '66.102.11.',
        '66.102.12.',
        '66.102.13.',
        '66.102.14.',
        '66.102.15.',
        '66.231.188.',
        '66.249.6',
        '66.249.7',
        '66.249.8',
        '66.249.9',
        '72.14.19',
        '72.14.20',
        '72.14.21',
        '72.14.22',
        '72.14.23',
        '72.14.24',
        '72.14.25',
        '209.85.1',
        '209.85.2',
        '216.239.3',
        '216.239.4',
        '216.239.5',
        '216.239.6',
        '67.195.',
        '69.147.6',
        '69.147.7',
        '69.147.8',
        '69.147.9',
        '69.147.10',
        '69.147.11',
        '69.147.12',
        '72.30.',
        '74.6.',
        '81.19.64.',
        '81.19.65.',
        '81.19.66.',
        '94.100.17',
        '94.100.18',
        '195.239.211.',
        '65.52.',
        '65.53.',
        '65.54.',
        '65.55.',
        '207.46.',
        '88.212.202.',
        '77.91.224.',
        );

        $pattern = implode('|', $ips);
        $pattern = str_replace('.', '\.', $pattern);

        return (boolean)preg_match("#$pattern#", $ip);
}












/*
 let source = '2.jpg';
 let path_to = '22222222.jpg';

 function resolveAfter2Seconds(x) {
 return new Promise(resolve => {
 ImageMagick.convert(
 [
 source,
 path_to
 ],
 function(err, stdout){console.log('resolveAfter2Seconds111111');
 resolve();console.log('resolveAfter2Seconds222222');
 });

 });
 }
 async function add1(x) {console.log(1);
 var a = await resolveAfter2Seconds(20);
 var b = await resolveAfter2Seconds(30);
 var c = 0;
 console.log(2);
 var files = {a:1,b:2,c:3};

 for (const file in files) {
 console.log(3);
 await resolveAfter2Seconds(30);
 console.log(4);
 }
 console.log(5);
 return x + a + b;
 }
 add1(10).then(v => {
 console.log(v);  // prints 60 after 4 seconds.
 });
 console.log(55);
 */

