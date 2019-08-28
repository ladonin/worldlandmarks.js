import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import {Store} from 'src/app/redux/Init';

import App from './app/App';

// Other components
import Hat from 'src/app/common/blocks/Hat';
import CategoryViewer from 'src/app/common/blocks/CategoryViewer';

render(
        <BrowserRouter>
            <Provider store={Store}>
                <CategoryViewer/>
                <Hat/>
                <App/>
            </Provider>
        </BrowserRouter>
        , document.getElementById('container'));

