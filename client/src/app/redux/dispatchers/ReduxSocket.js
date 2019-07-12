/*
 * File src/app/redux/dispatchers/ReduxSocket.js
 * import ReduxSocket from 'src/app/redux/dispatchers/ReduxSocket';
 */

import Socket from 'src/app/socket/Socket';
import {updateStaticText, updateDynamicText} from 'src/app/redux/actions/Actions';
import Constants from 'src/settings/Constants';

let _store;


export default {
    init(store){
        _store = store;

        Socket.getSocket().on('api', function (data) {

            if (data[Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT]) {
                _store.dispatch(updateStaticText(data[Constants.REDUX_ACTION_TYPE_UPDATE_STATIC_TEXT]));
            }

            if (data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT]) {
                _store.dispatch(updateDynamicText(data[Constants.REDUX_ACTION_TYPE_UPDATE_DYNAMIC_TEXT]));
            }




        });


    }

};