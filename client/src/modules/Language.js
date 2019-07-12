/*
 * File src/modules/Language.js
 * import Language from 'src/modules/Language';
 *
 * Language module - for define, change user location
 */

import Constants from 'src/settings/Constants';


let _language = false;
let _defaultLanguage = Constants.LANGUAGE_EN;
export default {

    /*
     * Set language value
     *
     * @param string
     */
    setName: (value) => {
        _language = value;
    },

    /*
     * Set language value
     *
     * @param string
     */
    getName: () => {
        if (_language === false) {
            let _userLang = navigator.language || navigator.userLanguage;
            _userLang = _userLang.replace(/^(\w+)-.*/, '$1');

            if (_userLang) {
                _language = _userLang;
            } else {
                _language = _defaultLanguage;
            }
        }
        return _language;
    }
}