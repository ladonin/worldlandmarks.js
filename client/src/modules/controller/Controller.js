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
            || (Consts.CONTROLLER_NAME_ARTICLE === name))
    {
        return true;
    }
    ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_WRONG_CONTROLLER_NAME, '[' + name + ']');
    return false;
}

/*
 *
 * setControllerName: set controller name
 *
 * @param string name - controller name
 * @return void
 *
 *
 * getControllerName: get controller name
 *
 * @return string
 *
 *
 * setActionName: set controller's action name
 *
 * @param string name - action name
 * @return void
 *
 *
 * getActionName: get controller's action name
 *
 * @return string
 *
 *
 * isMapPage: are we on map page now?
 *
 * @return boolean
 *
 *
 *
 */
export default {
    setControllerName:(name) => {
        if (checkConrtollerName(name)) {
            controllerName = name;
        }
    },
    getControllerName:() => controllerName,


    setActionName:(name) => {
        actionName = name;
    },
    getActionName:() => actionName,


    isMapPage:()=> (controllerName === Consts.CONTROLLER_NAME_MAP)
}



