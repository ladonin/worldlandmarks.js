/*
 * File application/express/functions/BaseFunctions.js
 * const BaseFunctions = require('application/express/functions/BaseFunctions');
 *
 * Base functions collection
 */





const SizeOf = require('image-size');
const LodashNum = require('lodash/number');
const LodashUtil = require('lodash/util');
const LodashLang = require('lodash/lang');
const LodashString = require('lodash/string');
const Uniqid = require('uniqid');
const Consts = require('application/express/settings/Constants');
const Config = require('application/express/settings/Config.js');
const Fs = require('fs');
const Messages = require('application/express/settings/Messages');
const Pbkdf2 = require('pbkdf2')






function deleteFile(path) {
    try {
        Fs.unlinkSync(path);
    } catch (e) {
    }
}

function unique_id() {
    return toInt(LodashUtil.uniqueId());
}

function clone(obj) {
    return LodashLang.cloneDeep(obj);
}

function isSet(val) {
    return !isUndefined(val);
}
function isClass(val) {
    return isFunction(val);
}
function isFunction(val) {
    return LodashLang.isFunction(val);
}
function isNull(val) {
    return LodashLang.isNull(val);
}
function isUndefined(val) {
    return LodashLang.isUndefined(val);
}

function isObject(val) {
    return LodashLang.isObject(val);
}
function isMethod(val) {
    return LodashLang.isFunction(val);
}





function isInteger(val) {
    return LodashLang.isInteger(val);
}


function isArray(val) {
    return LodashLang.isArray(val);
}



function trim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return LodashString.trim(text, val);
}


function rtrim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return LodashString.trimEnd(text, val);
}

function ltrim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return LodashString.trimStart(text, val);
}

function toInt(val) {
    return LodashLang.toInteger(val);
}

function toString(val) {
    if (isObject(val)) {
        return JSON.stringify(val);
    }
    return LodashLang.toString(val);
}

function isString(val) {
    return LodashLang.isString(val);
}
/*
 * Repace double quotes on single
 *
 * @param {string} text
 *
 * @return {string}
 */
