/*
 * File src/app/common/blocks/map/PlacemarkButtons.js
 * import PlacemarkButtons from 'src/app/common/blocks/map/PlacemarkButtons';
 *
 * PlacemarkButtons component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import MapModule from 'src/modules/Map';


import Consts from 'src/settings/Constants';


class PlacemarkButtons extends Component {

    constructor(){
        super();
        this.showPlace = this.showPlace.bind(this);
        this.returnToContent = this.returnToContent.bind(this);
        this.state = {type:1};
    }

    showPlace(){
        this.props.hide();
        MapModule.showPlace();
        this.setState({type: 2});
    }

    returnToContent(){
        this.props.show();
        MapModule.hidePlace();
        this.setState({type: 1});
    }

    render() {

        if ((this.state.type === 1) || (this.state.type === 2)){

            let _button;

            if (this.state.type === 1) {
                _button =
                    <div id="placemark_toggle" className="placemark_toggle_2" onClick={this.showPlace}>
                        <div className="icon">
                            <img src="/img/icons_desctop.png" style={{top: '-120px'}}/>
                        </div>
                        <div className="button_text">На карте</div>
                    </div>;
            } else {
                _button =
                    <div id="placemark_toggle" className="placemark_toggle_2" onClick={this.returnToContent}>
                        <div className="icon">
                            <img src="/img/icons_desctop.png" style={{top: '-300px'}}/>
                        </div>
                        <div className="button_text">Вернуться</div>
                    </div>
            }
        return (
                <React.Fragment>
                    <BrowserView>
                        <div id="placemark_buttons">
                            <div id="placemark_buttons_block">
                                <div id="placemark_close" className="placemark_close_2" onClick={this.props.close}>
                                    <div className="icon">
                                        <img src="/img/icons_desctop.png"/>
                                    </div>
                                    <div className="button_text">Закрыть</div>
                                </div>
                                {_button}
                            </div>
                        </div>
                    </BrowserView>
                    <MobileView>
                        TODO MOBILE PlacemarksButtons
                    </MobileView>
                </React.Fragment>
                );
        }

        return null;
    }
}

export default PlacemarkButtons