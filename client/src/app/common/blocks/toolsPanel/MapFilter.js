/*
 * File src/app/common/blocks/toolsPanel/MapFilter.js
 * import MapFilter from 'src/app/common/blocks/toolsPanel/MapFilter';
 *
 * ToolsPanel map filter block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Language from 'src/modules/Language';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import MapModule from 'src/modules/Map';

import HtmllerButtons from 'src/modules/HtmllerButtons';
import CategoryViewer from 'src/modules/CategoryViewer';
import Router from 'src/modules/Router';
import Events from 'src/modules/Events';

class MapFilter extends Block {

    constructor() {
        super();
        this.localVarsStyles = {};
        this.localVarsStyles.selectBlockHeight = BaseFunctions.getHeight(window);
        this.localVarsStyles.selectBlockWidth = isMobile ? (BaseFunctions.getWidth(window) - 70) : 240;
        this.localVarsStyles.selectBlockCategoryNameWidth = this.localVarsStyles.selectBlockWidth - 27 - 30;
        this.state = {id:MapModule.getFilterCategory()}
        this.resetFilter = this.resetFilter.bind(this);
    }

    componentDidMount(){
        if (isBrowser) {
            BaseFunctions.niceScroll("#panel_tools_content_filter_select_block");
        }
    }

    filterBy(id){
        MapModule.filterByCategory(id);
        MapModule.restartBunchFillingTimer();
        this.setState({id:MapModule.getFilterCategory()});
        if (isMobile) this.props.toolsPanelRef.close()
    }

    resetFilter(){
        if (MapModule.getFilterCategory() !== false) {
            MapModule.resetFilterByCategory();
            MapModule.restartBunchFillingTimer();
            this.setState({id:MapModule.getFilterCategory()});
            if (isMobile) this.props.toolsPanelRef.close()
        }
    }

    render() {
        let _categoriesList = [];
        let _categories = CategoryViewer.getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];
            _categoriesList.push(
                    <div key={_category.id} id={'panel_tools_content_filter_select_block_category_' + _category.id} className={"panel_tools_content_filter_select_block_category_block" + ((this.state.id === _category.id) ? ' panel_tools_content_filter_select_block_category_block_selected' : '')}

             onClick={()=>{this.filterBy(_category.id)}}>
                        <div className="panel_tools_content_filter_select_block_category_img">
                            <img src={CategoryViewer.getCategoryImageUrl(_category.id)}/>
                        </div>
                        <div className="panel_tools_content_filter_select_block_category_name" style={{width: this.localVarsStyles.selectBlockCategoryNameWidth + 'px'}}>
                            {_category.title}
                        </div>
                        <div className="clear"></div>
                    </div>);
        }

        return (
            <div id="panel_tools_content_filter_select_block" style={{height:this.localVarsStyles.selectBlockHeight + 'px', width: this.localVarsStyles.selectBlockWidth + 'px'}}>
                <div className="panel_tools_content_filter_title">
                    {this.props.redux.staticData.panel_tools_filter_head}
                </div>
                {this.state.id !== false && <div id="panel_tools_content_filter_selected_category">
                    <b>{this.props.redux.staticData.panel_tools_filter_category_selected_title}</b> {CategoryViewer.getCategoryTitle(this.state.id)}</div>}
                <div id="panel_tools_content_filter_back" onClick={()=>Events.dispatch(Consts.EVENT_TOOLS_PANEL_SET_STATUS, {value: 0})}>
                    <HtmllerButtons device={Consts.DEVICE_NAME_DESCTOP} text={this.props.redux.staticData.panel_tools_filter_back_title}/>
                </div>

                {this.state.id&&
                <div id="panel_tools_content_filter_reset" onClick={this.resetFilter}>
                    <HtmllerButtons device={Consts.DEVICE_NAME_DESCTOP} text={this.props.redux.staticData.panel_tools_filter_reset_title}/>
                </div>}

                <div className="clear"></div>
                <div className="panel_tools_content_filter_category_title">
                    {this.props.redux.staticData.panel_tools_filter_category_title}
                </div>
                {_categoriesList}
            </div>);
    }
}

function mapStateToProps(state) {
    return {
        redux: {
            staticData: state.staticData
        }
    }
}

export default connect(mapStateToProps)(withRouter(MapFilter))