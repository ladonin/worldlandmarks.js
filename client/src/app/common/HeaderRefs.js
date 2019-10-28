/*
 * File src/app/common/HeaderRefs.js
 * import HeaderRefs from 'src/app/common/HeaderRefs';
 *
 * Add to document specific css styles, js files etc
 */

import {isMobile} from "react-device-detect";

let _script = [];
let _link=[];

if (isMobile) {
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/mobile/common.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/mobile/catalog.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/mobile/main.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/mobile/map.css"});
} else {
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/desctop/common.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/desctop/catalog.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/desctop/main.css"});
    _link.push({"rel": "stylesheet", type:"text/css", "href": "/css/desctop/map.css"});
}

export const link = _link;
export const script = _script;