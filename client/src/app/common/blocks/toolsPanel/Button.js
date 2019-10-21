/*
 * File src/app/common/blocks/toolsPanel/Button.js
 * import ToolsPanelButton from 'src/app/common/blocks/toolsPanel/Button';
 *
 * Button to turn on tools panel
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { withRouter } from 'react-router-dom';

import Router from 'src/modules/Router';
import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';

import HtmllerButtons from 'src/modules/HtmllerButtons';

class ToolsPanelButton extends Block {

    render() {
        let _style = {
            top: this.props.top ? this.props.top : 0
        }

        return (<div id="open_panel" style={{top: _style.top + 'px'}}><HtmllerButtons device={(!Router.isMapPage(this.props.match.params) && isMobile) ? Consts.DEVICE_NAME_DESCTOP : undefined}/></div>);
    }
}

export default withRouter(ToolsPanelButton)