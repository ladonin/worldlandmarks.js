/*
 * File src/app/common/blocks/map/Header.js
 * import Header from 'src/app/common/blocks/map/Header';
 *
 * Header block component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import MapModule from 'src/modules/Map';
import Consts from 'src/settings/Constants';
import {GetState} from 'src/app/parents/Action';

import Block from 'src/app/parents/Block';

class Header extends Block {
    constructor() {
        super();
    }
    render() {
        if (!this.props.redux) {
            return null;
        }

        let _data = null;
        if (this.props.redux.title) {
            _data = {title:this.props.redux.title};
        }

        return <React.Fragment>
            {this.props.getHeader(_data)}
        </React.Fragment>;
    }
}

function MapStateToProps(state) {
    return {
        redux:{
            actionData:state.actionData,
            title:(state.backgroundData && state.backgroundData.map_placemarkData) ? state.backgroundData.map_placemarkData.title : null
        }
    }
}

export default connect(MapStateToProps)(Header)