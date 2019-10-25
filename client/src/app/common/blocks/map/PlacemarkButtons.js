/*
 * File src/app/common/blocks/map/PlacemarkButtons.js
 * import PlacemarkButtons from 'src/app/common/blocks/map/PlacemarkButtons';
 *
 * PlacemarkButtons component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {isMobile} from "react-device-detect";

import MapModule from 'src/modules/Map';
import HtmllerButtons from 'src/modules/HtmllerButtons';
import BaseFunctions from 'src/functions/BaseFunctions';

class PlacemarkButtons extends Component
{

    constructor()
    {
        super();
        this.showPlace = this.showPlace.bind(this);
        this.returnToContent = this.returnToContent.bind(this);
        this.state = {type: 1};


        if (BaseFunctions.getWidth(window) % 2 === 0) {
            this._mobileButtonWidth1 = (BaseFunctions.getWidth(window) / 2) - 7;
            this._mobileButtonWidth2 = (BaseFunctions.getWidth(window) / 2) - 8;
        } else {
            this._mobileButtonWidth1 = Math.floor(BaseFunctions.getWidth(window) / 2) - 7;
            this._mobileButtonWidth2 = Math.floor(BaseFunctions.getWidth(window) / 2) - 7;
        }
    }


    showPlace()
    {
        this.props.hide();
        MapModule.showPlace();
        this.setState({type: 2});
    }


    returnToContent()
    {
        this.props.show();
        MapModule.hidePlace();
        this.setState({type: 1});
    }


    render()
    {
        let _style1 = {};
        let _style2 = {};

        if (isMobile) {
            _style1 = {
                width: this._mobileButtonWidth1 + 'px'
            }
            _style2 = {
                width: this._mobileButtonWidth2 + 'px'
            }
        }

        if ((this.state.type === 1) || (this.state.type === 2)) {

            let _button;

            if (this.state.type === 1) {
                _button =
                        <div id="placemark_toggle" style={_style1} className="placemark_toggle_2" onClick={this.showPlace}>
                            <HtmllerButtons style={isMobile ? {top: '-75px'} : {top: '-120px'}}/>
                            <div className="button_text">{this.props.redux.staticData.map_buttons_placemark_viewer_onmap}</div>
                        </div>;
            } else {
                _button =
                        <div id="placemark_toggle" style={_style1} className="placemark_toggle_2" onClick={this.returnToContent}>
                            <HtmllerButtons style={isMobile ? {top: '-187px'} : {top: '-300px'}}/>
                            <div className="button_text">{this.props.redux.staticData.map_buttons_placemark_viewer_return}</div>
                        </div>
            }
            return (
                    <React.Fragment>
                        <div id="placemark_buttons">
                            <div id="placemark_buttons_block">
                                <div id="placemark_close" style={_style2} className="placemark_close_2" onClick={this.props.close}>
                                    <HtmllerButtons/>
                                    <div className="button_text">{this.props.redux.staticData.map_buttons_placemark_viewer_close}</div>
                                </div>
                                {_button}
                            </div>
                        </div>
                    </React.Fragment>
                    );
        }
        return null;
    }
}


function mapStateToProps(state)
{
    return {
        redux: {
            staticData: state.staticData
        }
    };
}

export default connect(mapStateToProps)(PlacemarkButtons)