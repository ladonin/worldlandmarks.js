/*
 * File src/settings/Constants.js
 * import Constants from 'src/settings/Constants';
 */

import CommonConsts from 'src/../../server/common/settings/Constants';

let _Consts = {
    FORM_TEXT_TAG_CODE_A: 'a',
    FORM_TEXT_TAG_CODE_B: 'b',
    FORM_TEXT_TAG_CODE_STRONG: 'strong',
    FORM_TEXT_TAG_CODE_IMAGE_ADVANCED: 'image_advanced',
    FORM_TEXT_TAG_CODE_P: 'p',
    STYLE_DATA: 'style_data',
    UPDATE_STYLE_DATA: 'UPDATE_STYLE_DATA',
    CLEAR_STYLE_DATA:'CLEAR_STYLE_DATA',
    YMAP_ZOOM:'ymapZoom'
}
export default {...CommonConsts, ..._Consts}