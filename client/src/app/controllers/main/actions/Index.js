/*
 * File src/app/controllers/main/actions/Index.js
 * import MainIndex from 'src/app/controllers/main/actions/Index';
 *
 * Index action component for Main controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AbstractAction from 'src/app/controllers/AbstractAction';


// Components
import Hat from 'src/app/common/blocks/Hat';
import MainLinks from 'src/app/common/blocks/main/index/MainLinks';

//Css
import "./Css";

class MainIndex extends AbstractAction {

    constructor() {
        super();
    }


    render() {
        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    <MainLinks/>
                </React.Fragment>
                );
    }
}
export default MainIndex;
