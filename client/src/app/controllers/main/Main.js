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
import MainIndex from 'src/app/controllers/main/actions/index/Index';


import Hat from 'src/app/common/blocks/Hat';


class Main extends AbstractController {

    constructor() {
        super();
    }


    render() {
        let _actionComponent;
        switch (Router.getActionName()){
            case Consts.ACTION_NAME_INDEX: _actionComponent = <MainIndex/>;

            default: _actionComponent = <MainIndex/>;
        }

        return (
            <React.Fragment>
                <Hat/>
                <div className="padding_after_hat"></div>
                <div id='action' className='static_page'>
                    {_actionComponent}
                </div>
            </React.Fragment>
        );
    }
}

export default Main
