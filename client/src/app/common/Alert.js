/*
 * File src/app/common/Alert.js
 * import Alert from 'src/app/common/Alert';
 *
 * Alert component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import Events from 'src/modules/Events';
import Consts from 'src/settings/Constants';

class Alert extends Component {
    constructor() {
        super();
        this.onAlert = this.onAlert.bind(this);
        this.hideAlert = this.hideAlert.bind(this);
        this.state = {};
    }

    componentWillUnmount(){
        Events.remove('alert', this.onAlert);
    }

    componentDidMount(){
        Events.add('alert', this.onAlert);
    }

    onAlert(e){
        this.timerID = setTimeout(
            () => {
                this.hideAlert();
            },
            5000
        );

        this.setState({
          text: e.detail.text,
          className: e.detail.className,
        });
    }

    hideAlert(){
        this.setState({
            text:undefined,
            className:undefined
        })
    }

    render() {
        if (!this.state.text) {
            return null;
        }

        return (
                <React.Fragment>
                    <div onClick={this.hideAlert} id="alert" className={this.state.className}><div>{this.state.text}</div></div>
                </React.Fragment>
        );
    }
}

export default Alert