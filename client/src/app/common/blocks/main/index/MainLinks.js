/*
 * File src/app/common/blocks/main/index/MainLinks.js
 * import MainLinks from 'src/app/common/blocks/main/index/MainLinks';
 *
 * MainLinks block component
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Consts from 'src/settings/Constants';

import Block from 'src/app/parents/Block';


class MainLinks extends Block {
    constructor() {
        super();
    }

    render() {
        return (
                <React.Fragment>
                    <BrowserView>
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
                    </BrowserView>
                    <MobileView>
                    </MobileView>
                </React.Fragment>
                );
    }
}

export default withRouter(MainLinks);