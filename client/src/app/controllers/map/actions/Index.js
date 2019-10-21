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
import ToolsPanel from 'src/app/common/blocks/ToolsPanel';
import Header from 'src/app/common/blocks/map/Header';

class MapIndex extends Action {

    constructor() {
        super();
        this.lastUrl = false;
        this.getHeader = this.getHeader.bind(this);
    }

    componentDidMount() {
        super.componentDidMount();
        this.lastUrl = this.props.match.url;
        MapModule.run(this.props.match.params, 'init');
    }

    shouldComponentUpdate(nextProps, nextState){
        if (this.lastUrl !== nextProps.match.url) {
            return true;
        }
        return false;
    }

    componentDidUpdate(){
        this.lastUrl = this.props.match.url
        MapModule.checkLinkOnId(this.props.match.params);
    }

    render() {
        return (
                <React.Fragment>
                    <Header getHeader={this.getHeader}/>
                    <MapPlacemark/>
                    <MapBaloon/>
                    <div className="map" id="YMapsID"></div>
                    <ToolsPanel isMap={true}/>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_MAP, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(MapIndex))