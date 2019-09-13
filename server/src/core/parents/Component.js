/*
 * File server/src/core/parents/Component.js
 * const Component = require('server/src/core/parents/Component');
 *
 * Base component
 * Available validation rules see in 'server/src/core/parents/Model.js'
 */
const BaseFunctions = require('server/src/functions/BaseFunctions');
const RequestsPool = require('server/src/core/RequestsPool');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Messages = require('server/src/settings/Messages');
const Config = require('server/src/settings/Config');
const Core = require('server/src/core/parents/Core');
const Language = require('server/src/core/Language');
const Service = require('server/src/core/Service');
const Cache = require('server/src/components/base/Cache');

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