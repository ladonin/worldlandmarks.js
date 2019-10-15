/*
 * File src/app/common/blocks/map/PlacemarksList.js
 * import PlacemarksList from 'src/app/common/blocks/map/PlacemarksList';
 *
 * PlacemarksList component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import MapModule from 'src/modules/Map';
import CroppedPhoto from 'src/app/common/blocks/CroppedPhoto';

import Consts from 'src/settings/Constants';


class PlacemarksList extends Component {

    render() {

        let _placemarksRightList = MapModule.getPlacemarksRightList();
        let _placemarks = MapModule.getPlacemarks();

        let _list = [];

        for (let _key in _placemarksRightList) {
            let _placemarkId = _placemarksRightList[_key];
            let _photo = _placemarks['id_'+_placemarkId]['data']['photos'][0];
            _list.push(
                    <React.Fragment>
                        <div className={"placemark_list_element" + (this.props.selectedId === _placemarkId ? ' placemark_list_element_selected' :'')} id={"placemark_list_element_" + _placemarkId}
                        onClick={()=>{MapModule.placemarkPreview(_placemarkId, true)}}>
                            <CroppedPhoto
                                blockWidth = {MapModule.getClusterListImageWidth()}
                                blockHeight ={MapModule.getClusterListImageHeight()}
                                photoWidth = {_photo['width']}
                                photoHeight = {_photo['height']}
                                photoSrc = {_photo['dir'] + MapModule.getClusterListImagePrefix() + _photo['name']}
                            />
                            {_placemarks['id_'+_placemarkId]['data']['title'] && <div className="placemark_list_element_title">{_placemarks['id_'+_placemarkId]['data']['title']}</div>}
                        </div>
                    </React.Fragment>);
        }


        const List = ()=> _list;

        return (
                <React.Fragment>
                    <List/>
                </React.Fragment>
        );
    }
}

export default PlacemarksList