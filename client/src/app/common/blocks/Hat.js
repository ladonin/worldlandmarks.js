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

class Hat extends Block {

    constructor() {
        super();
    }

    shouldComponentUpdate(nextProps, nextState){
        if ((nextProps.domainName != this.props.domainName)
            ||(nextProps.logoUnderText != this.props.logoUnderText)) {
            return true;
        }
        return false;
    }

    render() {
        return (
                <div id="hat">
                    <div className="hat">
                        <BrowserView>
                            <div className="hat_logo">
                                <div className="hat_logo_img">
                                    <a onClick={this.goTo} data-url='/'>
                                        <img src="/img/logo.png"/>
                                    </a>
                                </div>
                                <div className="hat_logo_text_main">
                                    <a onClick={this.goTo} data-url='/'>{this.props.domainName}</a>
                                </div>
                                <div className="hat_logo_text_under">{this.props.logoUnderText}</div>
                            </div>
                            <div className="hat_menu">
                                <div id="open_panel">
                                    <div className="icon">
                                        <img src="/img/icons_desctop.png"/></div>
                                </div>
                            </div>
                            <div className="clear"></div>
                        </BrowserView>
                        <MobileView></MobileView>
                    </div>
                    <div className="padding_after_hat"></div>
                </div>
        );
    }
}



function mapStateToProps(state) {

    return {
        domainName:state.staticData['domain_name'],
        logoUnderText:state.staticData['hat/logo/under_text']
    }
}

export default connect(mapStateToProps)(withRouter(Hat))







