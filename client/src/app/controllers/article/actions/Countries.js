/*
 * File src/app/controllers/article/actions/Countries.js
 * import ArticleCountries from 'src/app/controllers/article/actions/Countries';
 *
 * Countries action component for Article controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';

// Components
import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class ArticleCountries extends Action {

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
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_COUNTRY + '/' + _country['country_code'] + '/1'}>{_country['name']}</a>
                    </div>);
        }

        return (
                <CssTransition>
                    <BrowserView>
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
                            <div className="padding_left_10">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_CATEGORIES}>
                                    <i>{this.props.redux.staticData.articles_categories_header}</i>
                                </a>
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        TODO MOBILE ArticleCountries
                    </MobileView>
                    <Bottom/>
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLE, Consts.ACTION_NAME_COUNTRIES)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticleCountries))