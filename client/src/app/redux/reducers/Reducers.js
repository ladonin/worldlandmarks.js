/*
 * File src/app/redux/reducers/Reducers.js
 * import * as reducers from 'src/app/redux/reducers/Reducers';
 */

import { combineReducers } from 'redux';
import Constants from 'src/settings/Constants';


function staticText(state = {}, action) {console.log('staticText');console.log(state);
    switch (action.type) {
        case Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}

function dynamicText(state = {}, action) {console.log('dynamicText');console.log(state);
    switch (action.type) {
        case Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT:
            return Object.assign({}, state, action.data);
        default:
            return state;
    }
}







const rootReducer = combineReducers({
    staticText,
    dynamicText
})

export default rootReducer