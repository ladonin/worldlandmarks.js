/*
 * File src/modules/router/Router.js
 * import Router from 'src/modules/router/Router';
 *
 * Works with server requests
 */



import Consts from 'src/settings/Constants';
import ErrorHandler from 'src/modules/error_handler/ErrorHandler';
import ErrorCodes from 'src/settings/ErrorCodes';


/*
 * Controller name
 * By default refers to main page
 *
 * @type {string}
 */
var controllerName = Consts.CONTROLLER_NAME_MAIN;




/*
 * Controller's action name
 *
 * @type {string}
 */
var actionName;



/*
 * React router url data (not a copy!)
 *
 * @type {object}
 */
var routerUrlData = {};



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


/*
 * Prepare request data - add action name and additional parameters
 *  For example:
 *  url 'catalog/germany': controller = 'country', action = 'country', country = 'germany'
 *  url 'catalog/germany/bayern': controller = 'country', action = 'state', country = 'germany', state = 'bayern'
 *
 * @param {object} data - request data
 *
 * @return {object} - prepared request data
 */
function getActionData(data = {}) {

    if (routerUrlData[Consts.CONTROLLER_VAR_NAME] === Consts.CONTROLLER_NAME_CATALOG) {

        if ((routerUrlData[Consts.URL_VAR_2_NAME] !== Consts.ACTION_NAME_INDEX)
                && (routerUrlData[Consts.URL_VAR_2_NAME] !== Consts.ACTION_NAME_SEARCH)) {

            if (routerUrlData[Consts.URL_VAR_4_NAME]) {
                // Placemark page

                return data;
            } else if (routerUrlData[Consts.URL_VAR_3_NAME]) {
                // State page

                return data;
            } else if (routerUrlData[Consts.URL_VAR_2_NAME]) {
                // Country page
                data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_COUNTRY;
                data[Consts.CATALOG_COUNTRY_VAR_NAME] = routerUrlData[Consts.URL_VAR_2_NAME];
                //console.log('>>>>>>>>>is Country page');
                return data;
            }
        }

        // Countries list page
        data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_INDEX;
        //console.log('>>>>>>>>>is Countries list page');
        return data;
    }

    return data;
}


/*
 * Set controller name
 *
 * @param string name - controller name
 */
function setControllerName(name) {

    if (!name) {
        name = Consts.CONTROLLER_NAME_MAIN;
    }

    if (checkConrtollerName(name)) {
        controllerName = name;
    }
}


export default {

    /*
     * Set router data
     *
     * @param {object} data - react router url data
     */
    set(data){//console.log('>>>>>>>>>ROUTER set:::');console.log(data);
        //Set react router url data
        routerUrlData = data;

        setControllerName(data.controller);
    },

    /*
     * See function description above
     */
    getActionData(data) {
        return getActionData(data);

    },


    /*
     * Get controller name
     *
     * @return string
     */
    getControllerName: () => controllerName,

    /*
     * Get controller's action name
     *
     * @return string
     */
    getActionName() {//console.log('>>>>>>>>getActionName-----------> ' + getActionData()[Consts.ACTION_VAR_NAME]);
        return getActionData()[Consts.ACTION_VAR_NAME];
    },

    /*
     * Define are we on map page now?
     *
     * @return boolean
     */
    isMapPage: () => (controllerName === Consts.CONTROLLER_NAME_MAP)
}



