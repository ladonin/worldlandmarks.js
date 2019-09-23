/*
 * File src/app/common/blocks/map/Placemark.js
 * import MapPlacemark from 'src/app/common/blocks/map/Placemark';
 *
 * Placemark block component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import MapModule from 'src/modules/Map';
import Consts from 'src/settings/Constants';


import Block from 'src/app/parents/Block';

import PlacemarksList from 'src/app/common/blocks/map/PlacemarksList';
import PlacemarkAdminLinks from 'src/app/common/PlacemarkAdminLinks';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
import PhotosList from 'src/app/common/PhotosList';
import PlacemarksSublist from 'src/app/common/blocks/PlacemarksSublist';
import {RemoveBackgroundData} from 'src/app/parents/Common';

class MapPlacemark extends Block {
    constructor() {
        super();
    }
    componentDidUpdate() {
        if (typeof this.props.redux.atCluster === 'undefined') {
            MapModule.preparePlacemarkContentDimensions(this.props.redux.atCluster);
        }
    }

    componentWillUnmount(){
        this.props.removeBackgroundData('data');
    }

    render() {



        let _content = '';
        let _hidden = 'hidden';

        if (this.props.redux.data) {
            _hidden = '';
            let _id = this.props.redux.data.id;

            MapModule.saveInPlacemarksData(this.props.redux.data);
            MapModule.addAndClustering();

            //подсвечиваем новую метку

            MapModule.setCenter(_id);
            MapModule.setZoom('whereAmI');


            _content =
                    <React.Fragment>
                        {this.props.redux.data['title'] && <div className="header_1">{this.props.redux.data['title']}</div>}
                        <PlacemarkAdminLinks
                            isAdmin={this.props.redux.staticData['is_admin']}
                            id={this.props.redux.data['id']}
                            category={this.props.redux.data['category']}/>
                        <div className="map_placemark_categories"><PlacemarkCaregories subcategories={this.props.redux.data['subcategories']} category={this.props.redux.data['category']}/></div>
                        <div className="link_1">
                            <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + this.props.redux.data['country_code'] + (this.props.redux.data['state_code'] === 'undefined' ? '' : ('/' + this.props.redux.data['state_code'])) + '/' + this.props.redux.data['id']}><img
                                    src="/img/catalog_240.png"
                                    style={{
                                            display: 'inline-block',
                                            width: '25px',
                                            verticalAlign: 'bottom',
                                            marginRight: '5px'
                                        }}/>{this.props.redux.staticData['map_placemark_link_to_catalog_text']}</a>
                        </div>
                        <div className="address_1" dangerouslySetInnerHTML={{__html: '<span>' + this.props.redux.data['formatted_address_with_route'] + '</span>'}}></div>
                        <PhotosList scrollBlockSelector='#placemark_content' photos={this.props.redux.data['photos']}/>
                        <div
                            className="text_1 placemark_comment"
                            id="placemark_comment"
                            dangerouslySetInnerHTML={{__html: this.props.redux.data['comment']}}>
                        </div>
                        <div className="link_1">
                            <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + this.props.redux.data['country_code'] + (this.props.redux.data['state_code'] === 'undefined' ? '' : ('/' + this.props.redux.data['state_code'])) + '/' + this.props.redux.data['id']}><img
                                    src="/img/catalog_240.png"
                                    style={{
                                            display: 'inline-block',
                                            width: '25px',
                                            verticalAlign: 'bottom',
                                            marginRight: '5px'
                                        }}/>{this.props.redux.staticData['map_placemark_link_to_catalog_text']}</a>
                        </div>
                        {this.props.redux.data['relevant_placemarks'] &&
                        <PlacemarksSublist
                            placemarks = {this.props.redux.data['relevant_placemarks'].placemarks}
                            isMap = {false}
                            imageWidth = {this.props.redux.data['relevant_placemarks'].data.image_width}
                            imageHeight = {this.props.redux.data['relevant_placemarks'].data.image_height}
                            ident = {this.props.redux.data['relevant_placemarks'].data.ident}
                            title = {this.props.redux.data['relevant_placemarks'].data.title}
                            />}
                        <PlacemarksSublist
                            placemarks = {this.props.redux.data['another_placemarks'].placemarks}
                            isMap = {false}
                            imageWidth = {this.props.redux.data['another_placemarks'].data.image_width}
                            imageHeight = {this.props.redux.data['another_placemarks'].data.image_height}
                            ident = {this.props.redux.data['another_placemarks'].data.ident}
                            title = {this.props.redux.data['another_placemarks'].data.title}
                            />;
                        </React.Fragment>
        }

        return (
                <React.Fragment>
                    <BrowserView>
                        <div id="placemark" class={_hidden}>
                            <div id="placemark_close_side_1"></div>
                            <div id="placemark_block">
                                <div id="placemark_content">
                                    <div id="placemark_content_block">{_content}</div>
                                </div>
                                <div id="placemark_list"><div id="placemark_list_block"><PlacemarksList/></div></div>
                            </div>
                            <div id="placemark_close_side_2"></div>
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
        redux: {
            atCluster: state.backgroundData['data'] ? state.backgroundData['data'].atCluster : undefined,
            data: state.backgroundData['data'],
            staticData: state.staticData
        }
    };
}

export default connect(mapStateToProps, {removeBackgroundData: RemoveBackgroundData})(withRouter(MapPlacemark))