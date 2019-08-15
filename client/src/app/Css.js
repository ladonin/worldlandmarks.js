import {isMobile} from "react-device-detect";

if (isMobile) {
    require('public/css/mobile/common.css');
    require('public/css/mobile/catalog.css');
    require('public/css/mobile/main.css');
} else {
    require('public/css/desctop/common.css');
    require('public/css/desctop/catalog.css');
    require('public/css/desctop/main.css');
}

//require('public/css/common/common.css');
//require('public/css/common/catalog.css');
//require('public/css/common/main.css');