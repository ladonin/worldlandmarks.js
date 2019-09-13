/*
 * File server/src/components/base/Validator.js
 * const Validator = require('server/src/components/base/Validator');
 *
 * Validator component
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');

module.exports = {

    /*
     * Check variables values by their set rules
     *
     * @param {string} rule - rule value: 'string' or {max:100}
     * @param mixed value
     *
     * @return {boolean}
     */
    validate(rule, value)
    {
        if (!BaseFunctions.isObject(rule) && !BaseFunctions.isString(rule, this)) {
            BaseFunctions.processError(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'rule[' + BaseFunctions.toString(rule) + '], value[' + BaseFunctions.toString(value) + ']');
        }

        // If value defined
        if (!BaseFunctions.isUndefined(value)) {

            if (rule === 'not_empty') {
                // Value if specified must be not empty
                if ((!value) && (value !== 0) && (value !== '0')) {
                    return false;
                }
            } else if (rule === 'none') {
                // Must be not specified at all. For example: 'created' db field is set automatically
                return false;
            } else if (BaseFunctions.isObject(rule)) {

                if (BaseFunctions.inObject('in', rule)) {
                    // Value must be in list
                    if (value && !BaseFunctions.inArray(value, rule.list)) {
                        return false;
                    }
                } else if (BaseFunctions.inObject('max', rule)) {
                    // Maximum symbols in value
                    if (!BaseFunctions.isString(value, this) || (value && value.length > rule.max)) {
                        return false;
                    }
                } else if (BaseFunctions.inObject('min', rule)) {
                    // Minimum symbols in value
                    if (!BaseFunctions.isString(value, this) || (value && value.length < rule.min)) {
                        return false;
                    }
                } else if (BaseFunctions.inObject('pattern', rule)) {
                    // Match to reqular expression
                    if (!BaseFunctions.isString(value, this) || (value && rule.pattern.test(value) === false)) {
                        return false;
                    }
                }

            } else if (rule === 'word') {

                if (!BaseFunctions.isString(value, this) || (value && /[^\wа-яё]/i.test(value) === true)) {
                    return false;
                }
            } else if (rule === 'hash') {

                if (!BaseFunctions.isString(value, this) || (value && /[^\w\$\/\.]/.test(value) === true)) {
                    return false;
                }

            } else if (rule === 'login') {

                if (!BaseFunctions.isString(value, this) || (value && /[^\w\.@\-]/.test(value) === true)) {
                    return false;
                }

            } else if (rule === 'name') {//применяется для имен

                if (!BaseFunctions.isString(value, this) || (value && /[^a-zа-яё\-]/i.test(value) === true)) {
                    return false;
                }

            } else if ((rule === 'phone')) {

                if (!BaseFunctions.isString(value, this) || (value && /[^\d]/.test(value) === true)) {
                    return false;
                }
            } else if (rule === 'numeric') {

                if (!BaseFunctions.isInteger(value) && (!BaseFunctions.isString(value, this) || (value && /(^\d+$)|(^\d+\.\d+$)/.test(value) === false))) {
                    return false;
                }
            } else if (rule === 'boolean') {

                if (!BaseFunctions.isString(value, this) || (value && /(^true$)|(^false$)/.test(value) === false)) {
                    return false;
                }
            } else if (rule === 'email') {

                if (!BaseFunctions.isString(value, this) || (value && /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value) === false)) {
                    return false;
                }
            } else if (rule === 'ip') {

                if (!BaseFunctions.isString(value, this) || (value && /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(value) === false)) {
                    return false;
                }
            } else if (rule === 'url') {

                if (!BaseFunctions.isString(value, this) || (value && /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*([\?\#][;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i.test(value) === false)) {
                    return false;
                }

            } else if (rule === 'varname') {
                // Variable name rule
                if (!BaseFunctions.isString(value, this) || (value && /^[a-z_]+[a-z_0-9]*/i.test(value) === false)) {
                    return false;
                }

            } else if (rule === 'db_table_name') {
                // Db table name rule
                if (!BaseFunctions.isString(value, this) || (value && /[^\w\.\-\#]/.test(value) === true)) {
                    return false;
                }
            } else if (rule === 'get_query_string_var_value') {
                // GET variable value rule
                if (!BaseFunctions.isString(value, this) || (value && /[^\w%\.~+=\-]/.test(value) === true)) {
                    return false;
                }
            }
        }

        if (rule === 'required') {
            // Value must be set always and have non empty vales including 0 and '0'
            if (BaseFunctions.isUndefined(value) || ((!value) && (value !== 0) && (value !== '0'))) {
                return false;
            }
        }

        return true;
    }
};