/*
 * File src/app/common/blocks/map/PlacemarksList.js
 * import PlacemarksList from 'src/app/common/blocks/map/PlacemarksList';
 *
 * PlacemarksList component for map controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Events from 'src/modules/Events';
import MapModule from 'src/modules/Map';

import Consts from 'src/settings/Constants';


class PlacemarksList extends Component {
    constructor() {
        super();
        this.onChangeSelected = this.onChangeSelected.bind(this);
        this.state = {};
    }

    componentWillUnmount(){
        Events.remove('mapPlacemarksListChangeSelected', this.onChangeSelected);
    }

    componentDidMount(){
        Events.add('mapPlacemarksListChangeSelected', this.onChangeSelected);
    }

    onChangeSelected(e){

        this.setState({
          selected: e.detail.id
        });
    }

    render() {

        if (!this.state.selected) {
            return null;
        }

        let _placemarks = MapModule.getPlacemarksRightList();



        return (
                <React.Fragment>
                    <BrowserView>

                    _placemarks



                    </BrowserView>
                    <MobileView>
                        TODO MOBILE ArticlesList
                    </MobileView>
                </React.Fragment>
        );
    }
}

export default PlacemarksList