/*
 * File src/app/redux/dispatchers/ReduxSocket.js
 * import ReduxSocket from 'src/app/redux/dispatchers/ReduxSocket';
 */

import Socket from 'src/app/socket/Socket';
import {updatePage} from 'src/app/redux/actions/Actions';
import Constants from 'src/settings/Constants';

let _store;

export default
{
    init(store)
    {
        _store = store;
        Socket.getSocket().on('api', function (data) {
            _store.dispatch(updatePage(data));
        });
    }
};