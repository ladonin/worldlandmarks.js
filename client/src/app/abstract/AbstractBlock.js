/*
 * File src/app/abstract/AbstractBlock.js
 * import AbstractBlock from 'src/app/abstract/AbstractBlock';
 *
 * Common block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


class AbstractBlock extends Component {
    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
    }

    /*
     * NOTE: if you want to use goTo you must wrap your component with a withRouter() HOC
     */
    goTo(event) {
        this.props.history.push(event.target.dataset.url);
    }
}

export default AbstractBlock;