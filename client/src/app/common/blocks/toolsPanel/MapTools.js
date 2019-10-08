/*
 * File src/app/common/blocks/toolsPanel/MapTools.js
 * import Menu from 'src/app/common/blocks/toolsPanel/MapTools';
 *
 * MapTools menu block component for map controller
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Language from 'src/modules/Language';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';

import HtmllerButtons from 'src/modules/HtmllerButtons';

class MapTools extends Block {

    constructor() {
        super();










        return (



)
        ;
    }
}



function mapStateToProps(state) {

    return {
        redux: {
            staticData:state.staticData
        }
    }
}

export default connect(mapStateToProps)(withRouter(MapTools))







