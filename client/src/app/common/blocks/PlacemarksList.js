/*
 * File src/app/common/blocks/PlacemarksList.js
 * import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
 *
 * PlacemarksList block component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, IsMobile} from "react-device-detect";

import Consts from 'src/settings/Constants';
import CommonBaseFunctions from 'src/../../application/common/functions/BaseFunctions';
import ImageDimensions from 'src/modules/ImageDimensions';
import BaseFunctions from 'src/functions/BaseFunctions';
import ConfigRestrictions from 'src/../../application/common/settings/Restrictions';

import CategoryViewer from 'src/modules/CategoryViewer';
import {UpdateStyleData, RemoveBackgroundData} from 'src/app/parents/Common';

import Block from 'src/app/parents/Block';
import Socket from 'src/app/socket/Socket';
import Events from 'src/modules/Events';

class PlacemarksList extends Block {
    constructor() {
        super();
        this.seeCategory = this.seeCategory.bind(this);

        this.onScroll = this.onScroll.bind(this);
        this.init = this.init.bind(this);

        this.list = [];

        // Deprecate/allow getting data
        // Temporary blocking during current fetching
        this.block = false;

        this.isRetry = false;
        this.idCurrent = 0;
        this.idNext = 0;

        this.correction = 200;
        this.isSearch = 0;
        this.photoWidth = 340;
        this.photoHeight = 260;
    }

    componentWillUnmount(){
        Events.remove('scroll', this.onScroll);
        this.props.removeBackgroundData('scroll_data');
    }

    componentDidMount(){
        Events.add('scroll', this.onScroll);
        this.init();
        this.getList();
    }

    getList(){
        this.block = true;
        Socket.backgroundQuery(
                this.props.controller,
                this.props.action,
                this.props.match.params,
                {
                    [Consts.ID_VAR_NAME]:this.idNext,
                    [Consts.REQUEST_FORM_DATA]:this.props.data
                })
    }

    onScroll(){
        if ((BaseFunctions.getHeight(window) + BaseFunctions.getScrollTop(window) + this.correction >= BaseFunctions.getHeight(document)) && !this.block) {
            this.block = false;
            this.getList();
        }
    }

    init() {

        if (this.props.photoWidth) {
            this.photoWidth = this.props.photoWidth;
        }

        if (this.props.photoHeight) {
            this.photoHeight = this.props.photoHeight;
        }
    }

    /*
     * Open category window with explanation of interested category
     *
     * @param {integer} id - category id to be showed
     */
    seeCategory(id){
        return function(){
            this.showCategoryViewer(id)
        }.bind(this)
    }

    getItem(data){

        this.idCurrent = data['id'];

        let _photo = data['photos'][0];

        // Url
        let _stateUrl = '';
        let _placemarkUrl = '';
        if ((data['state_code'] === Consts.UNDEFINED_VALUE) || (!data['state_code'])) {
            _stateUrl = '';
        } else {
            _stateUrl = '/' + data['state_code'];
        }
        _placemarkUrl = '/catalog/' + data['country_code'] + _stateUrl + '/' + data['id'];

        // Categories
        let _categories = [];

        _categories.push(<img key={'category_'+data['id']+'_'+data['category']} src={CategoryViewer.getCategoryImageUrl(data['category'])} onClick={this.seeCategory(data['category'])}/>);

        let _subcategories = data['subcategories'] ? data['subcategories'].split(',') : [];
        let _photoInsert;
        let _catalogScrollPlacemarkRowContentWidth;
        let _catalogScrollPlacemarkRowPhotoWidth;

        for (let _index in _subcategories) {
            let _subcategory = parseInt(_subcategories[_index].trim());
            _categories.push(<img key={'category_'+data['id']+'_'+_subcategory} src={CategoryViewer.getCategoryImageUrl(_subcategory)} onClick={this.seeCategory(_subcategory)}/>);
        }

        if (IsMobile) {
            _photoInsert = <img src={_photo['dir'] + ImageDimensions.getPrefix(BaseFunctions.getWidth(window), 0) + _photo['name']} width={BaseFunctions.getWidth(window) + 'px'}/>;
        } else {
            let _cropData = CommonBaseFunctions.viewCroppedPhoto(
                    null,
                    _photo['width'],
                    _photo['height'],
                    this.photoWidth,
                    this.photoHeight,
                    false);

            _photoInsert =
                <div className='cropped_image_div' style={{width: this.photoWidth + "px", height: this.photoHeight + "px", overflow: 'hidden'}}>
                    <img src={_photo['dir'] + "6_" + _photo['name']} style={{width: _cropData.width + "px", height: _cropData.height + "px", position: 'relative', top: _cropData.top + "px", left: _cropData.left + "px"}}/>
                </div>;

            _catalogScrollPlacemarkRowContentWidth = ConfigRestrictions.desctop_content_width - this.photoWidth - 20;
            _catalogScrollPlacemarkRowPhotoWidth = this.photoWidth;
        }

        return (
                <div key={'item_'+data['id']} className="catalog_scroll_placemark_row">
                    <div className="catalog_scroll_placemark_row_photo"
                        style={_catalogScrollPlacemarkRowPhotoWidth ? {width:_catalogScrollPlacemarkRowPhotoWidth + 'px'} : {}}
                        onClick={this.goTo} data-url={_placemarkUrl}>
                        {_photoInsert}
                    </div>
                    <div className="catalog_scroll_placemark_row_content"
                        style={_catalogScrollPlacemarkRowContentWidth ? {width:_catalogScrollPlacemarkRowContentWidth + 'px'} : {}}>
                        {data['title']&&
                        <div className="catalog_scroll_placemark_row_content_title"><a onClick={this.goTo} data-url={_placemarkUrl}>{data['title']}</a></div>
                        }
                        <div className="catalog_scroll_placemark_row_content_description">
                            <div className="catalog_scroll_placemark_row_content_comment">{data['comment']}</div>
                            <div className="catalog_scroll_placemark_row_content_adress" dangerouslySetInnerHTML={{__html:data['formatted_address']}}></div>
                            <div className="catalog_scroll_placemark_row_content_category">{_categories}</div>
                            <div className="clear"></div>
                            <div className="catalog_scroll_placemark_row_content_map_lnk"><a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + data['id']}><img src="/img/map_240.png" style={{'marginLeft':'1px', display: 'inline-block', width: '24px', 'verticalAlign': 'bottom', 'marginRight': '5px'}}/>{this.props.redux.linkToMapText}</a></div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div className="line_under"></div>
                </div>);
    }

    render() {

        if (this.props.redux.placemarks && this.props.redux.placemarks.length) {

            this.isRetry = false;

            let _placemarks = this.props.redux.placemarks;
            let _newPlacemarksList = [];

            for (let _index in _placemarks) {
                let _item = _placemarks[_index];

                _newPlacemarksList.push(this.getItem(_item));
            }

            // If fetching is duplicated
            if (this.idNext == this.idCurrent) {
                this.isRetry = true;
            }

            // If nothing to fetch - 0 found
            if (!this.idCurrent && !this.idNext){
                alert('nothing to fetch - 0 found TODO');////ATTENTION - обратите внимание   my_get_message('<?php echo(my_pass_through(@self::trace('warning/search/empty_result'))); ?>', 'warning');
            }

            this.idNext = this.idCurrent;

            if (!_newPlacemarksList.length) {
                // If not one left
                this.block = true;
            } else {
                if (this.isRetry === false) {
                    this.list = this.list.concat(_newPlacemarksList);
                }
                this.block = false;
            }
        }

        return (
                <React.Fragment>
                    <BrowserView>
                        {this.list}
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
            placemarks:state.backgroundData['scroll_data'],
            linkToMapText:state.staticData['catalog_placemark_link_to_map_text'],
        }
    };
}

export default connect(mapStateToProps,{updateStyleData:UpdateStyleData, removeBackgroundData:RemoveBackgroundData})(withRouter(PlacemarksList))