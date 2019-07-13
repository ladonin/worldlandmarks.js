/*
 * File src/app/common/blocks/ArticlesList.js
 * import ArticlesList from 'src/app/common/blocks/ArticlesList';
 *
 * ArticlesList block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Consts from 'src/settings/Constants';

import AbstractBlock from 'src/app/abstract/AbstractBlock';


class ArticlesList extends AbstractBlock {
    constructor() {
        super();
    }

    render() {
        return (
                <React.Fragment>
                    <BrowserView>
                        <div className="cataolg_page_article_items_list">
                            <For each="item" in={this.props.articles}>
                                <div className="cataolg_page_article_item">
                                    <a onClick={this.goTo} data-url={Const.CONTROLLER_NAME_ARTICLE + "/" + item.id}>
                                        {item.title}
                                    </a>
                                </div>
                            </For>
                            <div className="cataolg_page_article_item padding_bottom_10 padding_top_5">
                                <a onClick={this.goTo} data-url={Const.CONTROLLER_NAME_ARTICLE}>
                                    <i>{this.props.seeAll}</i>
                                </a>
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                    </MobileView>
                </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

    return {
        articles:state.dynamicText['articles'],
        seeAll:state.staticText['see_all']
    };
}
let mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticlesList))