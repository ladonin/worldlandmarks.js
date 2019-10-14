/*
 * File src/app/controllers/catalog/actions/State.js
 * import CatalogState from 'src/app/controllers/catalog/actions/State';
 *
 * State action component for Catalog controller
 */

import React, { Component } from 'react';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {GetState, MapDispatchToProps} from 'src/app/parents/Action';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';

// Components
import PhotoAlbum from 'src/app/common/blocks/catalog/PhotoAlbum';
import CssTransition from 'src/app/common/CssTransition';
import PlacemarksList from 'src/app/common/blocks/PlacemarksList';
import Bottom from 'src/app/common/blocks/Bottom';

class CatalogState extends Action {

    constructor() {
        super();
    }

    render() {
        if (!this.props.redux) {
            return null;
        }

        return (
                <CssTransition>
                    <div id="catalog_country_state_block">
                        {this.props.redux.staticData['is_admin'] === true &&
                            <div style={{'margin-bottom':'10px', 'text-align':'right'}}><a style={{color:'#f00', 'font-size':'14px'}} href={'/admin/_e5b7rnijjrnrnnb_export_photos?code_type=country&country_code='+this.props.redux.actionData['country_code']}>[скачать архив фотографий данной страны]</a></div>
                        }
                        <PhotoAlbum/>
                        <MobileView>
                            <div className="h_10px"></div>
                        </MobileView>
                    </div>
                    <PlacemarksList
                        data={{
                            isSearch: 1,
                            country: this.props.match.params[Consts.URL_VAR_2_NAME],
                            state: this.props.match.params[Consts.URL_VAR_3_NAME]
                        }}
                        photoWidth="290"
                        photoHeight="217"
                        bottomComponent={Bottom}
                    />
                </CssTransition>
                );
    }
}

function MapStateToProps(state) {
    return GetState(state, Consts.CONTROLLER_NAME_CATALOG, Consts.ACTION_NAME_STATE)
}

export default connect(MapStateToProps,MapDispatchToProps)(withRouter(CatalogState))