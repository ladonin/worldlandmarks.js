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
import ImageDimensions from 'src/modules/ImageDimensions';
import BaseFunctions from 'src/functions/BaseFunctions';
import ConfigRestrictions from 'src/../../server/common/settings/Restrictions';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';

import CategoryViewer from 'src/modules/CategoryViewer';
import {UpdateStyleData, RemoveBackgroundData} from 'src/app/parents/Common';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';

import Block from 'src/app/parents/Block';
import Socket from 'src/app/socket/Socket';
import Events from 'src/modules/Events';

import CroppedPhoto from 'src/app/common/blocks/CroppedPhoto';

class PlacemarksList extends Block {
    constructor() {
        super();

        this.onScroll = this.onScroll.bind(this);
        this.onSearch = this.onSearch.bind(this);

        this.init = this.init.bind(this);

        this.list = [];

        // Deprecate/allow getting data
        // Temporary blocking during current fetching
        this.block = false;

        this.isRetry = false;
        this.idCurrent = 0;
        this.idNext = 0;

        this.correction = 200;
        this.searchData = {};
        this.photoWidth = 340;
        this.photoHeight = 260;
        this.currentState = {};
        this.shouldBottomUpdate = 1;
    }

    reset(){
        this.list = [];
        this.block = false;
        this.isRetry = false;
        this.idCurrent = 0;
        this.idNext = 0;
    }


    shouldComponentUpdate(nextProps, nextState){
        if (!nextProps.redux.placemarks
                || CommonBaseFunctions.areObjectsEqual(this.currentState,nextProps.redux.placemarks)) {
            return false;
        }
        this.currentState = CommonBaseFunctions.clone(nextProps.redux.placemarks);
        return true;
    }

    componentWillUnmount(){
        Events.remove('scroll', this.onScroll);
        Events.remove('search', this.onSearch);
        this.props.removeBackgroundData('placemarksData');
    }

    componentDidMount(){
        Events.add('scroll', this.onScroll);
        Events.add('search', this.onSearch);
        this.init();
        this.getList();
    }

    getList(){
        this.block = true;
        Socket.backgroundQuery(
            Consts.CONTROLLER_NAME_CATALOG,
            'get_placemarks_list',
            {
                [Consts.ID_VAR_NAME]:this.idNext,
                [Consts.REQUEST_FORM_DATA]:this.props.data ? this.props.data : this.searchData
            })
    }

    onSearch(e){
        this.reset();
        this.shouldBottomUpdate++;
        this.searchData = {...e.detail, isSearch:1};
        this.props.removeBackgroundData('placemarksData');
        this.getList();
    }

    onScroll(){
        if ((BaseFunctions.getHeight(window) + BaseFunctions.getScrollTop(window) + this.correction >= BaseFunctions.getHeight(document)) && !this.block) {
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

        let _photoInsert;
        let _catalogScrollPlacemarkRowContentWidth;
        let _catalogScrollPlacemarkRowPhotoWidth;


        if (IsMobile) {
            _photoInsert = <img src={_photo['dir'] + ImageDimensions.getPrefix(BaseFunctions.getWidth(window), 0) + _photo['name']} width={BaseFunctions.getWidth(window) + 'px'}/>;
        } else {

            _photoInsert = <CroppedPhoto
                blockWidth = {this.photoWidth}
                blockHeight ={this.photoHeight}
                photoWidth = {_photo['width']}
                photoHeight = {_photo['height']}
                photoSrc = {_photo['dir'] + "6_" + _photo['name']}
            />;

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
                            <div className="catalog_scroll_placemark_row_content_category">
                                <PlacemarkCaregories subcategories={data['subcategories']} category={data['category']}/>
                            </div>
                            <div className="clear"></div>
                            <div className="catalog_scroll_placemark_row_content_map_lnk"><a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + data['id']}><img src="/img/map_240.png" style={{'marginLeft':'1px', display: 'inline-block', width: '24px', 'verticalAlign': 'bottom', 'marginRight': '5px'}}/>{this.props.redux.linkToMapText}</a></div>
                        </div>
                    </div>
                    <div className="clear"></div>
                    <div className="line_under"></div>
                </div>);
    }

    render() {
        if (!this.props.redux.placemarks) {
            return null;
        }

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
        let _notFound ='';
        if (!this.idCurrent && !this.idNext){
            _notFound = <div className="catalog_scroll_placemark_row">
                            <div className='padding_10'>{this.props.redux.nothing_found}</div>
                        </div>;
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

        return (
                <React.Fragment>
                    <BrowserView>
                        {this.list}{_notFound}
                    </BrowserView>
                    <MobileView>
                        TODO MOBILE ArticlesList
                    </MobileView>
                    {this.props.bottomComponent&&<this.props.bottomComponent key={this.shouldBottomUpdate}/>}
                </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

    return {
        redux:{
            placemarks:state.backgroundData['placemarksData'],
            linkToMapText:state.staticData['catalog_placemark_link_to_map_text'],
            nothing_found:state.staticData['nothing_found'],
        }
    };
}

export default connect(mapStateToProps,{updateStyleData:UpdateStyleData, removeBackgroundData:RemoveBackgroundData})(withRouter(PlacemarksList))