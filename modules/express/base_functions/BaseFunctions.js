const ErrorHandler = require('modules/errorhandler/ErrorHandler');
const ErrorCodes = require('settings/express/ErrorCodes');
const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const Fs = require('fs');
const SizeOf = require('image-size');
const _num = require('lodash/number');
const _lang = require('lodash/util');
const _string = require('lodash/string');
const Uniqid = require('uniqid');
const IsMobile = require('react-device-detect');
const Consts = require('settings/express/Constants');


function deleteFile(path) {
    try {
        Fs.unlinkSync(path);
    } catch (e) {
    }
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


/*
 * Strip HTML and PHP tags from a string
 *
 * @param string str - text with html tags
 *
 * @return string - stripped text without html tags
 */
function strip_tags(str){
    return str.replace(/<\/?[^>]+>/gi, '');
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
                        ErrorHandler.process(ErrorCodes.ERROR_IMAGE_CREATE + ': [' + path_to + ']');
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
            ErrorHandler.process(ErrorCodes.ERROR_IMAGE_CREATE + ': [' + path_to + ']');
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
function my_create_password()
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
        ErrorHandler.process(ErrorCodes.ERROR_LOCAL_FILE_NOT_FOUND + ': [' + path + ']');
    }
    return true;
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
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE + ': string[' + typeof(val) + ']');
    }
    return true;
}

function isArray(val) {
    return _lang.isArray(val);
}

function checkOnArray(val){
    if (!isArray(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE + ': array[' + typeof(val) + ']');
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
function my_prepare_double_commas(text)
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
function my_get_array_from_string(string)
{
    if (string === '') {
        return [];
    }

    if (!isString(string)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS + ': not a string type: ' + typeof (string));
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
function my_is_not_empty(val)
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
function my_array_is_not_empty(val)
{
    if (!isArray(val) || isUndefined(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS + ': not an array type: ' + typeof (string));
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
function my_array_is_empty(val)
{
    return !my_array_is_not_empty(val);
}










/*
 * Проверка - пустая переменная или нет
 *
 * @param string $var - передаваемое значение
 *
 * @return boolean
 */
function my_is_empty(val)
{
    return !my_is_not_empty(val);
}


//function my_is_method_and_class_enable($class_path, $method_name)


/*
 * Выводит значение переменной с гарантией, что оно не пустое
 *
 * @param string $var - выводимое значение
 *
 * @return string - выводимое значение
 */
function my_pass_through(val)
{
    if (!val && val !== "") {
        ErrorHandler.process(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH + ': [' + val + ']');
    }
    return (val);
}


//function my_get_self_mvc_url()



//my_redirect_to_self_mvc_url()


/*
 * Преобразуем все значения одномерного массива в integer форму
 *
 * @param array $array - преобразуемый массив
 *
 * @return array - преобразованный массив
 */
function my_prepare_int_array(arr)
{
    for (var index in arr) {
        arr[index] = toInt(arr[index]);
    }
    return arr;
}


//my_write_to_log($file, $message, $generic_error = false)




function toInt(val) {
    return _lang.toInteger(val);
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
function my_validate_date(day, month, year)
{
    month = toInt(month);
    day = toInt(day);
    year = toInt(year);

    var myDate = new Date();
    myDate.setFullYear(year, (month - 1), day);
    return ((myDate.getMonth() + 1) == month && day < 32);
}



//my_pre($data = null, $return = false, $exit = true)

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
        ErrorHandler.process(ErrorCodes.ERROR_IMAGE_GET_TYPE + ': [' + path + ']' + '. ' + e.message);
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
function my_get_image_type(path, by_url = false)
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
function my_get_unique()
{
    return Uniqid() + _num.random(1, 999);
}















































function my_htmlller_buttons(title = null)
{
    let icons = 'icons_' + (IsMobile ? Consts.DEVICE_NAME_MOOBILE : Consts.DEVICE_NAME_DESCTOP) + '.png';

    let html = ''
            + '<div class="icon">'
            + '<img src="/img/' + icons + '">'
            + '</div>';
    if (title) {
        html += '<div class="button_text">'
                + my_pass_through(title)
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
function my_check_coords(x = null, y = null, error_call = true)
{
    if (!x || !y || x >= 180 || x <= -180 || y <= -90 || y >= 90) {
        if (error_call) {
            ErrorHandler.process(ErrorCodes.ERROR_WRONG_COORDS + 'x:' + x + ', y:' + y);
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
    let url = my_pass_through(photos[photo_id]['dir']) + my_pass_through(prefix) + '_' + my_pass_through(photos[photo_id]['name']);

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


function my_get_request_uri(){
return  MY_DOMEN . $_SERVER['REQUEST_URI'];

}