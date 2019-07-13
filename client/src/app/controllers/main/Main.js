/*
 * File src/app/controllers/main/Main.js
 * import MainIndex from 'src/app/controllers/main/Main';
 *
 * Main controller
 */

import React, { Component } from 'react';


import AbstractController from 'src/app/abstract/AbstractController';
import Consts from 'src/settings/Constants';
import Controller from 'src/modules/controller/Controller';

// Components
import MainIndex from 'src/app/controllers/main/actions/Index';

//Css
import "./Css";

class Main extends AbstractController {

    constructor() {
        super();
    }


    render() {
        let _actionComponent;
        switch (Controller.getActionName()){
            case Consts.ACTION_NAME_INDEX: _actionComponent = <MainIndex/>;

            default: _actionComponent = <MainIndex/>;
        }
        return _actionComponent;
    }
}
export default Main;
