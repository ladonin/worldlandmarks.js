/*
 * File application/express/core/Component.js
 * const Component = require('application/express/core/Component');
 *
 * Base component
 * Available validation rules see in 'application/express/core/Model.js'
 */
const BaseFunctions = require('application/express/functions/BaseFunctions');
const RequestsPool = require('application/express/core/RequestsPool');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Messages = require('application/express/settings/Messages');
const Config = require('application/express/settings/Config');
const DBase = require('application/express/core/DBase');
const Core = require('application/express/core/Core');
const Language = require('application/express/core/Language');
const Service = require('application/express/core/Service');

class Component extends Core {

    constructor() {
        super();

        /*
         * Language name of current request
         *
         * @type {string}
         */
        this.language;

        /*
         * Service name of current request
         *
         * @type {string}
         */
        this.service;
    }


    /*
     * Get language name of current request
     *
     * @returns {string}
     */
    getLanguage(){
        if (!this.language) {
            this.language = Language.getInstance(this.requestId).getLanguage();
        }
        return this.language;
    }

    /*
     * Get the text from the glossary translated into the specified language
     *
     * @param {string} id - identifier
     * @param {object} vars - additional variables on which part of the text can be replaced
     *
     * @returns {string}
     */
    getText(adress, vars){
        Language.getInstance(this.requestId).getText(adress, vars);
    }

    /*
     * Get service name of current request
     *
     * @returns {string}
     */
    getServiceName(){
        if (!this.service) {
            this.service = Service.getInstance(this.requestId).getServiceName();
        }
        return this.service;
    }


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







}

module.exports = Component;