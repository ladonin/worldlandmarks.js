/*
 * File server/src/functions/BaseFunctions.js
 * const BaseFunctions = require('server/src/functions/BaseFunctions');
 *
 * Base functions collection
 */





const SizeOf = require('image-size');
const LodashNum = require('lodash/number');
const LodashUtil = require('lodash/util');
const LodashLang = require('lodash/lang');
const LodashString = require('lodash/string');
const Uniqid = require('uniqid');
const Consts = require('server/src/settings/Constants');
const Config = require('server/src/settings/Config.js');
const Fs = require('fs');
const Messages = require('server/src/settings/Messages');
const Pbkdf2 = require('pbkdf2')
const FtpServersConfig = require('server/src/settings/gitignore/FtpServers');

const ErrorCodes = require('server/src/settings/ErrorCodes');

const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const _lang = require('lodash/lang');
const CommonBaseFunctions = require('server/common/functions/BaseFunctions');




/*
 * Check whether array is empty or not
 *
 * @param {array} arr
 *
 * @return {boolean}
 */
function quote(string)
{
    return string.replace(/\'/i, '\'');
}




/*
 * Check whether array is empty or not
 *
 * @param {array} arr
 *
 * @return {boolean}
 */
function array_is_empty(arr)
{
    return !array_is_not_empty(arr);
}



/*
 * Return a value with guarantee it is not empty
 *
 * @param {string/number/float} value
 * @param {object} self - reference on current caller class instance
 *
 * @return {string}
 */
function passThrough(value, self) {

    if (value || value === '0' || value === 0) {
        return value;
    }
    self.error(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH, 'value[' + value + ']');
}



/*
 * Return random placemark's photo
 *
 * @param {array} photos - placemark's photos
 * @param {string} prefix - size photo's prefix
 * @param {boolean} return_sizes - return array of url and sizes or just string url
 * @param {object} self - reference on current caller class instance
 * @param {boolean} first - maybe we want to return first photo
 *
 * @return {string}/array
 */
//function getRandomPlacemarkPhoto(photos, prefix, return_sizes = false, self, first = true)
//{
//    checkOnArray(photos, self);
//
//    let _photo_id = 0;
//    if (first === false) {
//        _photo_id = LodashNum.random(0, photos.length-1);
//    }
//
//    let _url = passThrough(photos[_photo_id]['dir']) + passThrough(prefix) + '_' + passThrough(photos[_photo_id]['name'], self);
//
//    if (return_sizes) {
//        return {
//            'url': _url,
//            'width': photos[_photo_id]['width'],
//            'height': photos[_photo_id]['height']
//        };
//    }
//
//    return _url;
//}


/*
 * Check map coordinates on correctness
 *
 * @param float x - x coordinate
 * @param float y - y coordinate
 * @param {boolean} error_call - should we throw error or not
 * @param {object} self - reference on current caller class instance
 *
 * @return {boolean}
 */
function check_coords(x = null, y = null, error_call = true, self)
{
    if (!x || !y || x >= 180 || x <= -180 || y <= -90 || y >= 90) {
        if (error_call) {
            self.error(ErrorCodes.ERROR_WRONG_COORDS, 'x:' + x + ', y:' + y);
        } else {
            return false;
        }
    }
    return true;
}
/*
 * Get image dimentions
 *
 * @param {string} path - image path
 * @param {object} self - reference on current caller class instance
 *
 * @return {object} - image's dimentions
 */
function getImageDimentions(path, self) {
    try {
        let _dimensions = SizeOf(path);
        return _dimensions;
    } catch (e) {
        self.error(ErrorCodes.ERROR_IMAGE_GET_TYPE, '[' + path + ']' + '. ' + e.message);
    }
}

/*
 * Check if file exists
 *
 * @return {boolean}
 */
function checkLocalFile(path, self) {
    if (!Fs.existsSync(path)) {
        self.error(ErrorCodes.ERROR_LOCAL_FILE_NOT_FOUND, '[' + path + ']');
    }
    return true;
}

/*
 * Create image with specified parameters
 *
 * @param {string} path_to - destination path
 * @param {string} source - source path
 * @param {integer} neww - destination width (default 0)
 * @param {integer} newh - destination height (default 0)
 *   If one or both sizes are not specified, then using special calculations (see code)
 * @param {integer} quality - destination quality (default 100)
 * @param {object} self - reference on current caller class instance
 *
 * @return {boolean} - result
 */
