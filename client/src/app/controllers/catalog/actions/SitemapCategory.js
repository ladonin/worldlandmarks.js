/*
 * File src/app/controllers/catalog/actions/SitemapCategory.js
 * import SitemapCategory from 'src/app/controllers/catalog/actions/SitemapCategory';
 *
 * Sitemap Category action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import BaseFunctions from 'src/functions/BaseFunctions';
import CategoryViewerModule from 'src/modules/CategoryViewer';
import Common from 'src/app/controllers/articles/actions/_Common';

import CssTransition from 'src/app/common/CssTransition';
import Bottom from 'src/app/common/blocks/Bottom';

class SitemapCategory extends Common
{

    constructor()
    {
        super();
    }


    /*
     * Open category window with explanation of interested category
     *
     * @param {integer} id - category id to be showed
     */
    seeCategory(id)
    {
        return function()
        {
            this.showCategoryViewer(id)
        }.bind(this)
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

        let _pagesList = [];
        for (let _i = 1; _i <= this.props.redux.actionData.pagesCount; _i++) {

            if (_i === parseInt(this.props.redux.actionData.currentPage)) {
                _pagesList.push(<a className='sitemap_current_page' key={_i}>{_i}</a>);
            } else {
                _pagesList.push(<a onClick={this.goTo} key={_i} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_CATEGORY + '/' + this.props.redux.actionData.categoryCode + '/' + _i}>{_i}</a>);
            }
        }

        let _placemarksList = [];
        for (let _index in this.props.redux.actionData.placemarksData) {
            let _placemark = this.props.redux.actionData.placemarksData[_index];

            let _urlPart =  _placemark.state_code === 'undefined' ? '/' : ('/' + _placemark.state_code + '/');

            _placemarksList.push(
            <div key={_placemark.id} className="sitemap_placemark_row">
                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + _placemark.country_code + _urlPart + _placemark.id}>{_placemark.title}</a>
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
                                    <img className="category" style={{display:'inline-block', paddingRight:'5px'}} src={CategoryViewerModule.getCategoryImageUrl(this.props.redux.actionData.categoryId)}
                                        alt={this.props.redux.actionData.categoryTitle}
                                        title={this.props.redux.actionData.categoryTitle}
                                        onClick={this.seeCategory(this.props.redux.actionData.categoryId)}/>
                                    {this.props.redux.actionData.categoryTitle}
                                </h3>
                            </div>
                            <div className="sitemap_pages_block">
                                {_pagesList}
                            </div>
                            {_placemarksList}
                            <div className="clear"></div>
                            <div className="h_15px"></div>
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
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_SITEMAP_CATEGORY)
}

export default connect(MapStateToProps, MapDispatchToProps)(withRouter(SitemapCategory))