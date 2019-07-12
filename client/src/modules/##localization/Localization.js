import localizedStrings from 'react-localization';
import {locales, commonLocales} from 'src/settings/localization/Localization';


import ErrorHandler from 'src/modules/error_handler/ErrorHandler';
import Messages from 'src/settings/Messages';
import ErrorCodes from 'src/settings/ErrorCodes';

let _locale = new localizedStrings(locales);
let _common_locale = new localizedStrings(commonLocales);

export default {
    getText: (name) => {
        if (_locale.hasOwnProperty(name)) {
            return _locale[name];
        } else {
            // Then maybe this text is enabled in common localization
            if (_common_locale.hasOwnProperty(name)) {
                return _common_locale[name];
            } else {
                // Text not found anywhere
                this.error(ErrorCodes.ERROR_LOCALIZATION_WORD_NOT_FOUND, name);
            }
        }
    },
    changeLang: (lang) => {
        _locale.setLanguage(lang)
    }
};
