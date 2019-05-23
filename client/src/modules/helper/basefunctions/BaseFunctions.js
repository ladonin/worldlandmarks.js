import ErrorHandler from 'src/modules/errorhandler/ErrorHandler';
import Messages from 'src/settings/Messages';
import ErrorCodes from 'src/settings/ErrorCodes';
const _lang = require('lodash/util');
const _string = require('lodash/string');






function isNull(val){
    return _lang.isNull(val);
}
function isUndefined(val){
    return _lang.isUndefined(val);
}

function isString(val) {
    if (isUndefined(val)) {
        ErrorHandler.process(Messages.ERROR_UNDEFINED_VARIABLE);
    }
    return _lang.isString(val);
}


function isArray(val){
    return _lang.isArray(val);
}

function trim(text, val) {
    //let regexp = new RegExp('^'+val+'+|'+val+'+$','g');
    //return text.replace(regexp, '');
    return _string.trim(text, val);
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

    if (!isString(string)){
        ErrorHandler.process(Messages.ERROR_FUNCTION_ARGUMENTS+': not a string type: ' + typeof(string));
    }

    return trim(string,',').split(',');
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
        ErrorHandler.process(Messages.ERROR_FUNCTION_ARGUMENTS+': not an array type: ' + typeof(string));
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
        ErrorHandler.process(ErrorCodes.MY_ERROR_VALUE_NOT_PASSED_THROUGH+': ['+val+']');
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
    for(var index in arr) {
        arr[index]=toInt(arr[index]);
    }
    return arr;
}


//my_write_to_log($file, $message, $generic_error = false)




function toInt(val){
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
    myDate.setFullYear( year, (month - 1), day );
    return ((myDate.getMonth()+1) == month && day<32);
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








