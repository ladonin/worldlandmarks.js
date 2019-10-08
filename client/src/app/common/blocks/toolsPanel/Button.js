/*
 * File src/app/common/blocks/toolsPanel/Button.js
 * import ToolsPanelButton from 'src/app/common/blocks/toolsPanel/Button';
 *
 * Button to turn on tools panel
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';

import HtmllerButtons from 'src/modules/HtmllerButtons';

class ToolsPanelButton extends Block {

    constructor() {
        super();

        this.localVarsStyles = {
            height: BaseFunctions.getHeight('#open_panel'),
            top: (BaseFunctions.getHeight(window) - BaseFunctions.getHeight('#open_panel')) / 2
        };
    }

    render() {

        return (
                <div id="open_panel" style={{height: this.localVarsStyles.height + 'px', top: this.localVarsStyles.top + 'px'}}><HtmllerButtons/></div>
                );
    }
}



export default ToolsPanelButton







