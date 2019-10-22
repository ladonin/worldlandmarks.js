/*
 * File src/app/common/blocks/main/index/MainLinks.js
 * import MainLinks from 'src/app/common/blocks/main/index/MainLinks';
 *
 * MainLinks block component
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import Consts from 'src/settings/Constants';
import Block from 'src/app/parents/Block';
import BaseFunctions from 'src/functions/BaseFunctions';

class MainLinks extends Block
{
    constructor()
    {
        super();
    }


    render()
    {
        let _imgBlockStyle = {};
        let _imgStyle = {}
        let _titleBlockStyle = {}


        if (isMobile) {
            let _buttonsNumber = 3;
            let _margin = 10;
            let _buttonWidth = Math.floor(((BaseFunctions.getWidth(window)-20) / _buttonsNumber) - (_margin * 2 / _buttonsNumber));
            let _imgWidth = _buttonWidth - (_margin * 4);

            _imgBlockStyle = {width:_buttonWidth + 'px', marginRight:_margin + 'px', paddingBottom:_margin + 5 + 'px'};
            _imgStyle = {height:_imgWidth + 'px', width:_imgWidth + 'px', marginTop:_margin + 'px', marginBottom:_margin + 'px'};
         }

        return (
                <React.Fragment>
                    <div className="padding_after_hat"></div>
                    <div className="main_block">
                        <div className="main_block_map_block" style={_imgBlockStyle}>
                            <img style={_imgStyle} src={Consts.DOMAIN + '/img/map_240.png'} onClick={this.goTo} data-url="map"/>
                            <div className="main_block_map_block_title">
                                <a href={Consts.DOMAIN + '/map'}>{this.props.redux.staticData.main_links_text_map}</a>
                            </div>
                        </div>
                        <div className="main_block_catalog_block" style={_imgBlockStyle}>
                            <img style={_imgStyle} src="http://world-landmarks.ru/img/catalog_240.png" onClick={this.goTo} data-url="catalog"/>
                            <div className="main_block_catalog_block_title">
                                <a href="http://world-landmarks.ru/catalog">{this.props.redux.staticData.main_links_text_catalog}</a>
                            </div>
                        </div>
                        <div className="main_block_search_block" style={{..._imgBlockStyle}}>
                            <img style={_imgStyle} src={Consts.DOMAIN + '/img/search_240.png'} onClick={this.goTo} data-url="catalog/search"/>
                            <div className="main_block_search_block_title">
                                <a href={Consts.DOMAIN + '/catalog/search'}>{this.props.redux.staticData.main_links_text_search}</a>
                            </div>
                        </div>
                        <div className="clear"></div>
                    </div>
                </React.Fragment>
                );
    }
}


function mapStateToProps(state)
{
    return {
        redux:{
            staticData: state.staticData
        }
    };
}

export default connect(mapStateToProps)(withRouter(MainLinks))