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
import MapBaloon from 'src/app/common/blocks/map/Baloon';


class MapIndex extends Action {

    constructor() {
        super();
    }

    componentDidMount() {
        super.componentDidMount();
        MapModule.init(this.props.match.params, this.props.redux.staticData['is_available_to_change']);
    }

    render() {

        return (
                <React.Fragment>
                    <MapPlacemark/>
                    <MapBaloon/>
                    <div className="map" id="YMapsID"></div>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_MAP, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(MapIndex))