import localizedStrings from 'react-localization';
import {locales, commonLocales} from 'src/settings/localization/Localization';


import ErrorHandler from 'src/modules/errorhandler/ErrorHandler';
import Messages from 'src/settings/Messages';


let locale = new localizedStrings(locales);
let commonLocale = new localizedStrings(commonLocales);

export default {
    getText: (name) => {
        if (locale.hasOwnProperty(name)) {
            return locale[name];
        } else {
            // Then maybe this text is enabled in common localization
            if (commonLocale.hasOwnProperty(name)) {
                return commonLocale[name];
            } else {
                // Text not found anywhere
                ErrorHandler.process(Messages.ERROR_LOCALIZATION_WORD_NOT_FOUND + ': ' + name);
            }
        }
    },
    changeLang: (lang) => {
        locale.setLanguage(lang)
    }
};