function image_resize(path_to, source, neww = 0, newh = 0, quality = 100, self)
{
    let _dimensions = getImageDimentions(source);
    let _source_width = _dimensions.width;
    let _source_height = _dimensions.height;

    let _width, _height, _k;

    if ((neww === 0) && (newh === 0)) {
        _width = _source_width;
        _height = _source_height;
    } else if (newh === 0) {
        _k = neww / _source_width;
        _width = neww;
        _height = parseInt(_source_height * _k, 10);
    } else if (neww === 0) {
        _k = newh / _source_height;
        _width = parseInt(_source_width * _k, 10);
        _height = newh;
    } else {
        _width = neww;
        _height = newh;
    }

    let _finished = false;

    ImageMagick.resize({
        srcPath: source,
        dstPath: path_to,
        width: _width,
        height: _height,
        quality: quality
    }, function (err, stdout, stderr) {
        if (err) {
            deleteFile(source);
            self.error(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
        }
        _finished = true;
    });

    // Wait for process to be finished
    Deasync.loopWhile(function () {
        return !_finished;
    });
    // Delete source image
    deleteFile(source);
}

/*
 * Change image to .jpeg extention if necessary
 *
 * @param {string} source - source image path
 * @param {object} self - reference on current caller class instance
 *
 * @return {string} - path to .jpeg image
 */
function change_image_to_jpeg(source, self)
{
    // Define path to image with .jpeg extention
    let _path_to = prepare_image_name_to_jpeg(source);

    // If defined path differs from source path - create a new file with .jpeg extention
    if (_path_to !== source) {

        let _finished = false;
        ImageMagick.convert(
                [
                    source,
                    '-background',
                    'rgb(255,255,255)',
                    '-flatten',
                    _path_to
                ],
                function (err, stdout) {
                    if (err) {
                        deleteFile(source);
                        self.error(ErrorCodes.ERROR_IMAGE_CREATE, '[' + _path_to + ']');
                    }
                    _finished = true;
                }
        );
        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });

        // Delete source image
        deleteFile(source);
    }
    return _path_to;
}

/*
 * Check whether array is empty or not (inversion)
 *
 * @param {array} arr
 * @param {object} self - reference on current caller class instance
 *
 * @return {boolean}
 */
function array_is_not_empty(arr, self)
{
    if (!isArray(arr) || isUndefined(arr)) {
        self.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not an array type: ' + typeof (arr));
    }
    return !_lang.isEmpty(arr);
}
/*
 * Split text with commas into an array
 *
 * @param {string} str
 * @param {object} self - reference on current caller class instance
 *
 * @return {string}
 */
