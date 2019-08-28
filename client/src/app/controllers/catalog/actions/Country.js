/*
 * File src/app/controllers/catalog/actions/Country.js
 * import MainIndex from 'src/app/controllers/catalog/actions/Country';
 *
 * Country action component for Catalog controller
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {MapStateToProps, MapDispatchToProps} from 'src/app/parents/Action';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';

// Components
import PhotoAlbum from 'src/app/common/blocks/catalog/PhotoAlbum';

class CatalogCountry extends Action {

    constructor() {
        super();
    }




    getlastArticles() {

        let _articlesList = [];
        if (this.props.redux.dynamicData.data && this.props.redux.dynamicData.data.articles) {
            for (let _index in this.props.redux.dynamicData.data.articles) {
                let _article = this.props.redux.dynamicData.data.articles[_index];
                _articlesList.push(
                    <div class="catalog_country_page_article_item">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + _article['id']}>{_article['title']}</a>
                    </div>);
            }
        }
        let _resut = null;
        if (_articlesList.length) {
            _resut =
            <div>
                <div className="catalog_country_page_block_last_articles_title">
                    {this.props.redux.staticData['last_articles_text']}
                </div>
                <div className="catalog_country_page_article_items_list">
                    {_articlesList}
                    <div className="catalog_country_page_article_item padding_bottom_10 padding_top_5">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_ARTICLES_COUNTRIES_NAME + '/' + Router.getControllerName(this.props.match.params) + '/1'}>
                            <i>{this.props.redux.staticData['see_all']}</i>
                        </a>
                    </div>
                </div>
            </div>;
        }
        return _resut;
    }

    render() {

        let _statesList = [];

        if (this.props.redux.dynamicData.data && this.props.redux.dynamicData.data.states) {
            for (let _index in this.props.redux.dynamicData.data.states) {
                let _state = this.props.redux.dynamicData.data.states[_index];
                    _statesList.push(
                            <div className="catalog_country_state_row">
                                <a onClick={this.goTo} data-url={this.props.redux.dynamicData['current_url']+this.props.redux.dynamicData.data.states[_index]['state_code']}>{this.props.redux.dynamicData.data.states[_index]['state']}</a>
                            </div>
                );
            }
        }

        return (
                <div id='action' className={this.getActionClass()}>
                    <BrowserView>
                        <div id="catalog_country_block">
                            {this.props.redux.staticData['is_admin'] === true &&
                                <h2>
                                  <div style={{'margin-bottom':'10px', 'text-align':'right'}}><a style={{color:'#f00', 'font-size':'14px'}} href={'/admin/_e5b7rnijjrnrnnb_export_photos?code_type=country&country_code='+this.props.redux.dynamicData['country_code']}>[скачать архив фотографий данной страны]</a></div>
                                </h2>
                            }
                            <div id="catalog_country_states_block">
                                <div id="catalog_country_states_title">
                                    {this.props.redux.staticData['catalog_states_regions_list_title']}
                                </div>
                                <div id="catalog_country_states_list">
                                    {_statesList}
                                </div>
                            </div>

                            <div id="catalog_country_photos_block">
                                <PhotoAlbum/>
                            </div>
                            <div class="clear"></div>
                            {this.getlastArticles()}
                        </div>
                    </BrowserView>
                    <MobileView>
                      TODO MOBILE CatalogIndex
                    </MobileView>
                </div>
                );
    }
}


export default connect(MapStateToProps,MapDispatchToProps)(withRouter(CatalogCountry))