function prepare_double_quotes(text)
{
    return text.replace(/"/g, "'");
}




/*
 * Check whether variable is empty or not (inversion)
 *
 * @param {string} val
 *
 * @return {boolean}
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
 * @param {string} val
 *
 * @return {boolean}
 */
function is_empty(val)
{
    return !is_not_empty(val);
}


/*
 * Prepare all array elements into integer form
 *
 * @param {array} arr
 *
 * @return array - prepared array
 */
function prepareToIntArray(arr)
{
    for (var index in arr) {
        arr[index] = toInt(arr[index]);
    }
    return arr;
}

/*
 * Validate date
 *
 * @param {string} day
 * @param {string} month
 * @param {string} year
 *
 * @return {boolean}
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
 * @param {string} str - text with html tags
 *
 * @return {string} - stripped text without html tags
 */
function strip_tags(str) {
    return str.replace(/<\/?[^>]+>/gi, '');
}

/*
 * Escape HTML tags from a string
 *
 * @param {string} text - text with html tags
 *
 * @return {string} - text with escaped html tags
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
 * @return {string} password
 */
function create_password()
{
    let _vowel = [
        'a',
        'e',
        'i',
        'o',
        'u',
    ];

    let _consonant = [
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
    for (let _i = 0; _i < 8; _i++) {
        if (_i % 2 === 0) {
            result += _consonant[LodashNum.random(0, 15)];
        } else {
            result += _vowel[LodashNum.random(0, 4)];
        }
    }

    return result;
}


/*
 * Rename either image's extension to jpeg
 *
 * @param {string} name - image name with any extension
 *
 * @return {string} - image name with .jpeg extension
 */
function prepare_image_name_to_jpeg(name)
{
    return name.replace(/\.[a-z]+$/, '.jpeg');
}

/*
 * Detect either type is image or not
 *
 * @param {string} type - verifiable type
 *
 * @return {boolean}
 */
function is_image_type(type)
{
    return ['jpeg', 'jpg', 'png', 'gif'].includes(type.toLowerCase())
}

/*
 * Detect if value exists in array
 *
 * @param mix value - value
 * @param {array} arr - array
 *
 * @return {boolean}
 */
function in_array(value, arr)
{
    return arr.includes(value)
}



/*
 * Detect if value exists in object
 *
 * @param mix value - value
 * @param {object} object - object
 *
 * @return {boolean}
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
 * @return {string}
 */
function getDate()
{
    let _date = new Date();

    return _date.getFullYear() + '.' + _date.getMonth() + '.' + _date.getDate() + ' ' + _date.getHours() + ':' + _date.getMinutes()
}

/*
 * Return unique word
 *
 * @return {string}
 */
function get_unique()
{
    return Uniqid() + LodashNum.random(1, 999);
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
 * @param {string} country_code - country code
 *
 * @return {string}
 */
function get_flag_url(country_code)
{
    return Consts.IMG_URL + "flags/" + country_code + ".png";
}

/*
 * Return random placemark's photo
 *
 * @param {array} photos - placemark's photos
 * @param {string} prefix - size photo's prefix
 * @param {boolean} return_sizes - return array of url and sizes or just string url
 *
 * @return {string}/array
 */
function get_random_placemark_photo(photos, prefix, return_sizes = false)
{
    checkOnArray(photos);

    let _count = photos.length;
    let _photo_id = 0; //photo_id = LodashNum.random(0, count-1);
    let _url = pass_through(photos[_photo_id]['dir']) + pass_through(prefix) + '_' + pass_through(photos[_photo_id]['name']);

    if (return_sizes) {
        return {
            'url': _url,
            'width': photos[_photo_id]['width'],
            'height': photos[_photo_id]['height']
        };
    }

    return _url;
}

/*
 * Cutting text with saving word integrity
 *
 * @param {string} text - text for cutting
 * @param {integer} length - cutting length
 *
 * @return {string} - cutted text
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
 * Call error
 *
 * @param {object} errorCode - error data {code, name}
 * @param {string} message - error message
 * @param {object} requestData - whole request data
 * @param {string} log_type - type of error (application or db ) - where error log will be saved
 * @param {boolean} writeToLog - some errors must not be written to log to avoid error spaming
 * @param {boolean} outerCall - means that we call this function directly, not from component,
 *  therefore this error will not be catched,
 *  whole site will be turned off,
 *  only for system places,
 *  in this case we should show the error message directly by console.log
 *
 */
function processError(errorCode, message = '', requestData = 'not set', log_type = Consts.LOG_APPLICATION_TYPE, writeToLog = true, outerCall = false) {

    message += ' url[' + toString(requestData) + '] ';

    // Add stack trace
    Error.stackTraceLimit = Infinity;
    let _trace = new Error().stack;

    // Crop unnecessary lines
    _trace = _trace.replace(/at Module\._compile(?:.*?[\n\r]?)*/i, '');

    let _logMessage = '##' + Messages.ERROR_SYNTHETIC_STATUS + '## ' + getDate() + ':  ' + errorCode[1] + ': ' + message + "\r\n" + _trace + "\r\n\r\n\r\n";


    // If debug is turned off then write error messages into file, otherwise show them in browser
    if ((Config.debug === 0) && writeToLog) {
        let _filename = 'error.log';
        if (log_type === Consts.LOG_MYSQL_TYPE) {
            _filename = 'db.log';
        }
        Fs.appendFileSync("log/" + _filename, _logMessage);
    } else if ((Config.debug === 1) && (outerCall === true)) {
        console.log(_logMessage);
    }

    throw {syntCode: errorCode[0], syntMessage: _logMessage};
}



/*
 * Convert the text into one word in English
 *
 * @param {string} text - convertable text
 * @param {string} defaultValue - default value if passed text is empty
 *
 * @return {string} - converted text
 */
function prepareToOneWord(text, defaultValue = Consts.UNDEFINED_VALUE)
{
    if (!text) {
        text = defaultValue;
    }

    text = prepareStrangeLetters(text);
    text = prepareToDirName(text);
    text = text.toLowerCase();
    text = text.replace(/[,\(\)\']*/g, '');

    return text;
}


/*
 * Convert text to one word that can be used as a directory name
 *
 * @param {string} text - convertable text
 *
 * @return {string} - converted text
 */
function prepareToDirName(text)
{
    text = trim(text);
    text = text.replace(/[\'\"]/g, '');
    text = text.replace(/[ \-\.\,\|«»]/g, '_');

    return text;
}

/*
 * Convert foreigner letters into english
 *
 * @param {string} text - convertable text
 *
 * @return {string} - converted text
 */
function prepareStrangeLetters(text)
{
    let _lettersFrom = ['ö', 'ü', 'ß', 'ć', 'ț', 'ș', 'í', 'ó', 'á', 'ñ', 'ô', 'Î', 'Ō', 'é', 'č', 'ž', 'ō', 'É'];
    let _lettersTo = ['o', 'u', 'ss', 't', 't', 's', 'i', 'o', 'a', 'n', 'o', 'i', 'o', 'e', 'c', 'z', 'o', 'e'];

    for (let _index in _lettersFrom) {

        let _letterFrom = _lettersFrom[_index];
        let _letterTo = _lettersTo[_index];
        let _re = new RegExp(_letterFrom, 'g');
        text = text.replace(_re, _letterTo);
    }
    return text;
}




///*
// * Check coordinate on validity
// *
// * @param {string/integer/float} coordinate - x or y
// *
// * @return {boolaen}
// */
//function checkCoordinate(coord)
//{
//    coord = toFloat(coord);
//    if (coord || coord === 0) {
//        return true;
//    }
//    return false;
//}

/*
 * Lead value to float
 *
 * @param {mix} value
 *
 * @return {float}
 */
function toFloat(value)
{
    return parseFloat(value);
}





/*
 * Crypt a value
 *
 * @param {string} value - value to be crypting
 *
 * @return {string} - value's hash
 */
function crypt(value){
    return Pbkdf2.pbkdf2Sync(value, Consts.HASH_SALT, 1, 32, 'sha256').toString('hex');
}






/*
 * Checks eguality value to hash
 *
 * @param {string} value
 * @param {string} hash
 *
 * @return boolean
 */
function hashEqualsToValue(value, hash)
{
    let _hashCompared = crypt(value);

    return _hashCompared === hash;
}


















module.exports = {
    crypt,
    hashEqualsToValue,
    //checkCoordinate,
    toFloat,
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
    prepareToIntArray,
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
    processError,
    prepareToOneWord,
    prepareStrangeLetters,
    prepareToDirName
};

















