/*
 * File src/app/controllers/catalog/Catalog.js
 * import Catalog from 'src/app/controllers/catalog/Catalog';
 *
 * Catalog controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/Router';

// Action components
import CatalogIndex from 'src/app/controllers/catalog/actions/Index';
import CatalogCountry from 'src/app/controllers/catalog/actions/Country';
import CatalogState from 'src/app/controllers/catalog/actions/State';
import CatalogPlacemark from 'src/app/controllers/catalog/actions/Placemark';
import CatalogSearch from 'src/app/controllers/catalog/actions/Search';

import { withRouter } from 'react-router-dom';

class Catalog extends Controller {

    constructor() {
        super();
    }

    render() {
        let _actionName = this.getActionName();
        let _actionComponent;
        switch (_actionName) {
            case Consts.ACTION_NAME_INDEX:
                _actionComponent = <CatalogIndex/>; break;
            case Consts.ACTION_NAME_COUNTRY:
                _actionComponent = <CatalogCountry/>; break;
            case Consts.ACTION_NAME_STATE:
                _actionComponent = <CatalogState/>; break;
            case Consts.ACTION_NAME_PLACEMARK:
                _actionComponent = <CatalogPlacemark/>; break;
            case Consts.ACTION_NAME_SEARCH:
                _actionComponent = <CatalogSearch/>; break;
            default:
                _actionComponent = <CatalogIndex/>;
        }

        return <React.Fragment>
        {_actionComponent}
        </React.Fragment>;
    }
}

export default connect()(withRouter(Catalog))