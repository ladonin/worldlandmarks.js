/*
 * File src/app/controllers/catalog/actions/Index.js
 * import MainIndex from 'src/app/controllers/catalog/actions/Index';
 *
 * Index action component for Catalog controller
 */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AbstractAction from 'src/app/abstract/AbstractAction';

// Components
import CountriesList from 'src/app/common/blocks/catalog/index/CountriesList';

//Css
import "./Css";

class CatalogIndex extends AbstractAction {

    constructor() {
        super();
    }

    render() {


        return (
                <React.Fragment>
                    <CountriesList/>
                </React.Fragment>
                );
    }
}



export default CatalogIndex;
