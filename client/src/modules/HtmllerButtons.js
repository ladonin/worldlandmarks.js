/*
 * File src/modules/HtmllerButtons.js
 * import HtmllerButtons from 'src/modules/HtmllerButtons';
 *
 * HtmllerButtons module - to render buttons icons according with device type
 */
import React from 'react';
import {isMobile} from "react-device-detect";
import Consts from 'src/settings/Constants';

let _events = {};

export default function (props) {

    let _icon = "/img/icons_desctop.png";
    let _text = '';
    if (props.device !== undefined) {
        if (props.device === Consts.DEVICE_NAME_MOBILE) {
            _icon = "/img/icons_mobile.png";
        }
    } else {
        if (isMobile) {
            _icon = "/img/icons_mobile.png";
        }
    }

    if (props.text) {
        _text = <div className="button_text" dangerouslySetInnerHTML={{__html:props.text}}></div>
    }
    let _style = {};
    if (props.style) {
        _style = props.style;
    }
    return <React.Fragment><div className="icon"><img src={_icon} style={_style}/></div>{_text}</React.Fragment>;
}