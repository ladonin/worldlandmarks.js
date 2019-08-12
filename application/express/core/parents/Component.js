/*
 * File application/express/core/parents/Component.js
 * const Component = require('application/express/core/parents/Component');
 *
 * Base component
 * Available validation rules see in 'application/express/core/parents/Model.js'
 */
const BaseFunctions = require('application/express/functions/BaseFunctions');
const RequestsPool = require('application/express/core/RequestsPool');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Messages = require('application/express/settings/Messages');
const Config = require('application/express/settings/Config');
const Core = require('application/express/core/parents/Core');
const Language = require('application/express/core/Language');
const Service = require('application/express/core/Service');
const Cache = require('application/express/components/base/Cache');

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

        this.cache = Cache;
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
        return Language.getInstance(this.requestId).getText(adress, vars);
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










}

module.exports = Component;