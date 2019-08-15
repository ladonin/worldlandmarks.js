/*
 * File src/app/controllers/catalog/actions/index/Index.js
 * import MainIndex from 'src/app/controllers/catalog/actions/index/Index';
 *
 * Index action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';


import AbstractAction, {MapStateToProps} from 'src/app/abstract/AbstractAction';
// Components
import CountriesList from 'src/app/common/blocks/catalog/index/CountriesList';
import ArticlesList from 'src/app/common/blocks/ArticlesList';


class CatalogIndex extends AbstractAction {

    constructor() {
        super();
    }

    render() {

        return (
            <React.Fragment>
                <BrowserView>
                    <div className="catalog_index_block">
                        <CountriesList/>
                        <div className="clear"></div>
                        <div className="catalog_block_last_articles_title" style={{position:'relative'}}>
                            <img style={{display: 'inline-block',width: '40px'}} src="/img/article_icon.png"/>
                            <span style={{display: 'block', position: 'absolute',top: '20px',left: '60px', color:'#333'}}>{this.props.last_articles}</span>
                        </div>
                        <div style={{'background-color':'#fff', margin:'0 10px'}}>
                            <ArticlesList/>
                        </div>
                    </div>
                    <div className="clear"></div>
                </BrowserView>
                <MobileView>
                  TODO MOBILE CatalogIndex
                </MobileView>
            </React.Fragment>
        );
    }
}


export default connect(MapStateToProps)(CatalogIndex)
