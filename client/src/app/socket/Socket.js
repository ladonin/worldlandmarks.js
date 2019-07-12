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

const Socket = socket(Config.apiServer.socketUrl, {
    query: {
        token: BaseFunctions.uniqueString()////ATTENTION - обратите внимание
    }
});


Socket.on('error-catch', function (data) {
    console.log('on error-catch');
    console.log(data.context);////ATTENTION - обратите внимание
});


export default {
    query(data) {
        data = {...data,
            controller: Controller.getControllerName(),
            action: Controller.getActionName(),
            service: Service.getName(),
            language: Language.getName()
        }

        Socket.emit('api', data);

    },
    getSocket(){
        return Socket;
    }

}





