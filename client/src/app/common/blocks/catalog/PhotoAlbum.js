/*
 * File src/app/common/blocks/catalog/PhotoAlbum.js
 * import PhotoAlbum from 'src/app/common/blocks/catalog/PhotoAlbum';
 *
 * PhotoAlbum block component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, IsMobile} from "react-device-detect";


import ConfigRestrictions from 'src/../../application/common/settings/Restrictions';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import CommonBaseFunctions from 'src/../../application/common/functions/BaseFunctions';
import ImageDimensions from 'src/modules/ImageDimensions';

import Block from 'src/app/parents/Block';
import Router from 'src/modules/Router';




class PhotoAlbum extends Block {
    constructor() {
        super();
        this.isCountryPageVal = undefined;

        // Photoalbum settings according with page and device type
        this.viewSettings = {};
        this.linksSettings = {};
    }

    init() {

        // Init settings
        if (IsMobile) {
            // Mobile device

            if (this.isCountryPage()) {
                // Country page

                this.viewSettings = {
                    'cols' : 3,
                    'rows' : 4
                };
                this.linksSettings = {
                    'country' : false,
                    'state' : true,
                    'placemark' : true
                }
            } else {
                // State page
                this.viewSettings = {
                    'cols' : 4,
                    'rows' : 5
                };
                this.linksSettings = {
                    'country' : false,
                    'state' : false,
                    'placemark' : true
                }
            }

        } else {
            // Desctop device

            if (this.isCountryPage()) {

                // Country page
                this.viewSettings = {
                    'cols' : 4,
                    'rows' : 4,
                    'width_screen' : 600
                };
                this.linksSettings = {
                    'country' : false,
                    'state' : true,
                    'placemark' : true
                }

            } else {
                // State page
                this.viewSettings = {
                    'cols' : 6,
                    'rows' : 4,
                    'width_screen' : ConfigRestrictions['desctop_content_width']
                };
                this.linksSettings = {
                    'country' : false,
                    'state' : false,
                    'placemark' : true
                }
            }
        }
    }

    componentWillUnmount(){
        // Close photoalbum if opened
        if (window.$('.pp_pic_holder').length) {
            window.$.prettyPhoto.close();
        }
    }

    componentDidUpdate(){
        // Run photoalbum library
        // Note: we do it in componentDidUpdate because the data is passed on component updating, but not mounting
        window.$("a[rel^='prettyPhoto']").prettyPhoto({
            animationSpeed: 'fast',
            slideshow: 5000,
            theme: 'light_rounded',
            show_title: false,
            overlay_gallery: false
        });

        // Prepare outer functions and variables for library
        window._ppAs = {};
        window._ppArrayData = {};
        window._isMobile = IsMobile;


        window._ppAs['pp_iba_link_country'] = this.linksSettings['country'] ? 1 : 0;
        window._ppAs['pp_iba_link_state'] = this.linksSettings['state'] ? 1 : 0;
        window._ppAs['pp_iba_link_placemark'] =this.linksSettings['placemark'] ? 1 : 0;

        let _i = 0;
        for (let _index in this.props.redux.photos) {
            let _photo = this.props.redux.photos[_index];

            window._ppAs['pp_iba-' + _i + '_c'] = _photo['placemark']['country'];
            window._ppAs['pp_iba-' + _i + '_cc'] = _photo['placemark']['country_code'];
            window._ppAs['pp_iba-' + _i + '_sc'] = _photo['placemark']['state_code'];
            window._ppAs['pp_iba-' + _i + '_loc'] = _photo['placemark']['locality'];
            window._ppAs['pp_iba-' + _i + '_iac'] = _photo['placemark']['is_administrative_center'];
            window._ppAs['pp_iba-' + _i + '_s'] = _photo['placemark']['state'];
            window._ppAs['pp_iba-' + _i + '_hs'] = _photo['placemark']['has_states'];
            window._ppAs['pp_iba-' + _i + '_pi'] = _photo['placemark']['placemarks_id'];
            window._ppAs['pp_iba-' + _i + '_t'] = _photo['placemark']['title'];

            if (!window._ppAs['pp_iba-' + _i + '_t']){
                window._ppAs['pp_iba-' + _i + '_t']= this.props.redux.defaultTitlePart + _photo['placemark']['placemarks_id'];
            }

            window._ppAs['pp_iba-' + _i + '_pd'] = _photo['photo']['dir'];
            window._ppAs['pp_iba-' + _i + '_pp'] = _photo['photo']['ph_path'];

            _i++;
        }

        window.pretty_photo_prepare_big_photo_viewer = function () {
            window.$('#pp_full_res img').css('max-width', window._ppPw + 'px');
            window.$('#pp_full_res').css('height', window._ppPh + 'px');
            window.$('#pp_full_res').css('width', window._ppPw + 'px');
            window.$('#pp_full_res img').css('max-height', window._ppPh + 'px');
            if (window._isMobile) {
                window.$('.pp_expand').hide();
            } else {
                window.$('.pp_expand').attr('data-url', window.$('#pp_full_res img').attr('src').replace(new RegExp("([0-9]+)\/[0-9]{1,2}_", 'g'), '$1/1_'));
            }
        }

        window.pretty_photo_prepare_big_photo_parameters = function (id, type) {
            if (type === 'data-description') {
                if (typeof (window._ppArrayData[id + '_data-description']) !== 'undefined') {
                    return window._ppArrayData[id + '_data-description'];
                }
                var pp_data_description = "<div class='pp_ibadr'>";
                if (window._ppAs['pp_iba_link_country']) {
                    pp_data_description += `<a
                        onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:\'${'/'+Consts.CONTROLLER_NAME_CATALOG+'/' + window._ppAs[id + '_cc']}\'})"
                    >${window._ppAs[id + '_c']}</a>`;
                } else {
                    pp_data_description += window._ppAs[id + '_c'];
                }
                if (window._ppAs[id + '_hs']) {
                    pp_data_description += ' &bull; ';
                    if (window._ppAs['pp_iba_link_state']) {
                        pp_data_description += `<a
                            onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:\'${'/'+Consts.CONTROLLER_NAME_CATALOG+'/' + window._ppAs[id + '_cc'] + '/' + window._ppAs[id + '_sc']}\'})"
                        >${window._ppAs[id + '_s']}</a>`;
                    } else {
                        pp_data_description += window._ppAs[id + '_s'];
                    }
                    if ((window._ppAs[id + '_loc']) && (window._ppAs[id + '_iac']==0)) {
                        pp_data_description += ' &bull; ' + window._ppAs[id + '_loc'];
                    }
                    pp_data_description += "</div>"

                        pp_data_description += "<div class='pp_ibptb'>";
                        if (window._ppAs['pp_iba_link_placemark']) {
                            pp_data_description += `<a
                                onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:\'${'/'+Consts.CONTROLLER_NAME_CATALOG+'/' + window._ppAs[id + '_cc'] + '/' + window._ppAs[id + '_sc'] + '/' + window._ppAs[id + '_pi']}\'})"
                            >${window._ppAs[id + '_t']}</a>`;
                        } else {
                            pp_data_description += window._ppAs[id + '_t'];
                        }
                        pp_data_description += "</div>";

                } else {
                    if ((window._ppAs[id + '_loc']) && (window._ppAs[id + '_iac']==0)) {
                        pp_data_description += ' &bull; ' + window._ppAs[id + '_loc'];
                    }
                    pp_data_description += "</div>";

                        pp_data_description += "<div class='pp_ibptb'>";
                        if (window._ppAs['pp_iba_link_placemark']) {
                            pp_data_description += `<a
                                onclick="window.dispatchEvent('${Consts.EVENT_GOTO}', {url:\'${'/'+Consts.CONTROLLER_NAME_CATALOG+'/' + window._ppAs[id + '_cc'] + '/' + window._ppAs[id + '_pi']}\'})"
                            >${window._ppAs[id + '_t']}</a>`;
                        } else {
                            pp_data_description += window._ppAs[id + '_t'];
                        }
                        pp_data_description += "</div>";

                }
                pp_data_description += "<div class='pp_ibptbs1'><div class='pp_ibptbs2'></div></div>";

                window.$('#pp_iba-' + id).attr('data-description', pp_data_description);

                window._ppArrayData[id + '_data-description'] = pp_data_description;

                return pp_data_description;
            }
            var pb = window._ppAs[id + '_pd'] + window._ppPbPref + window._ppAs[id + '_pp'];

            if (type === 'data-photo') {
                return '<img src="' + pb + '">';
            }
            if (type === 'data-href') {
                return pb;
            }
        }
    }


    /*
     * Determine - whether page is 'country' or 'state'
     *
     * $return [boolean}
     */
    isCountryPage() {
        if (typeof this.isCountryPageVal === 'undefined') {
            this.isCountryPageVal = (Router.getActionName(this.props.match.params) === Consts.ACTION_NAME_COUNTRY);
        }
        return this.isCountryPageVal;
    }


    render() {
        this.init();
        let _content;

        let _ppPw;
        let _ppPsw;
        let _ppPsh;
        let _ppPh;
        let _ppPah;
        let _ppPbPref;
        let _ppPsPref;

        let _additionalHeight;
        let _prettyPhotoWidth;

        if (IsMobile) {
            if (BaseFunctions.getWidth(window) <= BaseFunctions.getHeight(window)) {
                _ppPw = BaseFunctions.getWidth(window);
                _ppPsw = _ppPw / this.viewSettings.cols;
                _ppPsh = _ppPsw / 1.5;
                _ppPh = (_ppPw * 1.5) - 93;
            } else {
                _ppPh = BaseFunctions.getHeight(window) - 93;
                _ppPw = _ppPh * 1.5;
                _ppPsw = BaseFunctions.getWidth(window) / this.viewSettings['cols'];
                _ppPsh = _ppPsw / 1.5;
            }
            _prettyPhotoWidth = BaseFunctions.getWidth(window);
            // Additional amendment
            _additionalHeight = 0;

        } else {
            _ppPw = ConfigRestrictions['desctop_content_width'];
            _ppPsw = this.viewSettings['width_screen'] / this.viewSettings['cols'];
            _ppPsh = _ppPsw / 1.5;
            _ppPh = _ppPw / 1.5;
            _prettyPhotoWidth = this.viewSettings['width_screen'];

            // Additional amendment
            _additionalHeight = 5;
        }

        _ppPah = _ppPw / 1.5;
        _ppPbPref = ImageDimensions.getPrefix(_ppPw, 0);
        _ppPsPref = ImageDimensions.getPrefix(_ppPsw, 40);

        // -->Prepare small photos collection
        let _smallPhotosList = [];
        // Small showed photos number
        let _i = 0;
        // Flag when we can show small photos on the page, other photos will be included but hidden
        let _whetherShowSmallPhotos = true;
        for (let _index in this.props.redux.photos) {
            let _photo = this.props.redux.photos[_index];
            let _style = {
                height:_ppPsh+'px'
            };
            if (!_whetherShowSmallPhotos) {
                _style.display = 'none';
            }

            let _smallPhoto = '';
            if (_whetherShowSmallPhotos) {
                let _cropData = CommonBaseFunctions.viewCroppedPhoto(
                    null,
                    _photo['photo']['ph_width'],
                    _photo['photo']['ph_height'],
                    _ppPsw,
                    _ppPsh,
                    false);

                _smallPhoto =
                    <div class='cropped_image_div' style={{width: _ppPsw + "px", height: _ppPsh + "px", overflow: 'hidden'}}>
                        <img src={_photo['photo']['dir'] + _ppPsPref + _photo['photo']['ph_path']} style={{width: _cropData.width + "px", height: _cropData.height + "px", position: 'relative', top: _cropData.top + "px", left: _cropData.left + "px"}}/>
                    </div>;
            }
            _smallPhotosList.push(<li className="pp_pi2"
                style={_style}
                data-id={'id-'+_i}><div><span className="pp_ib"><a id={'pp_iba-'+_i}
                data-href="" rel="prettyPhoto[gallery]" data-photo=""
                data-description="">{_smallPhoto}</a></span></div></li>);

            _i++;
            if (this.viewSettings['cols'] * this.viewSettings['rows'] == _i) {
                _whetherShowSmallPhotos = false;
            }
        }
        // <--Prepare small photos collection

        // For use in the library
        window._ppPw = _ppPw;
        window._ppPh = _ppPh;
        window._ppPbPref = _ppPbPref;

        return (
            <React.Fragment>
                <BrowserView>
                    <div id="pretty_photo" style={{width:_prettyPhotoWidth+'px'}}
                        data-photo-width={_ppPw}
                        data-photo-height={_ppPh + _additionalHeight}
                        data-content-height="93"
                        >
                        <div class="pretty_photo_title">{this.props.redux.title}</div>
                        <ul class="pretty_photo_portfolio-area" id="pretty_photo_portfolio-area">
                            {_smallPhotosList}
                        </ul>
                        <div class="pretty_photo_column-clear"></div>
                    </div>
                </BrowserView>
                <MobileView>
                    TODO MOBILE ArticlesList
                </MobileView>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

    return {
        redux:{
            photos: state.dynamicData['data'] ? state.dynamicData['data']['photos'] : undefined,
            title: state.staticData['catalog_photoalbum_title_text'],
            defaultTitlePart: state.staticData['default_title_part']
        }
    };
}

export default connect(mapStateToProps)(withRouter(PhotoAlbum))