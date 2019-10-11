/*
 * File src/app/common/blocks/Hat.js
 * import Hat from 'src/app/common/blocks/Hat';
 *
 * Hat block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import ToolsPanel from 'src/app/common/blocks/ToolsPanel';

class Hat extends Block {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux.domainName || this.props.redux.controller === Consts.CONTROLLER_NAME_MAP) {
            return null;
        }

        return (
            <div className="hat">
                <div className="hat_logo">
                    <div className="hat_logo_img">
                        <a onClick={this.goTo} data-url='/'>
                            <img src="/img/logo.png"/>
                        </a>
                    </div>
                    {isBrowser&&
                        <React.Fragment>
                            <div className="hat_logo_text_main">
                                <a onClick={this.goTo} data-url='/'>{this.props.redux.domainName}</a>
                            </div>
                            <div className="hat_logo_text_under">{this.props.redux.logoUnderText}</div>
                        </React.Fragment>
                    }
                </div>
                <div className="hat_menu">
                    <ToolsPanel/>
                </div>
                <div className="clear"></div>
            </div>
        );
    }
}

function mapStateToProps(state) {

    return {
        redux: {
            controller:state.staticData['controller'],
            domainName:state.staticData['domain_name'],
            logoUnderText:state.staticData['hat_logo_under_text']
        }
    }
}

export default connect(mapStateToProps)(withRouter(Hat))