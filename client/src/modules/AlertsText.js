/*
 * File src/modules/AlertsText.js
 * import AlertsText from 'src/modules/AlertsText';
 *
 * Alerts Text module
 */

import En from 'src/../../server/common/settings/language/alertsText/En';
import Ru from 'src/../../server/common/settings/language/alertsText/Ru';
import Language from 'src/modules/Language';
import Constants from 'src/settings/Constants';

Language.getName()

export default {
        get(name, type){
            if (Language.getName() === Constants.LANGUAGE_RU) {
                return Ru[type][name];
            } else {
                return En[type][name];
            }
        }
}