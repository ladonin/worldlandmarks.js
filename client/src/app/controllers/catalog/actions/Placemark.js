/*
 * File src/app/controllers/catalog/actions/Placemark.js
 * import CatalogPlacemark from 'src/app/controllers/catalog/actions/Placemark';
 *
 * Placemark action component for Catalog controller
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';
import ConfigRestrictions from 'src/../../server/common/settings/Restrictions';
import BaseFunctions from 'src/functions/BaseFunctions';
import ImageDimensions from 'src/modules/ImageDimensions';

// Components
import PhotoAlbum from 'src/app/common/blocks/catalog/PhotoAlbum';
import CssTransition from 'src/app/common/CssTransition';
import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
import PhotosNavigator from 'src/app/common/blocks/catalog/placemark/PhotosNavigator';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
import PlacemarksSublist from 'src/app/common/blocks/PlacemarksSublist';
import Bottom from 'src/app/common/blocks/Bottom';

class CatalogPlacemark extends Action {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        let _photosList = [];
        for (let _index in this.props.redux.actionData.data['photos']) {
            let _number = parseInt(_index);
            let _photo =  this.props.redux.actionData.data['photos'][_index];
            let _dimentions = ImageDimensions.prepareContentImageDimentions(
                    _photo['width'],
                    _photo['height'],
                    ConfigRestrictions['desctop_content_width'],
                    (BaseFunctions.getHeight(window) - 100));

            _photosList.push(
                <React.Fragment>
                    <div className="placemark_photo_navigator" id={'placemark_photo_'+_number+'_navigator'}>
                        <PhotosNavigator scrollBlockIdName='body, html' photosCount={this.props.redux.actionData.data['photos'].length} contentBlockIdName='catalog_placemark_comment' number={_number}/>
                    </div>
                    <a href={_photo['dir'] + '1_' + _photo['name']}><img
                        style={{
                            width: _dimentions.width + 'px',
                            height: _dimentions.height + 'px'
                        }}
                        id={'catalog_placemark_photo_'+_number}
                        src={_photo['dir'] + '10_' + _photo['name']}
                        alt={this.props.redux.actionData.data['title']}/></a>
                </React.Fragment>);
        }

        return (
            <CssTransition>
                <BrowserView>
                    <div className="catalog_placemark">
                        {this.props.redux.actionData.data['title']&&
                            <React.Fragment>
                                <h3 className="catalog_placemark_title">
                                    {this.props.redux.actionData.data['title']}
                                </h3>
                            </React.Fragment>}

                        {this.props.redux.staticData['is_admin']&&
                            <React.Fragment>
                                <div style={{margin:'10px 20px', textAlign:'left'}}><a target="_blank" style={{color:'#f00'}} href={"/admin/update_placemark_adress?map_data_id="+this.props.redux.actionData.data['id']}>[поменять адрес]</a></div>
                                <div style={{margin:'10px 20px', textAlign:'left'}}><a target="_blank" style={{color:'#f00'}} href={"/admin/update_placemark_categories?map_data_id="+this.props.redux.actionData.data['id']+"&category_id="+this.props.redux.actionData.data['category']}>[управление категориями и релевантностью]</a></div>
                                <div style={{margin:'10px 20px', textAlign:'left'}}><a target="_blank" style={{color:'#f00'}} href={"/admin/update_placemark_seo?map_data_id="+this.props.redux.actionData.data['id']+"&category_id="+this.props.redux.actionData.data['category']}>[управление SEO]</a></div>
                                <div style={{margin:'10px 20px', textAlign:'left'}}><a style={{color:'#f00'}} href={"/admin/export_placemarks?id="+this.props.redux.actionData.data['id']}>[скачать архив]</a></div>
                            </React.Fragment>}
                        <PlacemarkCaregories subcategories={this.props.redux.actionData.data['subcategories']} category={this.props.redux.actionData.data['category']}/>
                        <div className="catalog_placemark_map_lnk">
                            <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + this.props.redux.actionData.data['id']}><img
                                src="/img/map_240.png"
                                style={{
                                    display:'inline-block',
                                    width:'25px',
                                    verticalAlign:'bottom',
                                    marginRight:'5px'
                                }}/>{this.props.redux.staticData['catalog_placemark_link_to_map_text']}</a>
                        </div>
                        <div className="catalog_placemark_address" dangerouslySetInnerHTML={{__html:'<span>'+this.props.redux.actionData.data['formatted_address_with_route']+'</span>'}}>

                        </div>
                        <div className="catalog_placemark_photo">
                            {_photosList}
                        </div>
                        <div
                            className="catalog_placemark_comment"
                            id="catalog_placemark_comment"
                            dangerouslySetInnerHTML={{__html:this.props.redux.actionData.data['comment']}}>
                        </div>
                        <div className="catalog_placemark_map_lnk">
                            <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + this.props.redux.actionData.data['id']}><img
                                src="/img/map_240.png"
                                style={{
                                    display:'inline-block',
                                    width:'25px',
                                    verticalAlign:'bottom',
                                    marginRight:'5px'
                                }}/>{this.props.redux.staticData['catalog_placemark_link_to_map_text']}</a>
                        </div>
                        {this.props.redux.actionData.data['relevant_placemarks']&&
                        <PlacemarksSublist
                            placemarks = {this.props.redux.actionData.data['relevant_placemarks'].placemarks}
                            isMap = {false}
                            imageWidth = {this.props.redux.actionData.data['relevant_placemarks'].data.image_width}
                            imageHeight = {this.props.redux.actionData.data['relevant_placemarks'].data.image_height}
                            ident = {this.props.redux.actionData.data['relevant_placemarks'].data.ident}
                            title = {this.props.redux.actionData.data['relevant_placemarks'].data.title}
                        />}
                        <PlacemarksSublist
                            placemarks = {this.props.redux.actionData.data['another_placemarks'].placemarks}
                            isMap = {false}
                            imageWidth = {this.props.redux.actionData.data['another_placemarks'].data.image_width}
                            imageHeight = {this.props.redux.actionData.data['another_placemarks'].data.image_height}
                            ident = {this.props.redux.actionData.data['another_placemarks'].data.ident}
                            title = {this.props.redux.actionData.data['another_placemarks'].data.title}
                        />
                    </div>

                </BrowserView>
                <MobileView>
                  TODO MOBILE CatalogIndex
                </MobileView>
                <Bottom/>
            </CssTransition>
        );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_PLACEMARK)
}

export default connect(MapStateToProps,MapDispatchToProps)(withRouter(CatalogPlacemark))