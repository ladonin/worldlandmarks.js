/*
 * File src/app/controllers/articles/actions/Article.js
 * import ArticlesArticle from 'src/app/controllers/articles/actions/Article';
 *
 * Article page action component for Articles controller
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

class ArticlesArticle extends Action {

    constructor() {
        super();
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        BaseFunctions.scrollTop(window);
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        let _categoriesList = [];
        for (let _index in this.props.redux.actionData.categoriesData) {
            let _category = this.props.redux.actionData.categoriesData[_index];
            _categoriesList.push(
                    <a onClick={this.goTo}
                       data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_CATEGORY + '/' + _category.code + '/1'}>{_category.title}</a>);
        }

        let _randomArticlesList = [];
        for (let _index in this.props.redux.actionData.randomArticles) {
            let _article = this.props.redux.actionData.randomArticles[_index];
            _randomArticlesList.push(
                    <div className="article_sublist_item">
                        <a onClick={this.goTo}
                           data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + _article.id}>
                            {_article.title}
                        </a>
                    </div>);
        }
        return (
                <CssTransition>
                    <div className="catalog_placemark">
                        <h3 className="catalog_placemark_title">
                            {this.props.redux.actionData.data.title}
                        </h3>
                        {this.props.redux.staticData.is_admin &&
                            <div style={{margin: '10px 20px', textAlign: 'left'}}><a target="_blank" style={{color: '#f00'}} href={'/admin/update_article?id=' + this.props.redux.actionData.data.id}>[обновить]</a></div>
                        }
                        <div className={(isMobile ? 'padding_left_10' : 'padding_left_20') + ' padding_top_10'}>
                            <img
                                className="adress_country_flag"
                                src={BaseFunctions.getFlagUrl(this.props.redux.actionData.countryCode)}/>
                            <a
                                onClick={this.goTo}
                                data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRY + '/' + this.props.redux.actionData.countryCode + '/1'}>{this.props.redux.actionData.countryName}</a>
                            <div className="h_10px"></div>
                            {_categoriesList}
                        </div>
                        <div className="catalog_placemark_comment" dangerouslySetInnerHTML={{__html: this.props.redux.actionData.data.content}}></div>
                        <div className="sublist_articles">
                            <div className="sublist_articles_title">
                                {this.props.redux.staticData.another_articles_title}
                            </div>
                            <div className="article_sublist_items">
                                {_randomArticlesList}
                            </div>
                        </div>
                    </div>
                    <Bottom/>
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_ARTICLES, Consts.ACTION_NAME_ARTICLE)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(ArticlesArticle))