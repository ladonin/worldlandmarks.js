/*
 * File src/app/redux/index.js
 * import {store} from 'src/app/redux';
 */


import configureStore from 'src/app/redux/ConfigureStore';
import ReduxSocket from 'src/app/socket/ReduxSocket';


export const store = configureStore();


ReduxSocket.init(store);