function getArrayFromString(str, separator = ',', self)
{
    if (str === '') {
        return [];
    }

    if (!isString(str, self)) {
        self.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not a string type: ' + typeof (str));
    }

    return trim(str, ',').split(separator);
}
function checkOnArray(val, self) {
    if (!isArray(val)) {
        self.error(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'array[' + typeof (val) + ']');
    }
    return true;
}
function isString(val, self) {
    if (isUndefined(val)) {
        self.error(ErrorCodes.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}

function checkOnString(val, self) {
    if (!isString(val, self)) {
        self.error(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'string[' + typeof (val) + ']');
    }
    return true;
}

/*
 * Get image type (extension)
 *
 * @param {string} path - image's path
 * @param {boolean} by_url - detect by path or by file itself
 *
 * @return {string} - image's type
 */
function get_image_type(path, by_url = false)
{
    if (by_url === true) {
        return path.replace(/(?:.+?)\.([a-z]+)$/i, '$1');
    }

    return getImageDimentions(path).type;
}


/*
 * Get service name
 *
 * @param {integer} reqId - request id
 *
 * @return {string}

function getServiceName(reqId){
    return Service.getInstance(reqId).getServiceName();
}*/


/*
 * Translate state name on user's language
 *
 * @param {string} state_name - state name
 * @param {string} state_code - state url code
 *
 * @return {string} - translated state name

function auto_translate_state(state_name, state_code, requestId)
{



    let languageInstance = Language.getInstance(requestId);
    let countriesInstance = Language.getInstance(requestId);



    $countries_component = components\Countries::get_instance();
    $language = $language_component->get_utiluage();
    $country_code = $countries_component->get_country_code_from_url();
    return $countries_component->translate_state_names($language, $country_code, $state_name, $state_code);
}


 */





























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




function isFloat(val){
    return Number(val) === val && val % 1 !== 0;
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
function isEmpty(val)
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
function createPassword()
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
function inArray(value, arr)
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











/*
 * Prepare path to placemark photo
 * If photo is absent in local storage, then return path from remote server
 *
 * @param {integer} id - placemark id
 * @param {string} name - photo name without size prefix
 * @param {string} prefix - size prefix
 * @param {boolean} onlyDir - return only path to directory (not for file)
 * @param {boolean} isUrl - is needed outer link or inner path
 * @param {string} serviceName - current service name
 *
 * @return {string} - prepared path
 */
function preparePhotoPath(id, name, prefix, onlyDir = false, isUrl = false, serviceName)
{
    let _photoPath = Consts.FILES_DIR + 'map/' + serviceName + '/' + id + '/' + prefix + name;
    let _photoName = '';
    let _currentPhotoPath = '';

    if (Fs.existsSync(_photoPath)) {

        if (!onlyDir) {
            _photoName = prefix + name;
        }
        if (isUrl) {
            _currentPhotoPath = Consts.FILES_MAP_URL + serviceName + '/' + id + '/' + _photoName;
        } else {
            _currentPhotoPath = Consts.FILES_DIR + 'map/' + serviceName + '/' + id + '/' + _photoName;
        }
    } else {
         if (!onlyDir) {
            _photoName = prefix + name;
        }

        _currentPhotoPath = 'http://' + FtpServersConfig.url + '/' + FtpServersConfig.rootDirectory + '/map/' + serviceName + '/' + id + '/' + _photoName;
    }
    return _currentPhotoPath;
}


// //ATTENTION - обратите внимание
//getCuttedText => getCroppedText

/*
 * Crop text with saving words integrity
 *
 * @param {string} text - text for cropping
 * @param {integer} length - cropping length
 * @param {boolean} dots - whether we must use dots in the end
 * @param {object} self - reference on current caller class instance
 *
 * @return string - cropped text
 */
function getCroppedText(text, length, dots = true, self)
{
    checkOnString(text, self);

    if (!text) {
        return '';
    }

    // Clear from html
    text = strip_tags(text);

    let _strLength = text.length;
    // If the text is already short
    if (_strLength < length) {
        return text;
    }

    // Cut the text
    text = text.substr(0, length);

    // Ensure that text is not ended with the specific symbols
    text = rtrim(text, "!,.-");

    // Find the last space and delete it with a possible chunk of the word on the right
    text = text.replace(/(.*?)(?: [^ ]*)$/g, '$1');

    return text + (dots ? ' ...' : '');
}


/*
 * Clear text from special symbols
 *
 * @param {string} text - text for preparing
 *
 * @return {string} - prepared text
 */
function clearSpecialSymbols(text)
{
    return text.replace(/[ \,\|«»]\'\"\`\!/g, ' ');
}

/*
 * Reset array keys
 *  For example: [[5]:1,[9]:2] will become [1,2]
 *
 * @param {array} arr
 *
 * @return {array} - prepared new array
 */
function resetArrayKeys(arr)
{
    let _result = [];
    for (let _index in arr) {
        _result.push(arr[_index]);
    }
    return _result;
}

module.exports = {
    ...CommonBaseFunctions,
    resetArrayKeys,
    clearSpecialSymbols,
    quote,
    getCroppedText,
    preparePhotoPath,
    isFloat,
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
    isEmpty,
    prepareToIntArray,
    toInt,
    toString,
    validate_date,
    get_current_time,
    strip_tags,
    escapeHtml,
    createPassword,
    prepare_image_name_to_jpeg,
    is_image_type,
    inArray,
    getDate,
    get_unique,
    get_flag_url,
    //getRandomPlacemarkPhoto,
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
    prepareToDirName,
    checkOnString,
    checkOnArray,
    getArrayFromString,
    array_is_not_empty,
    passThrough,
    change_image_to_jpeg,
    image_resize,
    checkLocalFile,
    getImageDimentions,
    check_coords,
    array_is_empty,
    get_image_type
};

















