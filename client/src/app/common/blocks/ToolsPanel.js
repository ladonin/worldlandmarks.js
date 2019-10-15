/*
 * File src/app/common/blocks/ToolsPanel.js
 * import ToolsPanel from 'src/app/common/blocks/ToolsPanel';
 *
 * ToolsPanel block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import MapModule from 'src/modules/Map';
import Events from 'src/modules/Events';

import ToolsPanelButton from 'src/app/common/blocks/toolsPanel/Button';
import Menu from 'src/app/common/blocks/toolsPanel/Menu';
import Settings from 'src/app/common/blocks/toolsPanel/Settings';
import MapFilter from 'src/app/common/blocks/toolsPanel/MapFilter';

class ToolsPanel extends Block {

    constructor() {
        super();
        this.show = this.show.bind(this);
        this.close = this.close.bind(this);
        this.hide = this.hide.bind(this);
        this.showButton = this.showButton.bind(this);
        this.setStatus = this.setStatus.bind(this);

        MapModule.setPanelToolsComponentRef(this);

        this.state = {status: null};
        this.localVarsStyles = {};
        if (isMobile) {
            this.localVarsStyles.panelToolsWidth = BaseFunctions.getWidth(window);
            this.localVarsStyles.closePanelWidth = 70;
        } else {
            this.localVarsStyles.panelToolsWidth = 310;
            this.localVarsStyles.closePanelWidth = 70;
        }
        this.localVarsStyles.panelToolsHeight = BaseFunctions.getHeight(window);
        this.localVarsStyles.closePanelHeight = BaseFunctions.getHeight(window);
        this.localVarsStyles.panelToolsContentRight = this.localVarsStyles.closePanelWidth;
        this.localVarsStyles.panelToolsContentWidth = this.localVarsStyles.panelToolsWidth - this.localVarsStyles.closePanelWidth;
        this.localVarsStyles.panelToolsContentLinksWidth = this.localVarsStyles.panelToolsContentWidth - 10;
    }

    componentDidMount() {
        Events.add(Consts.EVENT_SHOW_TOOLS_PANEL_BUTTON, this.showButton);
        Events.add(Consts.EVENT_TOOLS_PANEL_SET_STATUS, this.setStatus);
    }

    componentWillUnmount() {
        Events.remove(Consts.EVENT_SHOW_TOOLS_PANEL_BUTTON, this.showButton);
        Events.add(Consts.EVENT_TOOLS_PANEL_SET_STATUS, this.setStatus);
    }

    setStatus(e) {
        this.setState({status: e.detail.value});
    }

    show() {
        this.setState({status: 0});
    }
    close() {
        this.setState({status: null});
    }
    hide() {
        // Close panel and hide button
        this.setState({status: false});
    }
    showButton() {
        this.setState({status: null});
    }
    render() {

        let ContentComponent = ()=>null;
        if (this.state.status === 0) {
             ContentComponent = ()=> <Menu width = {this.localVarsStyles.panelToolsContentLinksWidth} toolsPanelRef={this}/>;
        } else if (this.state.status === 1) {
             ContentComponent = ()=> <Settings toolsPanelRef={this}/>;
        } else if (this.state.status === 2) {
             ContentComponent = ()=> <MapFilter toolsPanelRef={this}/>;
        } else if (this.state.status === 3) {
            // ContentComponent = ()=> <Part3/>;
        }

        return (
                <React.Fragment>
                    {this.state.status !== false && <div onClick={this.show}><ToolsPanelButton
                        top = {this.props.isMap ? ((BaseFunctions.getHeight(window) - 70) / 2) : 0}/></div>}
                    {(this.state.status !== null && this.state.status !== false) &&
                        <React.Fragment>
                            <div id="panel_tools" style={{width: this.localVarsStyles.panelToolsWidth + 'px', height: this.localVarsStyles.panelToolsHeight + 'px'}}>
                                <div id="close_panel" onClick={this.close} style={{width:this.localVarsStyles.closePanelWidth + 'px', height: this.localVarsStyles.closePanelHeight + 'px'}}></div>
                                <div id="panel_tools_content" style={{right: this.localVarsStyles.panelToolsContentRight + 'px', width: this.localVarsStyles.panelToolsContentWidth + 'px'}}>
                                    <ContentComponent/>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                </React.Fragment>
                );
    }
}



function mapStateToProps(state) {

    return {
        redux: {
            domainName: state.staticData['domain_name'],
            logoUnderText: state.staticData['hat_logo_under_text']
        }
    }
}

export default connect(mapStateToProps)(withRouter(ToolsPanel))







