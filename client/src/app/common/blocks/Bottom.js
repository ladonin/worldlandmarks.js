/*
 * File src/app/common/blocks/Bottom.js
 * import Bottom from 'src/app/common/blocks/Bottom';
 *
 * Bottom side block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import BaseFunctions from 'src/functions/BaseFunctions';
import {UpdateStyleData} from 'src/app/parents/Common';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';


class Bottom extends Block {

    constructor() {
        super();
    }


    componentDidMount(){

        let _marginTop = 30;
        if (BaseFunctions.getHeight(window) - BaseFunctions.getHeight('#container') > _marginTop) {
            _marginTop += BaseFunctions.getHeight(window) - BaseFunctions.getHeight('#container');
        }

        this.props.updateStyleData(
            {
                '.page_bottom_block':
                {
                    style:{marginTop:_marginTop+'px'},
                    class:'+showed'
                }
            }
        );
    }



    render() {

        if (!this.props.redux.text) {
            return null;
        }

        return (
            <div className={"page_bottom_block hidden2 " + this.props.redux.class} style={this.props.redux.style}>
                <div className="page_bottom_column_1">
                    <div className="page_bottom_column_row_header">
                        {this.props.redux.text['1']}
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG}>{this.props.redux.text['2']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP}>{this.props.redux.text['3']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SEARCH}>{this.props.redux.text['4']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.SITEMAP_COUNTRIES_NAME}>{this.props.redux.text['5']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.SITEMAP_CATEGORIES_NAME}>{this.props.redux.text['6']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_ARTICLES_COUNTRIES_NAME}>{this.props.redux.text['7']}</a>
                    </div>
                    <div className="page_bottom_column_row">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLE + '/' + Consts.ACTION_NAME_ARTICLES_CATEGORIES_NAME}>{this.props.redux.text['8']}</a>
                    </div>
                </div>
                <div className="clear"></div>
                <div className="page_bottom_rights">
                    {this.props.redux.text['9']}
                </div>

            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        redux: {
            'text': state.staticData['bottom'] ? state.staticData['bottom'] : {},
            'style':state.styleData['.page_bottom_block'] ? state.styleData['.page_bottom_block'].style : {},
            'class':state.styleData['.page_bottom_block'] ? state.styleData['.page_bottom_block'].class : '',
        }
    }
}

export default connect(mapStateToProps, {updateStyleData: UpdateStyleData})(withRouter(Bottom))