/*
 * File src/modules/Router.js
 * import Router from 'src/modules/Router';
 *
 * Works with server requests and react rooter match parameters
 */


import Consts from 'src/settings/Constants';
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
            || (Consts.CONTROLLER_NAME_ARTICLES === name)
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
        return data;
    }

    if (matchParams[Consts.CONTROLLER_VAR_NAME] === Consts.CONTROLLER_NAME_CATALOG) {

        if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_SEARCH) {
            // Search page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_SEARCH;
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_SITEMAP_COUNTRIES) {
            // Sitemap page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_SITEMAP_COUNTRIES;
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_SITEMAP_COUNTRY) {
            // Sitemap page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_SITEMAP_COUNTRY;
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            data[Consts.PAGE_NUMBER_VAR_NAME] = matchParams[Consts.URL_VAR_4_NAME];
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_SITEMAP_CATEGORIES) {
            // Sitemap page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_SITEMAP_CATEGORIES;
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_SITEMAP_CATEGORY) {
            // Sitemap page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_SITEMAP_CATEGORY;
            data[Consts.CATEGORY_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            data[Consts.PAGE_NUMBER_VAR_NAME] = matchParams[Consts.URL_VAR_4_NAME];
            return data;
        } else if (matchParams[Consts.URL_VAR_4_NAME]) {
            // Placemark page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_PLACEMARK;
            data[Consts.ID_VAR_NAME] = matchParams[Consts.URL_VAR_4_NAME];
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
            data[Consts.STATE_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            return data;
        } else if (parseInt(matchParams[Consts.URL_VAR_3_NAME]) > 0) {
            // Placemark page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_PLACEMARK;
            data[Consts.ID_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
            return data;
        } else if (matchParams[Consts.URL_VAR_3_NAME]) {
            // State page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_STATE;
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
            data[Consts.STATE_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME]) {
            // Country page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_COUNTRY;
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
            return data;
        } else {
            // Countries list page
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_INDEX;
            return data;
        }
    }
    else if (matchParams[Consts.CONTROLLER_VAR_NAME] === Consts.CONTROLLER_NAME_ARTICLES) {

        if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_CATEGORIES) {
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_CATEGORIES;
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_COUNTRY
                && matchParams[Consts.URL_VAR_3_NAME]
                && matchParams[Consts.URL_VAR_4_NAME]) {
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_COUNTRY;
            data[Consts.COUNTRY_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            data[Consts.PAGE_NUMBER_VAR_NAME] = matchParams[Consts.URL_VAR_4_NAME];
            return data;
        } else if (matchParams[Consts.URL_VAR_2_NAME] === Consts.ACTION_NAME_CATEGORY
                && matchParams[Consts.URL_VAR_3_NAME]
                && matchParams[Consts.URL_VAR_4_NAME]) {
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_CATEGORY;
            data[Consts.CATEGORY_VAR_NAME] = matchParams[Consts.URL_VAR_3_NAME];
            data[Consts.PAGE_NUMBER_VAR_NAME] = matchParams[Consts.URL_VAR_4_NAME];
            return data;
        } else if (parseInt(matchParams[Consts.URL_VAR_2_NAME])) {
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_ARTICLE;
            data[Consts.ID_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];
            return data;
        } else {
            data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_COUNTRIES;
            return data;
        }
    } else if (matchParams[Consts.CONTROLLER_VAR_NAME] === Consts.CONTROLLER_NAME_MAP) {
        data[Consts.ACTION_VAR_NAME] = Consts.ACTION_NAME_INDEX;
        if (matchParams[Consts.URL_VAR_2_NAME]) data[Consts.ID_VAR_NAME] = matchParams[Consts.URL_VAR_2_NAME];

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



