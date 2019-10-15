/*
 * File src/app/controllers/articles/actions/Country.js
 * import ArticleCountry from 'src/app/controllers/articles/actions/Country';
 *
 * Country action component for Articles controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import BaseFunctions from 'src/functions/BaseFunctions';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';
import Common from 'src/app/controllers/articles/actions/_Common';

// Components
import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class ArticleCountry extends Common {

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
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRY + '/' + _country['country_code'] + '/1'}>{_country['name']}</a>
                    </div>);
        }

        let _pagesList = [];
        for (let _i = 1; _i <= this.props.redux.actionData.pagesCount; _i++) {

            if (_i === parseInt(this.props.redux.actionData.currentPage)) {
                _pagesList.push(<a className='sitemap_current_page'>{_i}</a>);
            } else {
                _pagesList.push(<a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRY + '/' + this.props.redux.actionData.countryCode + '/' + _i}>{_i}</a>);
            }
        }


        let _articlesList = [];
        for (let _index in this.props.redux.actionData.articlesData) {
            let _article = this.props.redux.actionData.articlesData[_index];
            _articlesList.push(
            <div className="sitemap_placemark_row">
                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + _article.id}>{_article.title}</a>
            </div>);
        }

        return (
                <React.Fragment>
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
                                    <img className="adress_country_flag" src={BaseFunctions.getFlagUrl(this.props.redux.actionData.countryCode)}/> {this.props.redux.actionData.countryName}
                                </h3>
                            </div>
                            <div className="sitemap_pages_block">
                                {_pagesList}
                            </div>
                            {_articlesList}
                            <div className="clear"></div>
                            <div className="h_15px"></div>
                            <div className="padding_left_10">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_CATEGORIES}>
                                    <i>{this.props.redux.staticData.articles_categories_header}</i>
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
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLES, Consts.ACTION_NAME_COUNTRY)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticleCountry))