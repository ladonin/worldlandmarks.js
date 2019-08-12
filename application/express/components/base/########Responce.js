/*
 * File application/express/components/base/Responce.js
 * const Responce = require('application/express/components/base/Responce');
 *
 * Responce component
 */


const ErrorCodes = require('application/express/settings/ErrorCodes');
const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');






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


Responce.instanceId = BaseFunctions.unique_id();
module.exports = Responce;