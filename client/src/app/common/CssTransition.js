/*
 * File src/app/common/CssTransition.js
 * import CssTransition from 'src/app/common/CssTransition';
 *
 * CssTransition component
 */

import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group'


export default function CssTransition(props) {
    return (
        <CSSTransitionGroup
            transitionName="react-transition"
            transitionAppear={true}
            transitionAppearTimeout={500}
            transitionEnterTimeout={500}
            transitionLeaveTimeout={500}
            >
            {props.children}
        </CSSTransitionGroup>
    );
}