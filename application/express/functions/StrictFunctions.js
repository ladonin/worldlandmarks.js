/*
 * File application/express/functions/StrictFunctions.js
 * const StrictFunctions = require('application/express/functions/StrictFunctions');
 *
 * Base functions collection with throwing errors
 */





const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Config = require('application/express/settings/Config.js');
const Consts = require('application/express/settings/Constants');
const Request = require('application/express/components/base/Request');
const Fs = require('fs');
const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const _lang = require('lodash/lang');

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

    ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_UNDEFINED_SERVICE_NAME, '[' + service_name + ']');
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
            ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_WRONG_COORDS, 'x:' + x + ', y:' + y);
        } else {
            return false;
        }
    }
    return true;
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
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_IMAGE_GET_TYPE, '[' + path + ']' + '. ' + e.message);
    }
}
/*
 * Check if file exists
 *
 * @return boolean
 */
function check_local_file(path) {
    if (!Fs.existsSync(path)) {
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_LOCAL_FILE_NOT_FOUND, '[' + path + ']');
    }
    return true;
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
            ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
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
    if (path_to !== source) {

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
                        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_IMAGE_CREATE, '[' + path_to + ']');
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
 * Return a value with guarantee it is not empty
 *
 * @param string val
 *
 * @return string
 */
function pass_through(val)
{
    if (!val && val !== "") {
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_VALUE_NOT_PASSED_THROUGH, '[' + val + ']');
    }
    return (val);
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
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not an array type: ' + typeof (arr));
    }
    return !_lang.isEmpty(arr);
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
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'not a string type: ' + typeof (str));
    }

    return trim(str, ',').split(',');
}
function checkOnArray(val) {
    if (!isArray(val)) {
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'array[' + typeof (val) + ']');
    }
    return true;
}
function isString(val) {
    if (isUndefined(val)) {
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}

function checkOnString(val) {
    if (!isString(val)) {
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_WRONG_VARIABLE_TYPE, 'string[' + typeof (val) + ']');
    }
    return true;
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




module.exports = {
    checkOnString,
    isString,
    checkOnArray,
    get_array_from_string,
    array_is_not_empty,
    pass_through,
    change_image_to_jpeg,
    image_resize,
    check_local_file,
    getImageDimentions,
    check_coords,
    get_service_name,
    array_is_empty,
    get_image_type
};

















