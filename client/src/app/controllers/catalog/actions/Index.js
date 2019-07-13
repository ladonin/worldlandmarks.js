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
import Hat from 'src/app/common/blocks/Hat';

//Css
import "./Css";

class CatalogIndex extends AbstractAction {

    constructor() {
        super();
    }

    render() {
        return (
                <React.Fragment>

                </React.Fragment>
                );
    }
}
export default CatalogIndex;
