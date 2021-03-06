/*
 * File src/app/controllers/catalog/actions/SitemapCountries.js
 * import SitemapCountries from 'src/app/controllers/catalog/actions/SitemapCountries';
 *
 * Sitemap Countries action component for Catalog controller
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

class SitemapCountries extends Common
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

        let _countriesList = [];
        for (let _index in this.props.redux.actionData.countriesData) {
            let _country = this.props.redux.actionData.countriesData[_index];
            _countriesList.push(
                    <div className="sitemap_country_row" style={isMobile?{width:(BaseFunctions.getWidth(window)/3)-10 + 'px'} : {}}>
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_COUNTRY + '/' + _country['code'] + '/1'}>{_country['name']}</a>
                    </div>);
        }

        return (
                <React.Fragment>
                    {this.getHeader()}
                    <CssTransition>
                        <div className="sitemap_block">
                            <div className="sitemap_header">
                                {this.props.redux.staticData.articles_countries_header}
                            </div>

                            <div className="sitemap_country_block">
                                {_countriesList}
                                <div className="clear"></div>
                            </div>
                            <div className="sitemap_header">
                                <h3>
                                    {this.props.redux.staticData.select_a_country_text}
                                    <div className="h_10px"></div>
                                </h3>
                            </div>
                            <div className="padding_left_10 sitemapChangeType">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_CATEGORIES}>
                                    <i>{this.props.redux.staticData.catalog_sitemap_categories_header}</i>
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
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_SITEMAP_COUNTRIES)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(SitemapCountries))