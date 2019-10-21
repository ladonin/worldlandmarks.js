/*
 * File src/app/controllers/main/Main.js
 * import Main from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/Router';

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

        return <React.Fragment>
            {_actionComponent}
        </React.Fragment>;
    }
}

export default connect()(withRouter(Main))