/*
 * File server/src/core/Language.js
 * const Language = require('server/src/core/Language');
 *
 * Responsible for language of rendered text in views
 */

const Consts = require('server/src/settings/Constants');
const Core = require('server/src/core/parents/Core');
const Service = require('server/src/core/Service');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Config = require('server/src/settings/Config');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const SocketsPool = require('server/src/core/SocketsPool');
const RequestsPool = require('server/src/core/RequestsPool');


class Language extends Core
{

    constructor()
    {
        super();
        /*
         * Default language
         *
         * @type string
         */
        this.default_language = Consts.LANGUAGE_EN;
        /*
         * Application language
         *
         * @type string. Initially = boolean(false)
         */
        this.language = false;
        /*
         * Basic dictionary
         *
         * @type object. Initially = boolean(false)
         */
        this.base_words = false;
        /*
         * Service dictionary
         *
         * @type object. Initially = boolean(false)
         */
        this.service_words = false;
    }


    getBaseWord(adress)
    {
        if (this.base_words === false) {
            this.base_words = Config.text[this.getLanguage()];
        }
        return this.base_words[adress];
    }


    getServiceWord(adress)
    {
        if (this.service_words === false) {
            this.service_words = Service.getInstance(this.requestId).get_words(this.getLanguage());
        }
        return this.service_words[adress];
    }


    /*
     * Get the text from the glossary translated into the specified language
     *
     * @param {string} id - identifier
     * @param {object} vars - additional variables on which part of the text can be replaced
     *
     * @return {string} - found prepared text
     */
    getText(adress, vars = null)
    {

        let _text = BaseFunctions.isSet(this.getBaseWord(adress)) ? this.getBaseWord(adress) : this.getServiceWord(adress);
        if (BaseFunctions.isUndefined(_text)) {
            this.error(
                    ErrorCodes.ERROR_LANGUAGE_WORD_NOT_FOUND,
                    'language[' + this.getLanguage() + '], word[' + adress + ']');
        }

        // If also need to prepare some vars in it
        if (BaseFunctions.isObject(vars)) {

            for (let _key in vars) {
                let _value = vars[_key];
                let _regexp = new RegExp('%' + _key + '%', 'g');
                _text = _text.replace(_regexp, _value);
            }

        }
        return _text;
    }


    /*
     *
     * Check language according with available languages
     *
     * @param {string} language
     *
     * @return bool
     */
    checkLanguage(language)
    {
        let _availableLanguages = Service.getInstance(this.requestId).getLanguagesCodes();
        if (BaseFunctions.isUndefined(language) || !BaseFunctions.inArray(language, _availableLanguages)) {
            return false;
        }
        return true;
    }


    /*
     * Get language
     *
     * @return {string}
     */
    getLanguage()
    {
        // If set
        if (this.language !== false) {
            return this.language;
        }

        //Else:

        // Try to get value from request
        this.language = this.getFromRequest(Consts.LANGUAGE_CODE_VAR_NAME, false);
        if (this.checkLanguage(this.language)) {
            return this.language;
        }

        // Try to get it from request headers
        //this.language = this.getClientLanguage();
        //if (this.language) {
        //    return this.language;
        //}

        // Set default
        this.language = this.default_language;
        return this.language;
    }


    /*
     * Get client language via browser's header
     *
     * @return {string}/null
     */
    getClientLanguage()
    {
        let _token = RequestsPool.getSocketToken(this.requestId);
        let _clientLanguage = SocketsPool.getSocketHeaderProp(_token, 'accept-language');
        if (_clientLanguage) {

            let _availableLanguages = Service.getInstance(this.requestId).getLanguagesCodes();
            _clientLanguage = _clientLanguage.replace(/^(\w+)-.*/, '$1');
            if (BaseFunctions.inArray(_clientLanguage, _availableLanguages)) {
               return _clientLanguage;
            }
        }
        return null;
    }
}

Language.instanceId = BaseFunctions.uniqueId();
module.exports = Language;