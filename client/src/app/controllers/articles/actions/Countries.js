/*
 * File src/app/controllers/articles/actions/Countries.js
 * import ArticleCountries from 'src/app/controllers/articles/actions/Countries';
 *
 * Countries action component for Articles controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Common from 'src/app/controllers/articles/actions/_Common';

// Components
import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class ArticleCountries extends Common {

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
                                    {this.props.redux.staticData.select_a_country_text}
                                    <div className="h_10px"></div>
                                </h3>
                            </div>
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
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLES, Consts.ACTION_NAME_COUNTRIES)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticleCountries))