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

import Consts from 'src/settings/Constants';

class Hat extends Component {

    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
    }

    goTo(event) {
        this.props.history.push(event.target.dataset.url);
    }


    render() {
        return (
                <div id="hat">
                    <BrowserView>
                        <div className="hat_logo">
                            <div className="hat_logo_img">
                                <a onClick={this.goTo} data-url={Consts.DOMAIN}>
                                    <img src="/img/logo.png"/>
                                </a>
                            </div>
                            <div className="hat_logo_text_main">
                                <a onClick={this.goTo} data-url={Consts.DOMAIN}>{this.props.domainName}</a>
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
        );
    }
}



function mapStateToProps(state) {
    let _domainName = state.staticText['domain_name'];
    let _logoUnderText = state.staticText['hat/logo/under_text'];
    return {
        domainName:_domainName,
        logoUnderText:_logoUnderText
    }
}
let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Hat))







