/*
 * File src/app/common/blocks/toolsPanel/Menu.js
 * import Menu from 'src/app/common/blocks/toolsPanel/Menu';
 *
 * ToolsPanel menu block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Language from 'src/modules/Language';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';

import HtmllerButtons from 'src/modules/HtmllerButtons';
import CategoryViewer from 'src/modules/CategoryViewer';
import Router from 'src/modules/Router';
import Events from 'src/modules/Events';
import AlertsText from 'src/modules/AlertsText';

class Menu extends Block {

    constructor() {
        super();
        this.alert = this.alert.bind(this);
    }



    alert(){
        Events.dispatch('alert', {
            text: AlertsText.get('geolocate_error_no_https', 'error'),
            className: 'error'
        });
    }


    render() {

        let _toolsList = [];
        let _imageStyles = {width:'33px', height:'33px'};
        if (Router.isMapPage(this.props.match.params) === true) {
            _toolsList.push(
                    <React.Fragment>
                        <div id="where_am_i" onClick={this.alert}>
                            <HtmllerButtons device={Consts.DEVICE_NAME_DESCTOP} text={this.props.redux.staticData.panel_tools_where_am_i_title}/>
                        </div>
                        <div id="panel_tools_content_filter" onClick={()=>Events.dispatch(Consts.EVENT_TOOLS_PANEL_SET_STATUS, {value: 2})}>
                            <HtmllerButtons device={Consts.DEVICE_NAME_DESCTOP} text={this.props.redux.staticData.panel_tools_filter_title}/>
                        </div>
                    </React.Fragment>);
        }

        if (this.props.redux.staticData.whether_to_show_main_pages === true) {
            _toolsList.push(
                    <React.Fragment>
                        <div className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                            onClick={this.goTo} data-url='/'>
                            <img style={_imageStyles} src="/img/main_icon_30.png"/>{this.props.redux.staticData.panel_tools_link_main}
                        </div>
                        <div className="clear"></div>
                    </React.Fragment>);
        }



        if (Router.isMapPage(this.props.match.params) === false) {
            _toolsList.push(
                    <React.Fragment>
                        <div className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                            onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP}>
                            <img style={_imageStyles} src="/img/map_icon_30.png"/>{this.props.redux.staticData.panel_tools_link_map}
                        </div>
                        <div className="clear"></div>
                    </React.Fragment>);
        }


        if (this.props.redux.staticData.whether_to_show_catalog_pages === true) {
            _toolsList.push(
                    <React.Fragment>
                        <div className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                            onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG}>
                            <img style={_imageStyles} src="/img/catalog_icon_30.png"/>{this.props.redux.staticData.panel_tools_link_catalog}
                        </div>
                        <div className="clear"></div>
                    </React.Fragment>);
        }

        if (this.props.redux.staticData.whether_to_show_search_pages === true) {
            _toolsList.push(
                    <React.Fragment>
                        <div className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                            onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + Consts.ACTION_NAME_SEARCH}>
                            <img style={_imageStyles} src="/img/search_icon_30.png"/>{this.props.redux.staticData.panel_tools_link_catalog_search}
                        </div>
                        <div className="clear"></div>
                    </React.Fragment>);
        }

        if (this.props.redux.staticData.whether_to_show_article_pages === true) {
            _toolsList.push(
                    <React.Fragment>
                        <div className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                            onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_ARTICLES + '/' + Consts.ACTION_NAME_COUNTRIES}>
                            <img style={_imageStyles} src="/img/article_icon_30.png"/>{this.props.redux.staticData.panel_tools_link_article}
                        </div>
                        <div className="clear"></div>
                    </React.Fragment>);
        }

        _toolsList.push(
            <React.Fragment>
                <div id="panel_tools_content_settings" className="panel_tools_content_links" style={{width:this.props.width + 'px'}}
                    onClick={()=>Events.dispatch(Consts.EVENT_TOOLS_PANEL_SET_STATUS, {value: 1})}>
                    <img style={_imageStyles} src="/img/settings_icon_30.png"/>{this.props.redux.staticData.panel_tools_settings_title}
                </div>
                <div className="clear"></div>
            </React.Fragment>
        );

        return <React.Fragment>{_toolsList}</React.Fragment>;
    }
}



function mapStateToProps(state) {

    return {
        redux: {
            staticData: state.staticData
        }
    }
}

export default connect(mapStateToProps)(withRouter(Menu))







