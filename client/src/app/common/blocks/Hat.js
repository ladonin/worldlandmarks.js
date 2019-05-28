import React, { Component } from 'react';
import Localization from 'src/modules/localization/Localization';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Consts from 'src/settings/Constants';







class Hat extends Component {

    render() {
        let vals = {};
        if (isMobile) {
            return this.mobileRender(vals);
        } else {
            return this.desctopRender(vals);
        }
    }

    mobileRender(vals) {
        return ('');
    }

    desctopRender(vals) {
        return (
                <div id="hat">
                    <div className="hat_logo">
                        <div className="hat_logo_img">
                            <a href={Consts.DOMAIN}>
                                <img src="/img/logo.png"/>
                            </a>
                        </div>
                        <div className="hat_logo_text_main">
                            <a href={Consts.DOMAIN}>{Localization.getText('common/domain_name')}</a>
                        </div>
                        <div className="hat_logo_text_under">{Localization.getText('hat/logo/under_text')}</div>
                    </div>
                    <div className="hat_menu">
                        <div id="open_panel">
                            <div className="icon">
                                <img src="/img/icons_desctop.png"/></div>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
                );
    }
}

export default Hat;