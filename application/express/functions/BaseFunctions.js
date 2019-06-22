/*
 * File application/express/functions/BaseFunctions.js
 * const BaseFunctions = require('application/express/functions/BaseFunctions');
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
const _util = require('lodash/util');
const _lang = require('lodash/lang');
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

function unique_id() {
    return toInt(_util.uniqueId());
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

function isObject(val) {
    return _lang.isObject(val);
}







function isString(val) {
    if (isUndefined(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}

function checkOnString(val) {
    if (!isString(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'string[' + typeof (val) + ']');
    }
    return true;
}

function isArray(val) {
    return _lang.isArray(val);
}

function checkOnArray(val) {
    if (!isArray(val)) {
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'array[' + typeof (val) + ']');
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

function toInt(val) {
    return _lang.toInteger(val);
}

function toString(val) {
    return _lang.toString(val);
}

/*
 * Repace double quotes on single
 *
 * @param string text
 *
 * @return string
 */
function prepare_double_quotes(text)
{
    return text.replace(/"/g, "'");
}

/*
 * Split text with commas into an array
 *
 * @param string str
 *
 * @return string
 */
function get_array_from_string(str)
{
    if (str === '') {
        return [];
    }

    if (!isString(str)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not a string type: ' + typeof (str));
    }

    return trim(str, ',').split(',');
}



/*
 * Check whether variable is empty or not (inversion)
 *
 * @param string val
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
 * Check whether array is empty or not (inversion)
 *
 * @param array arr
 *
 * @return boolean
 */
function array_is_not_empty(arr)
{
    if (!isArray(arr) || isUndefined(arr)) {
        ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not an array type: ' + typeof (arr));
    }
    return !_lang.isEmpty(arr);
}

/*
 * Check whether array is empty or not
 *
 * @param array arr
 *
 * @return boolean
 */
function array_is_empty(arr)
{
    return !array_is_not_empty(arr);
}

/*
 * Check whether variable is empty or not
 *
 * @param string val
 *
 * @return boolean
 */
function is_empty(val)
{
    return !is_not_empty(val);
}

/*
 * Return a value with guarantee it is not empty
 *
 * @param string val
 *
 * @return string
 */
function pass_through(val)
{
    if (!val && val !== "") {
        ErrorHandler.process(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH, '[' + val + ']');
    }
    return (val);
}

/*
 * Prepare all array elements into integer form
 *
 * @param array arr
 *
 * @return array - prepared array
 */
function prepare_int_array(arr)
{
    for (var index in arr) {
        arr[index] = toInt(arr[index]);
    }
    return arr;
}

/*
 * Validate date
 *
 * @param string day
 * @param string month
 * @param string year
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
 * Get current time in sec
 */
function get_current_time() {
    return Math.floor(Date.now() / 1000);
}

/*
 * Delete HTML tags
 *
 * @param string str - text with html tags
 *
 * @return string - stripped text without html tags
 */
function strip_tags(str) {
    return str.replace(/<\/?[^>]+>/gi, '');
}

/*
 * Escape HTML tags from a string
 *
 * @param string text - text with html tags
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


//#???????????????????????????? - то, что возможно не нужно
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
            'url': url,
            'width': photos[photo_id]['width'],
            'height': photos[photo_id]['height']
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

module.exports = {
    deleteFile,
    unique_id,
    clone,
    isSet,
    isNull,
    isUndefined,
    isString,
    checkOnString,
    isArray,
    checkOnArray,
    trim,
    rtrim,
    ltrim,
    prepare_double_quotes,
    get_array_from_string,
    is_not_empty,
    array_is_not_empty,
    array_is_empty,
    is_empty,
    pass_through,
    prepare_int_array,
    toInt,
    toString,
    validate_date,
    get_current_time,
    strip_tags,
    escapeHtml,
    change_image_to_jpeg,
    image_resize,
    create_password,
    check_local_file,
    prepare_image_name_to_jpeg,
    is_image_type,
    in_array,
    getImageDimentions,
    get_image_type,
    getDate,
    get_unique,
    htmlller_buttons,
    check_coords,
    get_flag_url,
    get_random_placemark_photo,
    get_cutted_text,
    get_service_data,
    get_service_name,
    isUndefined
};

















