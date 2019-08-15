/*
 * File src/app/redux/actions/Actions.js
 * import * as ActionCreators from 'src/app/redux/actions/Actions';
 */
import Constants from 'src/settings/Constants';

//export function updateStaticText(data) {
//  return {
//    type: Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT,
//    data
//  }
//}
//
//
//export function updateDynamicText(data) {
//  return {
//    type: Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT,
//    data
//  }
//}

export function updatePage(data) {
  return {
    type: Constants.UPDATE_PAGE,
    data
  }
}



