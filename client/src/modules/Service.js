/*
 * File src/modules/Service.js
 * import Service from 'src/modules/Service';
 *
 * Service module - for define, change service
 */

import Consts from 'src/settings/Constants';

let _service;

export default {
    getName()
    {
        // You can keep service name in cookies if you use one domain
        // or keep multiple frontends with direct binding service name if you use several domains
        return Consts.SERVICE_LANDMARKS; //_service
    },


    setName(name)
    {
        _service = name;
    }
}