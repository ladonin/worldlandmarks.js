/*
 * File src/app/common/blocks/map/Placemark.js
 * import MapPlacemark from 'src/app/common/blocks/map/Placemark';
 *
 * Placemark block component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView,isMobile} from "react-device-detect";

import MapModule from 'src/modules/Map';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import Events from 'src/modules/Events';

import Block from 'src/app/parents/Block';

import PlacemarksList from 'src/app/common/blocks/map/PlacemarksList';
import PlacemarkAdminLinks from 'src/app/common/PlacemarkAdminLinks';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
import PhotosList from 'src/app/common/PhotosList';
import PlacemarksSublist from 'src/app/common/blocks/PlacemarksSublist';
import {RemoveBackgroundData} from 'src/app/parents/Common';
import CssTransition from 'src/app/common/CssTransition';
import PlacemarkButtons from 'src/app/common/blocks/map/PlacemarkButtons';

class MapPlacemark extends Block {

    constructor() {
        super();
        this.close = this.close.bind(this);
        this.hide = this.hide.bind(this);
        this.show = this.show.bind(this);
        this.state = {hidden:false}
        this.placemarkButtonsComponent = '';
        MapModule.setPlacemarkComponentRef(this);
    }


    shouldComponentUpdate(nextProps, nextState){
        if (this.state.hidden !== nextState.hidden) {
            return true;
        }
        return super.shouldComponentUpdate(nextProps, nextState);
    }



    componentDidUpdate() {
        if (typeof this.props.redux.atCluster !== 'undefined') {
            MapModule.preparePlacemarkContentDimensions(this.props.redux.atCluster, this.props.redux.data.id);
        }
    }

    componentWillUnmount(){
        this.props.removeBackgroundData('map_placemarkData');
    }

    close(){
        this.props.removeBackgroundData('map_placemarkData');
        // Show panel tools button
        Events.dispatch(Consts.EVENT_SHOW_TOOLS_PANEL_BUTTON);
        // Return to view state and then close
        this.show();
        MapModule.resumeBunchFillingTimer();

    }
    hide(){;
        this.setState({hidden:true});
    }
    show(){
        if (this.state.hidden === true) {
            this.setState({hidden:false});
        }
    }

    render() {

        let _id = null;
        let ContentComponent = () => null;
        let _hidden = 'hidden';
        let PlacemarksRightListComponent = () => null;

        if (this.props.redux.data) {
            _id = this.props.redux.data.id;
            this.placemarkButtonsComponent =
                    this.placemarkButtonsComponent === ''
                    ? <PlacemarkButtons close={this.close} hide={this.hide} show={this.show}/>
                    : this.placemarkButtonsComponent;

            PlacemarksRightListComponent = () => <PlacemarksList selectedId={_id}/>;

            if (this.state.hidden === false) {
                _hidden = '';


                MapModule.saveInPlacemarksData(this.props.redux.data);
                MapModule.addAndClustering();
                MapModule.suspendBunchFillingTimer();

                //подсвечиваем новую метку

                if (!1) {
                    MapModule.setCenter(_id);
                    MapModule.setZoom('whereAmI');
                }

                MapModule.actionsAfterShowPointData(_id, this.props.redux.atCluster)
                //MapModule.setAvailableToChange(this.props.redux.staticData['is_available_to_change']);

                let _photoWidth;
                let _photoPrefix;
                if (this.props.redux.atCluster) {
                    _photoWidth = MapModule.getContentImageWithClusterWidth();
                    _photoPrefix = MapModule.getContentImageWithClusterPrefix();
                } else {
                    _photoWidth = MapModule.getContentImageWithoutClusterWidth();
                    _photoPrefix = MapModule.getContentImageWithoutClusterPrefix();
                }
                ContentComponent = () => (
                        <CssTransition>
                            {this.props.redux.data['title'] && <div className="header_1">{this.props.redux.data['title']}</div>}
                            <PlacemarkAdminLinks
                                isAdmin={this.props.redux.staticData['is_admin']}
                                id={this.props.redux.data['id']}
                                category={this.props.redux.data['category']}/>
                            <div className="map_placemark_categories"><PlacemarkCaregories subcategories={this.props.redux.data['subcategories']} category={this.props.redux.data['category']}/></div>
                            <div className="link_1">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + this.props.redux.data['country_code'] + (this.props.redux.data['state_code'] === 'undefined' ? '' : ('/' + this.props.redux.data['state_code'])) + '/' + this.props.redux.data['id']}>
                                    <div className='mapLinkToCatalog'><img src="/img/catalog_240.png"/></div>
                                    {this.props.redux.staticData['map_placemark_link_to_catalog_text']}
                                </a>
                            </div>
                            <div className="address_1" dangerouslySetInnerHTML={{__html: '<span>' + this.props.redux.data['formatted_address_with_route'] + '</span>'}}></div>

                            <PhotosList prefix={_photoPrefix} width={_photoWidth} scrollBlockSelector='#placemark_content' photos={this.props.redux.data['photos']}/>
                            <div
                                className="text_1 placemark_comment"
                                id="placemark_comment"
                                dangerouslySetInnerHTML={{__html: this.props.redux.data['comment']}}>
                            </div>
                            <div className="link_1" id={"placemark_link_" + _id}>{this.props.redux.staticData['map_placemark_link_text']}<span  onClick = {(e)=>{BaseFunctions.highlight(e.target)}}>{Consts.DOMAIN + '/' + Consts.CONTROLLER_NAME_MAP + '/' + _id}</span></div>
                            <div className="link_1">
                                <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/' + this.props.redux.data['country_code'] + (this.props.redux.data['state_code'] === 'undefined' ? '' : ('/' + this.props.redux.data['state_code'])) + '/' + this.props.redux.data['id']}>
                                    <div className='mapLinkToCatalog'><img src="/img/catalog_240.png"/></div>
                                    {this.props.redux.staticData['map_placemark_link_to_catalog_text']}
                                </a>
                            </div>
                            {this.props.redux.data['relevant_placemarks'] &&
                            <PlacemarksSublist
                                placemarks = {this.props.redux.data['relevant_placemarks'].placemarks}
                                isMap = {true}
                                imageWidth = {this.props.redux.data['relevant_placemarks'].data.image_width}
                                imageHeight = {this.props.redux.data['relevant_placemarks'].data.image_height}
                                ident = {this.props.redux.data['relevant_placemarks'].data.ident}
                                title = {this.props.redux.data['relevant_placemarks'].data.title}
                                atCluster={this.props.redux.atCluster}
                                />}
                            {this.props.redux.data['another_placemarks'] &&
                            <PlacemarksSublist
                                placemarks = {this.props.redux.data['another_placemarks'].placemarks}
                                isMap = {true}
                                imageWidth = {this.props.redux.data['another_placemarks'].data.image_width}
                                imageHeight = {this.props.redux.data['another_placemarks'].data.image_height}
                                ident = {this.props.redux.data['another_placemarks'].data.ident}
                                title = {this.props.redux.data['another_placemarks'].data.title}
                                atCluster={this.props.redux.atCluster}
                                />}
                            </CssTransition>);
            }
        } else {
            MapModule.actionsAfterClosePointData();
            this.placemarkButtonsComponent = '';
        }

        return (
                <React.Fragment>
                    <div id="placemark" className={_hidden}>
                        <div id="placemark_close_side_1" onClick={this.close}></div>
                        <div id="placemark_block">
                            <div id="placemark_content">
                                <div id="placemark_content_block"><ContentComponent/></div>
                            </div>
                            <div id="placemark_list"><div id="placemark_list_block"><PlacemarksRightListComponent/></div></div>
                        </div>
                        <div id="placemark_close_side_2" onClick={this.close}></div>
                    </div>
                    {this.placemarkButtonsComponent}
                </React.Fragment>
        );
    }
}

function mapStateToProps(state) {

    return {
        redux: {
            atCluster: state.backgroundData['map_placemarkData'] ? state.backgroundData['map_placemarkData'].atCluster : undefined,
            data: state.backgroundData['map_placemarkData'],
            staticData: state.staticData
        }
    };
}

export default connect(mapStateToProps, {removeBackgroundData: RemoveBackgroundData})(withRouter(MapPlacemark))