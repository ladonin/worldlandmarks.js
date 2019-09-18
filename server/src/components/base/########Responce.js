/*
 * File server/src/components/base/Responce.js
 * const Responce = require('server/src/components/base/Responce');
 *
 * Responce component
 */


const ErrorCodes = require('server/src/settings/ErrorCodes');
const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');






class Responce extends Component{

    constructor(){
        super();
        this.socket;
        this.io;
    }


    init(socket, io) {
        this.socket = socket;
        this.io = io;
    }
    sendPrivate(message){


    }

}


Responce.instanceId = BaseFunctions.uniqueId();
module.exports = Responce;