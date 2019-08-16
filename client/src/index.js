import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import {Store} from 'src/app/redux/Init';

import App from './app/App';
// Other components
import Hat from 'src/app/common/blocks/Hat';
render(
        <BrowserRouter>
            <Provider store={Store}>
                <Hat/>
                <App/>
            </Provider>
        </BrowserRouter>
        , document.getElementById('root'));

