/*
 * File src/app/controllers/map/actions/Index.js
 * import MapIndex from 'src/app/controllers/map/actions/Index';
 *
 * Index action component for Map controller
 */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Consts from 'src/settings/Constants';
import MapModule from 'src/modules/Map';
import BaseFunctions from 'src/functions/BaseFunctions';
import MapPlacemark from 'src/app/common/blocks/map/Placemark';

class MapIndex extends Action {

    constructor() {
        super();
    }

    componentDidMount() {
        super.componentDidMount();
        MapModule.init([0, 0], this.props.match.params);
    }

    render() {

        return (
                <React.Fragment>
                    <MapPlacemark/>
                    <div className="map" id="YMapsID"></div>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_MAP, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(MapIndex))