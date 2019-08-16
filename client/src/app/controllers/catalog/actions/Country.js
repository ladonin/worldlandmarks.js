/*
 * File src/app/controllers/catalog/actions/Country.js
 * import MainIndex from 'src/app/controllers/catalog/actions/Country';
 *
 * Country action component for Catalog controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Link } from 'react-router-dom';
import Action, {MapStateToProps} from 'src/app/parents/Action';

// Components


class CatalogCountry extends Action {

    constructor() {
        super();
    }

    render() {


        return (
                <React.Fragment>
                    11111111111111111111
                </React.Fragment>
                );
    }
}


export default connect(MapStateToProps)(withRouter(CatalogCountry))

