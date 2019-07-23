/*
 * File application/express/functions/StrictFunctions.js
 * const StrictFunctions = require('application/express/functions/StrictFunctions');
 *
 * Base functions collection with throwing errors
 */






const ErrorCodes = require('application/express/settings/ErrorCodes');
const Config = require('application/express/settings/Config.js');
const Consts = require('application/express/settings/Constants');

const Fs = require('fs');
const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const _lang = require('lodash/lang');
const Language = require('application/express/core/Language');
const Service = require('application/express/core/Service');

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
 * Check map coordinates on correctness
 *
 * @param float x - x coordinate
 * @param float y - y coordinate
 *
 * @return {boolean}
 */
function check_coords(x = null, y = null, error_call = true)
{
    if (!x || !y || x >= 180 || x <= -180 || y <= -90 || y >= 90) {
        if (error_call) {
            this.error(ErrorCodes.ERROR_WRONG_COORDS, 'x:' + x + ', y:' + y);
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
 *
 * @return {object} - image's dimentions
 */
function getImageDimentions(path) {
    try {
        let _dimensions = SizeOf(path);
        return _dimensions;
    } catch (e) {
        this.error(ErrorCodes.ERROR_IMAGE_GET_TYPE, '[' + path + ']' + '. ' + e.message);
    }
}
/*
 * Check if file exists
 *
 * @return {boolean}
 */
function check_local_file(path) {
    if (!Fs.existsSync(path)) {
        this.error(ErrorCodes.ERROR_LOCAL_FILE_NOT_FOUND, '[' + path + ']');
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
 *
 * @return {boolean} - result
 */
function image_resize(path_to, source, neww = 0, newh = 0, quality = 100)
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
            this.error(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
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
 *
 * @return {string} - path to .jpeg image
 */
function change_image_to_jpeg(source)
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
                        this.error(ErrorCodes.ERROR_IMAGE_CREATE, '[' + _path_to + ']');
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
 * Return a value with guarantee it is not empty
 *
 * @param {string} val
 *
 * @return {string}
 */
function pass_through(val)
{
    if (!val && val !== "") {
        this.error(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH, '[' + val + ']');
    }
    return (val);
}
/*
 * Check whether array is empty or not (inversion)
 *
 * @param {array} arr
 *
 * @return {boolean}
 */
function array_is_not_empty(arr)
{
    if (!isArray(arr) || isUndefined(arr)) {
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not an array type: ' + typeof (arr));
    }
    return !_lang.isEmpty(arr);
}
/*
 * Split text with commas into an array
 *
 * @param {string} str
 *
 * @return {string}
 */
function getArrayFromString(str, separator = ',')
{
    if (str === '') {
        return [];
    }

    if (!isString(str)) {
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not a string type: ' + typeof (str));
    }

    return trim(str, ',').split(separator);
}
function checkOnArray(val) {
    if (!isArray(val)) {
        this.error(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'array[' + typeof (val) + ']');
    }
    return true;
}
function isString(val) {
    if (isUndefined(val)) {
        this.error(ErrorCodes.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}

function checkOnString(val) {
    if (!isString(val)) {
        this.error(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'string[' + typeof (val) + ']');
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
 */
function getServiceName(reqId){
    return Service.getInstance(reqId).getServiceName();
}


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





















module.exports = {
    checkOnString,
    isString,
    checkOnArray,
    getArrayFromString,
    array_is_not_empty,
    pass_through,
    change_image_to_jpeg,
    image_resize,
    check_local_file,
    getImageDimentions,
    check_coords,
    array_is_empty,
    get_image_type,
    getServiceName
};

















