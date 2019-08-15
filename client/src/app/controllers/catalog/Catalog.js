/*
 * File src/app/controllers/main/Main.js
 * import MainIndex from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';

import AbstractController from 'src/app/abstract/AbstractController';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/router/Router';

// Action components
import CatalogIndex from 'src/app/controllers/catalog/actions/index/Index';
import CatalogCountry from 'src/app/controllers/catalog/actions/country/Country';

// Other components
import Hat from 'src/app/common/blocks/Hat';


class Catalog extends AbstractController {

    constructor() {
        super();
    }

    render() {


        let _actionComponent;
        switch (Router.getActionName()) {
            case Consts.ACTION_NAME_INDEX:
                _actionComponent = <CatalogIndex/>;
            case Consts.ACTION_NAME_COUNTRY:
                _actionComponent = <CatalogCountry/>;


            default:
                _actionComponent = <CatalogIndex/>;
        }

        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    <div id='action'>
                        {_actionComponent}
                    </div>
                </React.Fragment>
                );
    }
}

export default Catalog