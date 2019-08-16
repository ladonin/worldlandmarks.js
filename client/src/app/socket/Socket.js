/*
 * File src/app/socket/Socket.js
 * import Socket from 'src/app/socket/Socket';
 */


import SocketIO from 'socket.io-client';

// Settings
import Consts from 'src/settings/Constants';

import BaseFunctions from 'src/functions/BaseFunctions';
import Config from 'src/settings/Config';
import Router from 'src/modules/router/Router';
import Language from 'src/modules/Language';
import Service from 'src/modules/Service';
import {isMobile} from "react-device-detect";


const Socket = SocketIO(Config.apiServer.socketUrl, {
    query: {
        token: BaseFunctions.uniqueString()////ATTENTION - обратите внимание
    }
});


Socket.on('error-catch', function (data) {
    console.log('on error-catch');
    console.log(data.message);////ATTENTION - обратите внимание
    //ERROR_PASSWORD_NOT_PASSED => trace('errors/update_point/empty_password')
    //ERROR_WRONG_PASSWORD => trace('errors/update_point/wrong_password')
    //ERROR_FORM_POINT_A_LOT_OF_PHOTOS
    //ERROR_FORM_POINT_WITH_NO_PHOTOS
    //ERROR_WRONG_EMAIL => trace('errors/new_point/wrong_email')

});



export default {
    query(matchParams, data = {}) {
        data = {
            [Consts.REQUEST_FORM_DATA]:{},
            ...data,
            controller: Router.getControllerName(matchParams),
            service: Service.getName(),
            language: Language.getName(),
            isMobile: isMobile ? true : false,
        }

        // Prepare request data (see method description)
        data = Router.getActionData(data, matchParams);
        console.log('>>>>>>> Sending socket request');
        console.log(data);

        Socket.emit('api', data);
        //    for (let i=0; i<1000; i++){
        //     Socket.emit('api', data);
        //    }
        //ATTENTION - обратите внимание
    },
    getSocket(){
        return Socket;
    }

}





