/*
 * File src/app/controllers/main/Main.js
 * import MainIndex from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/router/Router';

// Action components
import MainIndex from 'src/app/controllers/main/actions/Index';


class Main extends Controller {

    constructor() {
        super();
    }


    render() {
        let _actionComponent;
        switch (this.getActionName()){
            case Consts.ACTION_NAME_INDEX: _actionComponent = <MainIndex/>; break;
            default: _actionComponent = <MainIndex/>;
        }

        return (
            <div id='action' className='static_page'>
                {_actionComponent}
            </div>
        );
    }
}

export default withRouter(Main)
