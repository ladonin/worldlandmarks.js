/*
 * File src/app/controllers/main/actions/index/Index.js
 * import MainIndex from 'src/app/controllers/main/actions/index/Index';
 *
 * Index action component for Main controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Link } from 'react-router-dom';
import AbstractAction, {MapStateToProps} from 'src/app/abstract/AbstractAction';

// Components

import MainLinks from 'src/app/common/blocks/main/index/MainLinks';


class MainIndex extends AbstractAction {

    constructor() {
        super();
    }

    render() {
        return (<MainLinks/>);
    }
}

export default connect(MapStateToProps)(MainIndex)
