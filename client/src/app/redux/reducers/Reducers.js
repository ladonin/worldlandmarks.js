/*
 * File src/app/redux/reducers/Reducers.js
 * import * as reducers from 'src/app/redux/reducers/Reducers';
 */

import { combineReducers } from 'redux';
import Constants from 'src/settings/Constants';


function staticData(state = {}, action) {
    switch (action.type) {
        case Constants.UPDATE_PAGE:
            return Object.assign({}, state, action.data[Constants.STATIC_DATA]);
        default:
            return state;
    }
}

function dynamicData(state = {}, action) {
    switch (action.type) {
        case Constants.UPDATE_PAGE:
            return Object.assign({}, state, action.data[Constants.DYNAMIC_DATA]);

        case Constants.REMOVE_DYNAMIC_DATA:
            return {};

        default:
            return state;
    }
}

const rootReducer = combineReducers({
    staticData,
    dynamicData
})

export default rootReducer