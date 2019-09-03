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
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Consts from 'src/settings/Constants';

// Components
import MainLinks from 'src/app/common/blocks/main/index/MainLinks';
import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
import CssTransition from 'src/app/common/CssTransition';

class MainIndex extends Action {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }
        return (
                <CssTransition>
                    <MainLinks/>
                    <PlacemarksList/>
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_MAIN, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(MainIndex))