/*
 * File src/app/controllers/main/Main.js
 * import MainIndex from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/router/Router';

// Action components
import CatalogIndex from 'src/app/controllers/catalog/actions/Index';
import CatalogCountry from 'src/app/controllers/catalog/actions/Country';

import { withRouter } from 'react-router-dom';

class Catalog extends Controller {

    constructor() {
        super();
    }

    render() {


        let _actionComponent;
        switch (this.getActionName()) {
            case Consts.ACTION_NAME_INDEX:
                _actionComponent = <CatalogIndex/>; break;
            case Consts.ACTION_NAME_COUNTRY:
                _actionComponent = <CatalogCountry/>; break;
            default:
                _actionComponent = <CatalogIndex/>;
        }

        return (
                <div id='action'>
                    {_actionComponent}
                </div>
        );
    }
}

export default withRouter(Catalog)