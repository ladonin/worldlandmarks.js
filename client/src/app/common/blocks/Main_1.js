import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Localization from 'src/modules/localization/Localization';
import Consts from 'src/settings/Constants';

class HomeMain extends Component {
    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
    }

    goTo(event) {
        this.props.history.push(event.target.dataset.url);
    }

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
                <div className="main_block">
                    <div className="main_block_map_block">
                        <img src={Consts.DOMAIN + '/img/map_240.png'} onClick={this.goTo} data-url="map"/>
                        <div className="main_block_map_block_title">
                            <a href={Consts.DOMAIN + '/map'}>map</a>
                        </div>
                    </div>
                    <div className="main_block_catalog_block">
                        <img src="http://world-landmarks.ru/img/catalog_240.png" onClick={this.goTo} data-url="catalog"/>
                        <div className="main_block_catalog_block_title">
                            <a href="http://world-landmarks.ru/catalog">catalog</a>
                        </div>
                    </div>
                    <div className="main_block_search_block">
                        <img src={Consts.DOMAIN + '/img/search_240.png'} onClick={this.goTo} data-url="catalog/search"/>
                        <div className="main_block_search_block_title">
                            <a href={Consts.DOMAIN + '/catalog/search'}>search</a>
                        </div>
                    </div>
                    <div className="clear"></div>
                </div>
                );
    }
}

export default withRouter(HomeMain);