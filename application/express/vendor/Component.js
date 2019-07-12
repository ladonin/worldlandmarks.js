/*
 * File application/express/vendor/Component.js
 * const Component = require('application/express/vendor/Component');
 *
 * Base component
 * Available validation rules see in 'application/express/vendor/Model.js'
 */
const BaseFunctions = require('application/express/functions/BaseFunctions');
const RequestsPool = require('application/express/vendor/RequestsPool');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Messages = require('application/express/settings/Messages');
const Config = require('application/express/settings/Config');













class Component {

    constructor() {
        // For instances pool
        this.requestId;
    }

    /*
     * Get object from pool
     * If absent - create and return
     * NOTE: this.instanceId - is a static property of a class inheriting Component
     *
     * @param integer reqId - request id
     *
     * @returns object - instance of requested class
     */
    static getInstance(reqId) {
        let _instanceId = this.instanceId;
        if (RequestsPool.checkInstance(reqId, _instanceId) === false) {
            RequestsPool.register(reqId, new this(), _instanceId);
        }
        return RequestsPool.getObject(reqId, _instanceId);
    }

    /*
     * Call error with request url in message
     *
     * @param object errorCode - error data {code, name}
     * @param string message - error message
     * @param string log_type - type of error (application or db) - where error log will be saved
     * @param boolean writeToLog - some errors must not be written to log to avoid error spaming
     *
     */
    error(errorCode, message = '', log_type = Consts.LOG_APPLICATION_TYPE, writeToLog = true) {
        BaseFunctions.processError(errorCode, message, RequestsPool.getRequestData(this.requestId), log_type, writeToLog);
    }

    /*
     * @return string - value of specific query variable
     */
    getFromRequest(name, required = true) {
        let _data = RequestsPool.getRequestData(this.requestId);
        if (_data.hasOwnProperty(name)) {
            return BaseFunctions.toString(_data[name]);
        } else if (required === false) {
            return undefined;
        } else {
            this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, '[' + name + ']');
        }
    }

    /*
     * @return object - copy of request query data {name1:value1, name2:value2}
     */
    getData() {
        let _data = RequestsPool.getRequestData(this.requestId);
        return BaseFunctions.clone(_data)
    }

    /*
     * @return string - string presentation of request object
     */
    getStringData() {
        return BaseFunctions.toString(this.getData());
    }

    /*
     * Check variables values by their set rules
     *
     * @param string rule - rule value: 'string' or {max:100}
     * @param mixed value
     *
     * @return boolean
     */
    validate(rule, value)
    {

        if (!BaseFunctions.isObject(rule) && !BaseFunctions.isString(rule)) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS,
                    'rule[' + BaseFunctions.toString(rule) + '], value[' + BaseFunctions.toString(value) + ']');
        }

        // If value defined
        if (!BaseFunctions.isUndefined(value)) {

            if (rule === 'not_empty') {
                // Value if specified must not be empty
                if ((!value) && (value !== 0) && (value !== '0')) {
                    return false;
                }
            } else if (rule === 'none') {
                // Must not be specified at all. For example: 'created' db field is set automatically
                return false;
            }


            // In other cases value should be a string
            else if (!BaseFunctions.isString(value)) {
                return false;
            } else if (BaseFunctions.isObject(rule)) {

                if (BaseFunctions.inObject('max', rule)) {
                    // Maximum symbols in value
                    if (value.length > rule.max) {
                        return false;
                    }
                } else if (BaseFunctions.inObject('min', rule)) {
                    // Minimum symbols in value
                    if (value.length < rule.min) {
                        return false;
                    }
                } else if (BaseFunctions.inObject('pattern', rule)) {
                    // Match to reqular expression
                    if (rule.pattern.test(value) === false) {
                        return false;
                    }
                }

            } else if (rule === 'word') {

                if (/[^\wа-яё]/i.test(value) === true) {
                    return false;
                }
            } else if (rule === 'hash') {

                if (/[^\w\$\/\.]/.test(value) === true) {
                    return false;
                }

            } else if (rule === 'login') {

                if (/[^\w\.@\-]/.test(value) === true) {
                    return false;
                }

            } else if (rule === 'name') {//применяется для имен

                if (/[^a-zа-яё\-]/i.test(value) === true) {
                    return false;
                }

            } else if ((rule === 'phone')) {

                if (/[^\d]/.test(value) === true) {
                    return false;
                }
            } else if (rule === 'numeric') {

                if (/(^\d+$)|(^\d+\.\d+$)/.test(value) === false) {
                    return false;
                }
            } else if (rule === 'boolean') {

                if (/(^true$)|(^false$)/.test(value) === false) {
                    return false;
                }
            } else if (rule === 'email') {

                if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) === false) {
                    return false;
                }
            } else if (rule === 'ip') {

                if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) === false) {
                    return false;
                }
            } else if (rule === 'url') {

                if (/^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*([\?\#][;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(value) === false) {
                    return false;
                }

            } else if (rule === 'varname') {
                // Variable name rule
                if (/^[a-z_]+[a-z_0-9]*/i.test(value) === false) {
                    return false;
                }

            } else if (rule === 'db_table_name') {
                // Db table name rule
                if (/[^\w\.\-\#]/.test(value) === true) {
                    return false;
                }
            } else if (rule === 'get_query_string_var_value') {
                // GET variable value rule
                if (/[^\w%\.~+=\-]/.test(value) === true) {
                    return false;
                }
            }

        } else {
            // If undefined
            if (rule === 'required') {
                // Value must be set even if it's empty
                return false;
            }
        }

        return true;
    }

//#???????????????????????????? - то, что возможно не нужно
    /*
     * Запись основных GET переменных без query string
     *
     * @param string $url - url (var1, var2, var3, var4)

     protected function set_self_url_without_query_string($url)
     {
     if (is_null(self::$self_url_without_query_string)) {
     self::$self_url_without_query_string = $url;
     }
     }
     * Получение основных GET переменных без query string
     *
     * @return string

     public static function get_self_url_without_query_string()
     {
     return self::$self_url_without_query_string;
     }




     * Редирект по указанному url
     *
     * @param string $url - путь редиректа

     public static function redirect($url)
     {
     $url = trim($url, '/');
     \header('Location: ' . MY_DOMEN . MY_DS . $url, true, 301);
     exit();
     }





     */





}

module.exports = Component;