/*
 * File src/app/App.js
 * import App from 'src/app/App';
 *
 * Main application component
 */

import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

// Settings
import Consts from 'src/settings/Constants';

// Controllers
import Main from './controllers/main/Main';
import Map from './controllers/map/Map';
import Catalog from './controllers/catalog/Catalog';
import Articles from './controllers/articles/Articles';


class App extends Component
{
    render()
    {
        return (
                <Switch>
                    <Route path={'/:controller(' + Consts.CONTROLLER_NAME_MAP + ')/:var2?'} component={Map}/>
                    <Route path={'/:controller(' + Consts.CONTROLLER_NAME_CATALOG + ')/:var2?/:var3?/:var4?'} component={Catalog}/>
                    <Route path={'/:controller(' + Consts.CONTROLLER_NAME_ARTICLES + ')/:var2?/:var3?/:var4?'} component={Articles}/>
                    <Route component={Main}/>
                </Switch>
                );
    }
}

export default App