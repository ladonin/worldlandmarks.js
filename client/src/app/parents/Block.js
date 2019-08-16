/*
 * File src/app/parents/Block.js
 * import Block from 'src/app/parents/Block';
 *
 * Common block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';


class Block extends Component {
    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
    }

    /*
     * NOTE: if you want to use goTo you must wrap your component with a withRouter() HOC
     */
    goTo(event) {
        this.props.history.push(event.target.closest("[data-url]").dataset.url);
    }
}

export default Block;