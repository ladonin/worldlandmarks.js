import localizedStrings from 'react-localization';
import {locales, commonLocales} from 'src/settings/localization/Localization';


import ErrorHandler from 'src/modules/error_handler/ErrorHandler';
import Messages from 'src/settings/Messages';
import ErrorCodes from 'src/settings/ErrorCodes';

let locale = new localizedStrings(locales);
let common_locale = new localizedStrings(commonLocales);

export default {
    getText: (name) => {
        if (locale.hasOwnProperty(name)) {
            return locale[name];
        } else {
            // Then maybe this text is enabled in common localization
            if (common_locale.hasOwnProperty(name)) {
                return common_locale[name];
            } else {
                // Text not found anywhere
                ErrorHandler.process(ErrorCodes.ERROR_LOCALIZATION_WORD_NOT_FOUND, name);
            }
        }
    },
    changeLang: (lang) => {
        locale.setLanguage(lang)
    }
};
