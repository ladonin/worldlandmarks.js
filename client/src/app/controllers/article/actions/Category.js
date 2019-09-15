/*
 * File src/app/controllers/article/actions/Category.js
 * import ArticleCategory from 'src/app/controllers/article/actions/Category';
 *
 * Category action component for Article controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import BaseFunctions from 'src/functions/BaseFunctions';

// Components
import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class ArticleCategory extends Action {

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
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_CATEGORY + '/' + _category['id'] + '/1'}>{_category['name']}</a>
                    </div>);
        }

        let _pagesList = [];
        for (let _i = 1; _i <= this.props.redux.actionData.pagesCount; _i++) {

            if (_i === parseInt(this.props.redux.actionData.currentPage)) {
                _pagesList.push(<a className='sitemap_current_page'>{_i}</a>);
            } else {
                _pagesList.push(<a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_CATEGORY + '/' + this.props.redux.actionData.categoryCode + '/' + _i}>{_i}</a>);
            }
        }


        let _articlesList = [];

        for (let _index in this.props.redux.actionData.articlesData) {
            let _article = this.props.redux.actionData.articlesData[_index];
            _articlesList.push(
            <div className="sitemap_placemark_row">
                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + _article.id}>{_article.title}</a>
            </div>);
        }















        return (
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
                                    <img className="adress_category_flag" src={BaseFunctions.getFlagUrl(this.props.redux.actionData.categoryCode)}/> {this.props.redux.actionData.categoryName}
                                </h3>
                            </div>
                            <div className="sitemap_pages_block">
                                {_pagesList}
                            </div>
                            {_articlesList}
                            <div className="clear"></div>
                            <div className="h_15px"></div>
                            <div className="padding_left_10">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_CATEGORIES}>
                                    <i>{this.props.redux.staticData.articles_categories_header}</i>
                                </a>
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        TODO MOBILE ArticleCategory
                    </MobileView>
                    <Bottom/>
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLE, Consts.ACTION_NAME_CATEGORY)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticleCategory))