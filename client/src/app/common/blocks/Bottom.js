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
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';
import {UpdateStyleData, ClearStyleData} from 'src/app/parents/Common';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import CssTransition from 'src/app/common/CssTransition';

class Bottom extends Block
{

    constructor()
    {
        super();
        this.firstRender = true;
    }


    shouldComponentUpdate(nextProps, nextState)
    {
        if (typeof nextProps.redux === 'undefined') {
            return false;
        }
        return true;
    }


    componentDidMount()
    {
        this.firstRender = false;
        let _marginTop = 20;

        if (BaseFunctions.getHeight(window) - BaseFunctions.getHeight('#container') + 20 > _marginTop) {
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


    render()
    {
        if (!this.props.redux.text) {
            return null;
        }

        return (
            <React.Fragment>
                <CssTransition>
                    <div className={"page_bottom_block hidden2 " + (this.firstRender ? '' : this.props.redux.class)} style={this.firstRender ? {} : this.props.redux.style}>
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
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_COUNTRIES}>{this.props.redux.text['5']}</a>
                            </div>
                            <div className="page_bottom_column_row">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SITEMAP_CATEGORIES}>{this.props.redux.text['6']}</a>
                            </div>
                            <div className="page_bottom_column_row">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRIES}>{this.props.redux.text['7']}</a>
                            </div>
                            <div className="page_bottom_column_row">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_CATEGORIES}>{this.props.redux.text['8']}</a>
                            </div>
                        </div>
                        <div className="clear"></div>
                        <div className="page_bottom_rights" dangerouslySetInnerHTML={{__html:this.props.redux.text['9']}}></div>
                    </div>
                </CssTransition>
            </React.Fragment>);
    }
}

function mapStateToProps(state)
{
    return {
        redux: {
            'text': state.staticData['bottom'] ? state.staticData['bottom'] : {},
            'style':state.styleData['.page_bottom_block'] ? state.styleData['.page_bottom_block'].style : {},
            'class':state.styleData['.page_bottom_block'] ? state.styleData['.page_bottom_block'].class : '',
        }
    }
}

export default connect(mapStateToProps, {updateStyleData: UpdateStyleData, clearStyleData:ClearStyleData})(withRouter(Bottom))