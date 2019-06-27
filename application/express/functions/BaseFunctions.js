/*
 * File application/express/functions/BaseFunctions.js
 * const BaseFunctions = require('application/express/functions/BaseFunctions');
 *
 * Base functions collection
 */




const Fs = require('fs');
const SizeOf = require('image-size');
const _num = require('lodash/number');
const _util = require('lodash/util');
const _lang = require('lodash/lang');
const _string = require('lodash/string');
const Uniqid = require('uniqid');
const Consts = require('application/express/settings/Constants');
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
function isClass(val) {
    return isFunction(val);
}
function isFunction(val) {
    return _lang.isFunction(val);
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
function isMethod(val) {
    return _lang.isFunction(val);
}





function isInteger(val) {
    return _lang.isInteger(val);
}


function isArray(val) {
    return _lang.isArray(val);
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
    if (isObject(val)) {
        return JSON.stringify(val);
    }
    return _lang.toString(val);
}

function isString(val) {
    return _lang.isString(val);
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
    return ((myDate.getMonth() + 1) === month && day < 32);
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
 * Detect if value exists in object
 *
 * @param mix value - value
 * @param object object - object
 *
 * @return boolean
 */
function inObject(value, obj)
{
    return obj.hasOwnProperty(value);
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
/*function htmlller_buttons(title = null)
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
}*/

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



module.exports = {
    deleteFile,
    unique_id,
    clone,
    isSet,
    isNull,
    isUndefined,
    isArray,
    trim,
    rtrim,
    ltrim,
    prepare_double_quotes,
    is_not_empty,
    is_empty,
    prepare_int_array,
    toInt,
    toString,
    validate_date,
    get_current_time,
    strip_tags,
    escapeHtml,
    create_password,
    prepare_image_name_to_jpeg,
    is_image_type,
    in_array,
    getDate,
    get_unique,
    get_flag_url,
    get_random_placemark_photo,
    get_cutted_text,
    isClass,
    isFunction,
    isMethod,
    isObject,
    isInteger,
    inObject,
    isString,
    get_service_data
};

















