/*
 * File src/app/redux/actions/Actions.js
 * import * as ActionCreators from 'src/app/redux/actions/Actions';
 */
import Constants from 'src/settings/Constants';

export function updatePage(data)
{
    return {
        type: Constants.UPDATE_PAGE,
        data
    }
}