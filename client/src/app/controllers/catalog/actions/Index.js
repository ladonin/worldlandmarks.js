/*
 * File src/app/controllers/catalog/actions/Index.js
 * import CatalogIndex from 'src/app/controllers/catalog/actions/Index';
 *
 * Index action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
// Components
import CountriesList from 'src/app/common/blocks/catalog/index/CountriesList';
import ArticlesList from 'src/app/common/blocks/ArticlesList';
import CssTransition from 'src/app/common/CssTransition';


class CatalogIndex extends Action {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }
        return (
            <CssTransition>
                <BrowserView>
                    <div className="catalog_index_block">
                        <CountriesList/>
                        <div className="clear"></div>
                        <div className="catalog_block_last_articles_title" style={{position:'relative'}}>
                            <img style={{display: 'inline-block',width: '40px'}} src="/img/article_icon.png"/>
                            <span style={{display: 'block', position: 'absolute',top: '20px',left: '60px', color:'#333'}}>{this.props.redux.staticData.last_articles}</span>
                        </div>
                        <div style={{'backgroundColor':'#fff', margin:'0 10px'}}>
                            <ArticlesList/>
                        </div>
                    </div>
                    <div className="clear"></div>
                </BrowserView>
                <MobileView>
                  TODO MOBILE CatalogIndex
                </MobileView>
            </CssTransition>
        );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_INDEX)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(CatalogIndex))