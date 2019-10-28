import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import {isMobile} from "react-device-detect";

import { Provider } from 'react-redux';
import {Store} from 'src/app/redux/Init';
import ReactHelmet from 'react-helmet';

import App from './app/App';

// Other components
import CategoryViewer from 'src/app/common/blocks/CategoryViewer';

// Block components
import Breadcrumbs from 'src/app/common/blocks/Breadcrumbs';
import Hat from 'src/app/common/blocks/Hat';
import Alert from 'src/app/common/Alert';
import PageScrolling from 'src/app/common/blocks/PageScrolling';

// Css
import {link} from "./app/common/HeaderRefs";


render(
        <BrowserRouter>
            <Provider store={Store}>
                <ReactHelmet link={link}/>
                <Alert/>
                <CategoryViewer/>
                <Hat/>
                <Breadcrumbs/>
                <App/>
                <PageScrolling/>
            </Provider>
        </BrowserRouter>,
        document.getElementById('container')
);

