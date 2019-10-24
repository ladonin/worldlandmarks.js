/*
 * File src/settings/Config.js
 * import Config from 'src/settings/Config';
 */

import LandmarksConfig from 'src/../../server/common/services/landmarks/settings/Config';
import LandmarksLanguageEn from 'src/../../server/common/services/landmarks/language/En';
import LandmarksLanguageRu from 'src/../../server/common/services/landmarks/language/Ru';

import Service from 'src/modules/Service';
import Consts from 'src/settings/Constants';

let _config = {
    [Consts.SERVICE_LANDMARKS]: LandmarksConfig
};

let _languages = {
   [Consts.SERVICE_LANDMARKS]: {
       [Consts.LANGUAGE_RU]:LandmarksLanguageRu,
       [Consts.LANGUAGE_EN]:LandmarksLanguageEn
   }
};

export default {
    apiServer: {
        socketUrl: 'http://77.222.60.47:3001'
    },
    getServiceConfig:()=>_config[Service.getName()],
    getText:(val)=> _languages[Service.getName()][val]
}