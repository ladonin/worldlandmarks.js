/*
 * File src/app/controllers/catalog/actions/Search.js
 * import CatalogSearch from 'src/app/controllers/catalog/actions/Search';
 *
 * Search action component for Catalog controller
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';
import CategoryViewerModule from 'src/modules/CategoryViewer';
import Events from 'src/modules/Events';

import CssTransition from 'src/app/common/CssTransition';
import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
import Bottom from 'src/app/common/blocks/Bottom';

class CatalogSearch extends Action
{

    constructor()
    {
        super();
        this.search = this.search.bind(this);
        this.state={
                    category:"",
                    category:"",
                    keywords:""
                };
    }


    search()
    {
        let _category = document.getElementsByName('catalog_search_form_category')[0].value;
        let _country = document.getElementsByName('catalog_search_form_country')[0].value;
        let _keywords = document.getElementsByName('catalog_search_form_title')[0].value;
        Events.dispatch('search', {
            isSearch: 1,
            country: _country,
            category: _category,
            keywords: _keywords
        });
        this.setState(
                {
                    category: _category ? _category : "",
                    country: _country ? _country : "",
                    keywords: _keywords ? _keywords : ""
                })
    }


    render()
    {
        if (!this.props.redux) {
            return null;
        }

        let _categories = CategoryViewerModule.getCategories();

        let _formCategoriesList = [];
        for(let _index in _categories) {
            let _category = _categories[_index];
            _formCategoriesList.push(
                <option key={_index} value={_category.id}>{_category.title}</option>
            );
        }

        let _formCountriesList = [];
        for(let _index in this.props.redux.actionData.countries) {
            let _country = this.props.redux.actionData.countries[_index];
            _formCountriesList.push(
                <option key={_index} value={_country.code}>{_country.name}</option>
            );
        }

        return (
                <React.Fragment>
                    {this.getHeader()}
                    <CssTransition>
                        <div className="catalog_search_block">
                            {this.props.redux.actionData.whetherToUseTitles&&
                                <React.Fragment>
                                    <div className="catalog_search_form_title_label">
                                        {this.props.redux.staticData.catalog_search_form_title_label}
                                    </div>
                                    <div className="catalog_search_form_title">
                                        <input onChange={this.search} value={this.state.keywords} type="text" name="catalog_search_form_title"/>
                                    </div>
                                </React.Fragment>
                            }
                            <div className="catalog_search_form_category_label">
                                {this.props.redux.staticData.catalog_search_form_category_label}
                            </div>
                            <div className="catalog_search_form_category">
                                <select onChange={this.search} value={this.state.category} name="catalog_search_form_category">
                                    <option value="">{this.props.redux.staticData.catalog_search_form_all_categories}</option>
                                    {_formCategoriesList}
                                </select>
                            </div>
                            <div className="catalog_search_form_country_label">
                                {this.props.redux.staticData.catalog_search_form_country_label}
                            </div>
                            <div className="catalog_search_form_country">
                                <select onChange={this.search} value={this.state.country} name="catalog_search_form_country">
                                    <option value="">{this.props.redux.staticData.catalog_search_form_all_countries}</option>
                                    {_formCountriesList}
                                </select>
                            </div>
                            <div className="padding_bottom_10"></div>
                        </div>
                        <PlacemarksList
                            photoWidth="290"
                            photoHeight="225"
                            bottomComponent={Bottom}
                        />
                    </CssTransition>
                </React.Fragment>
                );
    }
}

function MapStateToProps(state)
{
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_SEARCH)
}

export default connect(MapStateToProps,MapDispatchToProps)(withRouter(CatalogSearch))