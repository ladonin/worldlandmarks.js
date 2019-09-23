/*
 * File src/modules/ErrorsText.js
 * import ErrorsText from 'src/modules/ErrorsText';
 *
 * Errors Text module
 */

import En from 'src/../../server/common/settings/language/errorsText/En';
import Ru from 'src/../../server/common/settings/language/errorsText/Ru';
import Language from 'src/modules/Language';
import Constants from 'src/settings/Constants';

Language.getName()

export default {
        get(name){
            if (Language.getName() === Constants.LANGUAGE_RU) {
                return Ru[name];
            } else {
                return En[name];
            }
        }
}