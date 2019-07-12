/*
 * Module application/express/components/base/Language.js
 * const Language = require('application/express/components/base/Language');
 *
 * Responsible for language of rendered text in views
 */

const Consts = require('application/express/settings/Constants');
const Component = require('application/express/vendor/Component');
const Service = require('application/express/components/base/Service');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Config = require('application/express/settings/Config');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const SocketsPool = require('application/express/vendor/SocketsPool');
const RequestsPool = require('application/express/vendor/RequestsPool');

class Language extends Component {

    constructor() {
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

    getBaseWord(adress) {
        if (this.base_words === false) {
            this.base_words = Config.text[this.get_language()];
        }
        return this.base_words[adress];
    }

    getServiceWord(adress) {
        if (this.service_words === false) {
            this.service_words = Service.getInstance(this.requestId).get_words(this.get_language());
        }
        return this.service_words[adress];
    }

    /*
     * Get text from locales array by its identifier
     *
     * @param string id - identifier
     * @param object vars - additional variables on which part of the text can be replaced
     *
     * @return string - found prepared text
     */
    get_text(adress, vars = null)
    {

        let _text = BaseFunctions.isSet(this.getBaseWord(adress)) ? this.getBaseWord(adress) : this.getServiceWord(adress);
        if (BaseFunctions.isUndefined(_text)) {
            this.error(
                    ErrorCodes.ERROR_LANGUAGE_WORD_NOT_FOUND,
                    'language[' + this.get_language() + '], word[' + adress + ']');
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
     * @param string language
     *
     * @return bool
     */
    checkLanguage(language) {

        let _availableLanguages = Service.getInstance(this.requestId).getLanguagesCodes();
        if (BaseFunctions.isUndefined(language) || !BaseFunctions.in_array(language, _availableLanguages)) {
            return false;
        }
        return true;
    }

    /*
     * Get language
     *
     * @return string
     */
    get_language() {
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
     * @return string/null
     */
    getClientLanguage()
    {

        let _token = RequestsPool.getSocketToken(this.requestId);
        let _clientLanguage = SocketsPool.getSocketHeaderProp(_token, 'accept-language');
        if (_clientLanguage) {

            let _availableLanguages = Service.getInstance(this.requestId).getLanguagesCodes();
            _clientLanguage = _clientLanguage.replace(/^(\w+)-.*/, '$1');
            if (BaseFunctions.in_array(_clientLanguage, _availableLanguages)) {
               return _clientLanguage;
            }
        }

        return null;
    }








}






Language.instanceId = BaseFunctions.unique_id();

module.exports = Language;






//is_available_language($language) #???????????????????????????? - то, что возможно не нужно


/*



 * Записать язык в сессию
 *
 * @param string $language - код языка

 public function set_language_in_session($language)
 {
 if (in_array($language, self::$available_languages)) {
 $_SESSION['site']['language'] = $language;
 } else {
 $_SESSION['site']['language'] = self::DEFAULT_LANGUAGE;
 }
 }


 * Установить язык приложения

 public static function set_language()
 {
 if (my_is_not_empty(@$_SESSION['site']['language'])) {
 if (in_array($_SESSION['site']['language'], self::$available_languages)) {
 $language = $_SESSION['site']['language'];
 } else {
 $language = self::DEFAULT_LANGUAGE;
 }
 unset($_SESSION['site']['language']);
 //обновляем куки
 self::set_cookie(MY_COOKIE_NAME_SITE_LANGUAGE, $language, MY_COOKIE_MAX_LIFETIME_VALUE);
 }

 $cookie_language = self::get_cookie(MY_COOKIE_NAME_SITE_LANGUAGE);
 //если куки нет или её значение неопознанно
 if (is_null($cookie_language) || (!in_array($cookie_language, self::$available_languages))) {
 //если первый раз зашли и сессия с куками пустые, то определяем язык из данных клинета
 $cookie_language = self::get_client_language();
 self::set_cookie(MY_COOKIE_NAME_SITE_LANGUAGE, $cookie_language, MY_COOKIE_MAX_LIFETIME_VALUE);
 }

 self::$language = $cookie_language;
 }





 }
 */