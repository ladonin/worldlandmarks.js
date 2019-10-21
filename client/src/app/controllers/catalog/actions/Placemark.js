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
import BaseFunctions from 'src/functions/BaseFunctions';

// Components
import CssTransition from 'src/app/common/CssTransition';
import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
import PlacemarksSublist from 'src/app/common/blocks/PlacemarksSublist';
import Bottom from 'src/app/common/blocks/Bottom';
import PlacemarkAdminLinks from 'src/app/common/PlacemarkAdminLinks';
import PhotosList from 'src/app/common/PhotosList';


class CatalogPlacemark extends Action {

    constructor() {
        super();
    }

    componentDidUpdate(){
        super.componentDidUpdate();
        BaseFunctions.scrollTop(window);
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        return (
<React.Fragment>
                    {this.getHeader()}
            <CssTransition>
                <div className="catalog_placemark">
                    {this.props.redux.actionData.data['title']&&
                        <React.Fragment>
                            <h3 className="catalog_placemark_title">
                                {this.props.redux.actionData.data['title']}
                            </h3>
                        </React.Fragment>}

                    <PlacemarkAdminLinks
                        isAdmin={this.props.redux.staticData['is_admin']}
                        id={this.props.redux.actionData.data['id']}
                        category={this.props.redux.actionData.data['category']}/>

                    <PlacemarkCaregories subcategories={this.props.redux.actionData.data['subcategories']} category={this.props.redux.actionData.data['category']}/>
                    <div className="catalog_placemark_map_lnk">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + this.props.redux.actionData.data['id']}><img
                            src="/img/map_240.png"
                            style={{
                                display:'inline-block',
                                width:'27px',
                                verticalAlign:'bottom',
                                marginRight:'5px'
                            }}/>{this.props.redux.staticData['catalog_placemark_link_to_map_text']}</a>
                    </div>
                    <div className="catalog_placemark_address" dangerouslySetInnerHTML={{__html:'<span>'+this.props.redux.actionData.data['formatted_address_with_route']+'</span>'}}></div>
                    <div className="catalog_placemark_photo">
                        <PhotosList photos={this.props.redux.actionData.data['photos']}/>
                    </div>
                    <div
                        className="catalog_placemark_comment"
                        id="placemark_comment"
                        dangerouslySetInnerHTML={{__html:this.props.redux.actionData.data['comment']}}>
                    </div>
                    <div className="catalog_placemark_map_lnk">
                        <a onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_MAP + '/' + this.props.redux.actionData.data['id']}><img
                            src="/img/map_240.png"
                            style={{
                                display:'inline-block',
                                width:'27px',
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
                    {this.props.redux.actionData.data['another_placemarks'] &&<div class="another_placemarks"><PlacemarksSublist
                        placemarks = {this.props.redux.actionData.data['another_placemarks'].placemarks}
                        isMap = {false}
                        imageWidth = {this.props.redux.actionData.data['another_placemarks'].data.image_width}
                        imageHeight = {this.props.redux.actionData.data['another_placemarks'].data.image_height}
                        ident = {this.props.redux.actionData.data['another_placemarks'].data.ident}
                        title = {this.props.redux.actionData.data['another_placemarks'].data.title}
                    /></div>}
                </div>
                <Bottom/>
            </CssTransition>
            </React.Fragment>
        );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_PLACEMARK)
}

export default connect(MapStateToProps,MapDispatchToProps)(withRouter(CatalogPlacemark))