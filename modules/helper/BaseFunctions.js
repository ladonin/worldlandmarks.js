const ErrorHandler = require('modules/errorhandler/ErrorHandler');
const ErrorCodes = require('settings/ErrorCodes');
const ImageMagick = require('imagemagick');
const Deasync = require('deasync');
const Fs = require('fs');
const SizeOf = require('image-size');
const _num = require('lodash/number');
const uniqid = require('uniqid');


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


function deleteFile(path) {
    try {
        Fs.unlinkSync(path);
    } catch (e) {
    }
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
        ErrorHandler.process(ErrorCodes.MY_ERROR_IMAGE_GET_TYPE + ': [' + path + ']' + '. ' + e.message);
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
                        ErrorHandler.process(ErrorCodes.MY_ERROR_IMAGE_CREATE + ': [' + path_to + ']');
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
            ErrorHandler.process(ErrorCodes.MY_ERROR_IMAGE_CREATE + ': [' + path_to + ']');
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
 * Return unique word
 *
 * @return string
 */
function my_get_unique()
{
    return uniqid() + _num.random(1, 999);
}


/*
 * Check if file exists
 *
 * @return boolean
 */
function check_local_file(path) {
    if (!Fs.existsSync(path)) {
        ErrorHandler.process(ErrorCodes.MY_ERROR_LOCAL_FILE_NOT_FOUND + ': [' + path + ']');
    }
    return true;
}