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
        super();this.scroll2 = this.scroll2.bind(this);
    }
    scroll2(){
       this.showCategoryViewer(3);
        //Socket.backgroundQuery(Consts.CONTROLLER_NAME_CATALOG, 'get_placemarks_list', this.props.match.params, {[Consts.ID_VAR_NAME]:921})
    }
    render() {
        if (!this.props.redux) {
            return null;
        }
        return (
                <CssTransition><div onClick={this.scroll2}>scroll</div>
                    <MainLinks/>
                    <PlacemarksList controller={Consts.CONTROLLER_NAME_CATALOG} action="get_placemarks_list"/>
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_MAIN, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(MainIndex))
