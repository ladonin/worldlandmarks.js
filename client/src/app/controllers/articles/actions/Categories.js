/*
 * File src/app/controllers/articles/actions/Categories.js
 * import ArticleCategories from 'src/app/controllers/articles/actions/Categories';
 *
 * Categories action component for Articles controller
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

class ArticleCategories extends Common {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        let _categoriesList = [];
        for (let _index in this.props.redux.actionData.categoriesData) {
            let _category = this.props.redux.actionData.categoriesData[_index];
            _categoriesList.push(
                    <div className="sitemap_category_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_CATEGORY + '/' + _category['code'] + '/1'}>{_category['title']}</a>
                    </div>);
        }

        return (
                <React.Fragment>
                    <CssTransition>
                        <BrowserView>
                            <div className="sitemap_block">
                                <div className="sitemap_header">
                                    {this.props.redux.staticData.articles_categories_header}
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
                                <div className="padding_left_10">
                                    <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRIES}>
                                        <i>{this.props.redux.staticData.articles_countries_header}</i>
                                    </a>
                                </div>
                            </div>
                        </BrowserView>
                        <MobileView>
                            TODO MOBILE ArticleCategories
                        </MobileView>
                    </CssTransition>
                    <Bottom key={this.shouldBottomUpdate}/>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLES, Consts.ACTION_NAME_CATEGORIES)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticleCategories))