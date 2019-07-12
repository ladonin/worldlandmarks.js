/*
 * File src/app/redux/Init.js
 * import {store} from 'src/app/redux/Init';
 */
import configureStore from 'src/app/redux/ConfigureStore';
import ReduxSocket from 'src/app/redux/dispatchers/ReduxSocket';

export const Store = configureStore();

ReduxSocket.init(Store);