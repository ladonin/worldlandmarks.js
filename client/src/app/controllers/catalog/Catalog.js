/*
 * File src/app/controllers/main/Main.js
 * import MainIndex from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';


import AbstractController from 'src/app/controllers/AbstractController';
import Consts from 'src/settings/Constants';
import Controller from 'src/modules/controller/Controller';

// Components
import CatalogIndex from 'src/app/controllers/catalog/actions/Index';
import Hat from 'src/app/common/blocks/Hat';

//Css
import "./Css";


class Catalog extends AbstractController {

    constructor() {
        super();
    }

    render() {
        let _actionComponent;
        switch (Controller.getActionName()) {
            case Consts.ACTION_NAME_INDEX:
                _actionComponent = <CatalogIndex/>;

            default:
                _actionComponent = <CatalogIndex/>;
        }

        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    {_actionComponent}
                </React.Fragment>
                );
    }
}
export default Catalog;
