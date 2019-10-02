/*
 * File src/app/common/CssTransition.js
 * import CssTransition from 'src/app/common/CssTransition';
 *
 * CssTransition component
 */

import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group'


export default function CssTransition(props) {

    let _type = '';
    let _timeout = 200;
    if (props.type === 1) {
        _type = 1;
        _timeout = 1000;
    }


    return (
            <CSSTransitionGroup
                transitionName={"react-transition" + _type}
                transitionAppear={true}
                transitionAppearTimeout={_timeout}
                transitionEnterTimeout={_timeout}
                transitionLeaveTimeout={_timeout}
                timeout={_timeout}
                >
                {props.children}
            </CSSTransitionGroup>
            );
}