/*
 * File src/app/controllers/main/actions/Index.js
 * import MainIndex from 'src/app/controllers/main/actions/Index';
 *
 * Index action component for Main controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {MapStateToProps} from 'src/app/parents/Action';

// Components

import MainLinks from 'src/app/common/blocks/main/index/MainLinks';




class MainIndex extends Action {

    constructor() {
        super();
        this.scroll = this.scroll.bind(this);
    }


    render() {
        return (
                <div>
                    <MainLinks/>
                    <div onClick={this.scroll}>scroll</div>
                </div>
                );
    }
}

export default connect(MapStateToProps)(withRouter(MainIndex))
