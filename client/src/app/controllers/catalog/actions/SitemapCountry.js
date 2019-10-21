/*
 * File src/app/controllers/catalog/actions/SitemapCountry.js
 * import SitemapCountry from 'src/app/controllers/catalog/actions/SitemapCountry';
 *
 * Sitemap Country action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import BaseFunctions from 'src/functions/BaseFunctions';
import Common from 'src/app/controllers/articles/actions/_Common';

// Components
import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';


class SitemapCountry extends Common {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        let _countriesList = [];
        for (let _index in this.props.redux.actionData.countriesData) {
            let _country = this.props.redux.actionData.countriesData[_index];
            _countriesList.push(
                    <div className="sitemap_country_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_COUNTRY + '/' + _country['code'] + '/1'}>{_country['name']}</a>
                    </div>);
        }

        let _pagesList = [];
        for (let _i = 1; _i <= this.props.redux.actionData.pagesCount; _i++) {

            if (_i === parseInt(this.props.redux.actionData.currentPage)) {
                _pagesList.push(<a className='sitemap_current_page'>{_i}</a>);
            } else {
                _pagesList.push(<a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_COUNTRY + '/' + this.props.redux.actionData.countryCode + '/' + _i}>{_i}</a>);
            }
        }


        let _placemarksList = [];
        for (let _index in this.props.redux.actionData.placemarksData) {
            let _placemark = this.props.redux.actionData.placemarksData[_index];

            let _urlPart =  _placemark.state_code === 'undefined' ? '/' : ('/' + _placemark.state_code + '/');

            _placemarksList.push(
            <div className="sitemap_placemark_row" style={isMobile?{width:(BaseFunctions.getWidth(window)/3)-10 + 'px'} : {}}>
                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + _placemark.country_code + _urlPart + _placemark.id}>{_placemark.title}</a>
            </div>);
        }

        return (
<React.Fragment>
                    {this.getHeader()}
                    <CssTransition>
                        <div className="sitemap_block">
                            <div className="sitemap_header">
                                {this.props.redux.staticData.catalog_sitemap_countries_header}
                            </div>

                            <div className="sitemap_country_block">
                                {_countriesList}
                                <div className="clear"></div>
                            </div>
                            <div className="sitemap_header">
                                <h3>
                                    <img className="adress_country_flag" src={BaseFunctions.getFlagUrl(this.props.redux.actionData.countryCode)}/> {this.props.redux.actionData.countryName}
                                </h3>
                            </div>
                            <div className="sitemap_pages_block">
                                {_pagesList}
                            </div>
                            {_placemarksList}
                            <div className="clear"></div>
                            <div className="h_15px"></div>
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

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_SITEMAP_COUNTRY)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(SitemapCountry))