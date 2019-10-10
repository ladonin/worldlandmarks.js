/*
 * File src/app/common/blocks/toolsPanel/Settings.js
 * import Settings from 'src/app/common/blocks/toolsPanel/Settings';
 *
 * 'Settings' part of ToolsPanel block component
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Language from 'src/modules/Language';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import Events from 'src/modules/Events';
import Socket from 'src/app/socket/Socket';

import HtmllerButtons from 'src/modules/HtmllerButtons';

class Settings extends Block {

    constructor() {
        super();
        this.changeLanguage = this.changeLanguage.bind(this);
        this.state = {
            languageValue:Language.getName()
        }
    }

    changeLanguage(event){
        this.setState({languageValue: event.target.value});
        Language.setName(event.target.value);
        Socket.backgroundQuery(
            Consts.CONTROLLER_NAME_MAP,
            'change_language',
            {
                [Consts.LANGUAGE_CODE_VAR_NAME]: event.target.value,
            }
        );
    }


    render() {

        let _languagesList = [];
        for (let _index in this.props.redux.staticData.languages) {
            let _language = this.props.redux.staticData.languages[_index];
            let _selected = (Language.getName() === _language['code']) ? true : false;
            _languagesList.push(<option value={_language['code']} selected={_selected}>{_language['title']}</option>);
        }

        return (


<div id="panel_tools_content_settings_block">
    <div className="panel_tools_content_settings_title">
        {this.props.redux.staticData.panel_tools_settings_head}
    </div>

    <div id="panel_tools_content_settings_back" onClick={()=>Events.dispatch(Consts.EVENT_TOOLS_PANEL_SET_STATUS, {value: 0})}>
        <HtmllerButtons device={Consts.DEVICE_NAME_DESCTOP} text={this.props.redux.staticData.panel_tools_settings_back_title}/>
    </div>
    <div className="panel_tools_content_settings_language_title">
        {this.props.redux.staticData.panel_tools_settings_language_title}
    </div>
    <div className="panel_tools_content_settings_language_block">
        <select id="settings_language" onChange={this.changeLanguage} value={this.state.languageValue}>
            {_languagesList}
        </select>
    </div>
</div>)
        ;
    }
}



function mapStateToProps(state) {

    return {
        redux: {
            staticData:state.staticData
        }
    }
}

export default connect(mapStateToProps)(withRouter(Settings))







