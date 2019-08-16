/*
 * File src/modules/router/Router.js
 * import Router from 'src/modules/router/Router';
 *
 * Works with server requests and react rooter match parameters
 */


import Consts from 'src/settings/Constants';
import ErrorHandler from 'src/modules/error_handler/ErrorHandler';
import ErrorCodes from 'src/settings/ErrorCodes';

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
 * @param {object} matchParams - react rooter match parameters
 *
 * @return {object} - prepared request data
 */
function getActionData(data = {}, matchParams) {

    if (!matchParams[Consts.CONTROLLER_VAR_NAME]) {
        // Main page
        data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_INDEX;
        console.log('>>>>>>>>>is Main page');
        return data;
    }


    if (matchParams[Consts.CONTROLLER_VAR_NAME] === Consts.CONTROLLER_NAME_CATALOG) {

        if ((matchParams[Consts.URL_VAR_2_NAME] !== Consts.ACTION_NAME_INDEX)
                && (matchParams[Consts.URL_VAR_2_NAME] !== Consts.ACTION_NAME_SEARCH)) {

            if (matchParams[Consts.URL_VAR_4_NAME]) {
                // Placemark page

                return data;
            } else if (matchParams[Consts.URL_VAR_3_NAME]) {
                // State page

                return data;
            } else if (matchParams[Consts.URL_VAR_2_NAME]) {
                // Country page
                data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_COUNTRY;
                data[Consts.CATALOG_COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
                console.log('>>>>>>>>>is Country page');
                return data;
            }
        }

        // Countries list page
        data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_INDEX;
        console.log('>>>>>>>>>is Countries list page');
        return data;
    }

    return data;
}


/*
 * Get controller name
 *
 * @return string
 */
function getControllerName(matchParams) {

    let _controllerName = matchParams[Consts.CONTROLLER_VAR_NAME];

    if (!_controllerName) {
        _controllerName = Consts.CONTROLLER_NAME_MAIN;
    }

    if (!checkConrtollerName(_controllerName)) {
        _controllerName = 'wrong name: [' + _controllerName + ']';
    }

    return _controllerName;
}


/*
 * Get controller's action name
 *
 * @return string
 */
function getActionName(matchParams) {
    return getActionData(undefined, matchParams)[Consts.ACTION_VAR_NAME];
}


/*
 * Define are we on map page now?
 *
 * @param {object} matchParams - react rooter match parameters
 *
 * @return boolean
 */
function isMapPage(matchParams) {
    return (getControllerName(matchParams) === Consts.CONTROLLER_NAME_MAP);
}



export default {
    isMapPage,
    getActionName,
    getControllerName,
    getActionData
}



