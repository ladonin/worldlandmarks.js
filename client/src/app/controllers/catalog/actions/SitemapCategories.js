/*
 * File src/app/controllers/catalog/actions/SitemapCategories.js
 * import SitemapCategories from 'src/app/controllers/catalog/actions/SitemapCategories';
 *
 * Sitemap Categories action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Common from 'src/app/controllers/articles/actions/_Common';
import BaseFunctions from 'src/functions/BaseFunctions';

import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class SitemapCategories extends Common
{

    constructor()
    {
        super();
    }


    render()
    {
        if (!this.props.redux) {
            return null;
        }

        let _categoriesList = [];
        for (let _index in this.props.redux.actionData.categoriesData) {
            let _category = this.props.redux.actionData.categoriesData[_index];
            _categoriesList.push(
                    <div key={_category['id']} className="sitemap_category_row" style={isMobile?{width:(BaseFunctions.getWidth(window)/3)-10 + 'px'} : {}}>
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_CATEGORY + '/' + _category['code'] + '/1'}>{_category['title']}</a>
                    </div>);
        }

        return (
                <React.Fragment>
                    {this.getHeader()}
                    <CssTransition>
                        <div className="sitemap_block">
                            <div className="sitemap_header">
                                {this.props.redux.staticData.catalog_sitemap_categories_header}
                            </div>
                            <div className="sitemap_category_block">
                                {_categoriesList}
                                <div className="clear"></div>
                            </div>
                            <div className="sitemap_header">
                                <h3>
                                    {this.props.redux.staticData.select_a_category_text}
                                    <div className="h_10px"></div>
                                </h3>
                            </div>
                            <div className="padding_left_10 sitemapChangeType">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_COUNTRIES}>
                                    <i>{this.props.redux.staticData.catalog_sitemap_countries_header}</i>
                                </a>
                            </div>
                        </div>
                    </CssTransition>
                    <Bottom key={this.shouldBottomUpdate}/>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state)
{
    console.log(state);
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_SITEMAP_CATEGORIES)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(SitemapCategories))