/*
 * File src/app/common/blocks/ArticlesList.js
 * import ArticlesList from 'src/app/common/blocks/ArticlesList';
 *
 * ArticlesList block component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";


import Consts from 'src/settings/Constants';

import Block from 'src/app/parents/Block';





class ArticlesList extends Block {
    constructor() {
        super();
    }

    render() {

        let _articlesList = [];

        for (let _index in this.props.articles) {
            let _item = this.props.articles[_index];
            _articlesList.push(
                <div className="cataolg_page_article_item">
                    <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + "/" + _item.id}>
                        {_item.title}
                    </a>
                </div>
            );
        }

        return (
                <React.Fragment>
                    <BrowserView>
                        <div className="cataolg_page_article_items_list">
                            {_articlesList}
                            <div className="cataolg_page_article_item padding_bottom_10 padding_top_5">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE}>
                                    <i>{this.props.seeAll}</i>
                                </a>
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        TODO MOBILE ArticlesList
                    </MobileView>
                </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

    return {
        articles:state.dynamicData['articles'],
        seeAll:state.staticData['see_all']
    };
}
let mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticlesList))