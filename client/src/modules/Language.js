/*
 * File src/modules/Language.js
 * import Language from 'src/modules/Language';
 *
 * Language module - for define, change user location
 */

import Constants from 'src/settings/Constants';
import Cookies from 'src/modules/Cookies';
let _defaultLanguage = Constants.LANGUAGE_EN;

export default {

    /*
     * Set language value
     *
     * @param string
     */
    setName: (value) => {
        Cookies.setCookie(Constants.LANGUAGE_NAME, value);
    },

    /*
     * Set language value
     *
     * @param string
     */
    getName: () => {

        if (Cookies.getCookie(Constants.LANGUAGE_NAME)) {
            return Cookies.getCookie(Constants.LANGUAGE_NAME);
        }

        // Otherwise set language
        let _language;
        let _userLang = navigator.language || navigator.userLanguage;
        _userLang = _userLang.replace(/^(\w+)-.*/, '$1');

        if (_userLang) {
            _language = _userLang;
        } else {
            _language = _defaultLanguage;
        }

        Cookies.setCookie(Constants.LANGUAGE_NAME, _language);
        return _language;
    }
}