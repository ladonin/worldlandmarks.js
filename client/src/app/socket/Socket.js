/*
 * File src/app/socket/Socket.js
 * import Socket from 'src/app/socket/Socket';
 */


import socket from 'socket.io-client';
import BaseFunctions from 'src/functions/BaseFunctions';
import Config from 'src/settings/Config';
import Controller from 'src/modules/controller/Controller';
import Language from 'src/modules/Language';
import Service from 'src/modules/Service';
import {isMobile} from "react-device-detect";


const Socket = socket(Config.apiServer.socketUrl, {
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
    query(data) {
        data = {...data,
            controller: Controller.getControllerName(),
            action: Controller.getActionName(),
            service: Service.getName(),
            language: Language.getName(),
            isMobile: isMobile ? true : false
        }

        Socket.emit('api', data);

    },
    getSocket(){
        return Socket;
    }

}





