/*
 * File src/modules/controller/Controller.js
 * import Controller from 'src/modules/controller/Controller';
 *
 * Works with controller's data
 */



import Consts from 'src/settings/Constants';
import ErrorHandler from 'src/modules/error_handler/ErrorHandler';
import ErrorCodes from 'src/settings/ErrorCodes';


/*
 * Controller name
 * By default refers to main page
 *
 * @Type string
 */
var controllerName = Consts.CONTROLLER_NAME_MAIN;




/*
 * Controller's action name
 * By default equals to index
 *
 * @Type string
 */
var actionName = Consts.ACTION_NAME_INDEX;







/*
 * Chech if name for controller is correct
 *
 * @param string name - controller name
 * @return boolean or throw error (in dev mode)
 */
function checkConrtollerName(name) {
    if ((Consts.CONTROLLER_NAME_MAP === name)
            || (Consts.CONTROLLER_NAME_MAIN === name)
            || (Consts.CONTROLLER_NAME_CATALOG === name)
            || (Consts.CONTROLLER_NAME_ARTICLE === name)
            || (Consts.CONTROLLER_NAME_ERRORS === name))
    {
        return true;
    }
    ///////////////this.error(ErrorCodes.ERROR_WRONG_CONTROLLER_NAME, '[' + name + ']'); //ATTENTION - обратите внимание
    return false;
}


export default {

    /*
     * Set controller name
     *
     * @param string name - controller name
     */
    setControllerName: (name) => {

        if (!name) {
            name = Consts.CONTROLLER_NAME_MAIN;
        }

        if (checkConrtollerName(name)) {
            controllerName = name;
        }
    },

    /*
     * Get controller name
     *
     * @return string
     */
    getControllerName: () => controllerName,

    /*
     * Set controller's action name
     *
     * @param string name - action name
     */
    setActionName: (name) => {
        if (!name) {
            name = Consts.ACTION_NAME_INDEX;
        }
        actionName = name;
    },

    /*
     * Get controller's action name
     *
     * @return string
     */
    getActionName: () => actionName,

    /*
     * Define are we on map page now?
     *
     * @return boolean
     */
    isMapPage: () => (controllerName === Consts.CONTROLLER_NAME_MAP)
}



