/*
 * File src/app/common/blocks/map/Baloon.js
 * import MapBaloon from 'src/app/common/blocks/map/Baloon';
 *
 * Baloon block component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import MapModule from 'src/modules/Map';
import Consts from 'src/settings/Constants';

import Block from 'src/app/parents/Block';

import {RemoveBackgroundData} from 'src/app/parents/Common';

class MapBaloon extends Block {
    constructor() {
        super();
    }

    componentWillUnmount(){
        this.props.removeBackgroundData('placemarksData');
    }

    render() {
        if (this.props.redux.data) {
            MapModule.prepareLoadedPlacemarks(this.props.redux.data);
        }

        return null;
    }
}

function mapStateToProps(state) {

    return {
        redux: {
            data: state.backgroundData['placemarksData'],
            staticData: state.staticData
        }
    };
}

export default connect(mapStateToProps, {removeBackgroundData: RemoveBackgroundData})(withRouter(MapBaloon))