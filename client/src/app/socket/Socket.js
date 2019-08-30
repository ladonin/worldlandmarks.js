/*
 * File src/app/socket/Socket.js
 * import Socket from 'src/app/socket/Socket';
 */


import SocketIO from 'socket.io-client';

// Settings
import Consts from 'src/settings/Constants';

import BaseFunctions from 'src/functions/BaseFunctions';
import Config from 'src/settings/Config';
import Router from 'src/modules/Router';
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


    /*
     * Send socket query on action level
     * Controller and action parameters are got from url
     *
     * @param {object} matchParams - react rooter match parameters
     * @param {object} data - additional data
     */
    actionQuery(matchParams, data = {}) {
        data = {
            [Consts.REQUEST_FORM_DATA]:{},
            controller: Router.getControllerName(matchParams),
            service: Service.getName(),
            language: Language.getName(),
            isMobile: isMobile ? true : false,
            ...data,
        }

        // Prepare request data (see method description)
        data = Router.getActionData(data, matchParams);
        console.log('>>>>>>> Sending action socket request');
        console.log(data);

        // Here client and server controller/action are the same
        // Thanks to it there will be able to figure out for what request the response belongs to
        data.clientController = data.controller;
        data.clientAction = data.action;

        Socket.emit('api', data);
        //    for (let i=0; i<1000; i++){
        //     Socket.emit('api', data);
        //    }
        //ATTENTION - обратите внимание
    },
    /*
     * Send socket query on background level
     * Controller and action parameters are set independently of url
     *
     * @param {object} controller
     * @param {object} action
     * @param {object} matchParams - react rooter match parameters
     * @param {object} data - additional data
     */
    backgroundQuery(controller, action, matchParams, data = {}) {
        data = {
            controller: controller,
            action: action,
            service: Service.getName(),
            language: Language.getName(),
            isMobile: isMobile ? true : false,
            ...data
        }

        // Here client and server controller/action are the same
        // Thanks to it there will be able to figure out for what request the response belongs to
        data.clientController = Router.getControllerName(matchParams);
        data.clientAction = Router.getActionName(matchParams);

        console.log('>>>>>>> Sending background socket request');
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





