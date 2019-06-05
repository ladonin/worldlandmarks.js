/*
 * Module vendor\Component
 *
 * Base module for other inheritor modules
 */


const ModulesComponent = require('application/express/components/base/Modules');

class Component {


    get_module(name){
        return ModulesComponent.get(name);
    }

}

module.exports = Component;