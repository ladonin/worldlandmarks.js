/*
 * File src/app/controllers/map/Map.js
 * import Map from 'src/app/controllers/map/Map';
 *
 * Map controller
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/Router';

// Action components
import MapIndex from 'src/app/controllers/map/actions/Index';

class Map extends Controller {

    constructor() {
        super();
    }

    render() {
        return <MapIndex/>;
    }
}

export default connect()(withRouter(Map))
