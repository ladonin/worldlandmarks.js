import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import { Provider } from 'react-redux';
import {Store} from 'src/app/redux/Init';

import App from './app/App';

// Other components
import CategoryViewer from 'src/app/common/blocks/CategoryViewer';

// Block components
import Breadcrumbs from 'src/app/common/blocks/Breadcrumbs';
import Hat from 'src/app/common/blocks/Hat';

render(
        <BrowserRouter>
            <Provider store={Store}>
                <CategoryViewer/>
                <Hat/>
                <Breadcrumbs/>
                <App/>
            </Provider>
        </BrowserRouter>
        , document.getElementById('container'));

