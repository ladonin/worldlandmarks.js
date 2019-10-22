/*
 * File src/app/socket/Socket.js
 * import Socket from 'src/app/socket/Socket';
 */

import SocketIO from 'socket.io-client';

import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import Config from 'src/settings/Config';
import Router from 'src/modules/Router';
import Language from 'src/modules/Language';
import Service from 'src/modules/Service';
import {isMobile} from "react-device-detect";
import Events from 'src/modules/Events';
import AlertsText from 'src/modules/AlertsText';

const Socket = SocketIO(Config.apiServer.socketUrl, {
    query: {
        token: BaseFunctions.uniqueString()
    }
});

Socket.on('error-catch', function (data)
{

    Events.dispatch('alert', {
        text:AlertsText.get(data.message, 'error'),
        className:'error'
    });
});

export default {

    /*
     * Send socket query on action level
     * Controller and action parameters are got from url
     *
     * @param {object} matchParams - react rooter match parameters
     * @param {object} data - additional data
     */
    actionQuery(matchParams, data = {})
    {
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
    },


    /*
     * Send socket query on background level
     * Controller and action parameters are set independently of url
     *
     * @param {object} controller
     * @param {object} action
     * @param {object} data - additional data
     */
    backgroundQuery(controller, action, data = {})
    {
        data = {
            controller: controller,
            action: action,
            service: Service.getName(),
            language: Language.getName(),
            isMobile: isMobile ? true : false,
            ...data
        }

        console.log('>>>>>>> Sending background socket request');
        console.log(data);

        Socket.emit('api', data);
    },


    getSocket()
    {
        return Socket;
    }
}