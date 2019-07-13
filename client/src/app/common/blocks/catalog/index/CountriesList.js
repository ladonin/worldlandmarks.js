/*
 * File src/app/common/blocks/catalog/index/CountriesList.js
 * import CountriesList from 'src/app/common/blocks/catalog/index/CountriesList';
 *
 * CountriesList block component
 */

//import React from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';


import Consts from 'src/settings/Constants';
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Countries = require('application/express/components/Countries');
import ArticlesList from 'src/app/common/blocks/ArticlesList';

import AbstractBlock from 'src/app/abstract/AbstractBlock';

class CountriesList extends AbstractBlock {

    constructor() {
        super();
    }

    render() {
        return (
            <React.Fragment>
                <BrowserView>
                    <div className="catalog_index_block">
                        <For each="item" in={this.props.data}>
                            <div className="catalog_index_country_row" onClick={this.goTo} data-url="catalog/{item.country_code}">
                                <img className="flag" src={BaseFunctions.getFlagUrl(item.country_code)}/>
                                <div className="catalog_index_country_row_name">{Countries.prepareCountryName(item.country)}
                                    <div className="catalog_index_country_placemarks_count">{this.getText('placemarks_count/2/text')} {item.placemarks_count}</div>
                                </div>
                                <div className="clear"></div>
                            </div>
                        </For>
                        <div className="clear"></div>
                        <div className="catalog_block_last_articles_title" style="position:relative">
                            <img style="display: inline-block;width: 40px;" src="/img/article_icon.png"/>
                            <span style="display: block; ;position: absolute;top: 20px;left: 60px; color:#333">{this.getText('main/last_articles/text')}</span>
                        </div>
                        <div style="background-color:#fff; margin:0 10px;">
                            <ArticlesList/>
                        </div>
                    </div>
                    <div className="clear"></div>
                </BrowserView>
                <MobileView>
                </MobileView>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {

    return {
        data:state.dynamicText['data']
    }
}
let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CountriesList))






















