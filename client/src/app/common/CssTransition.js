/*
 * File src/app/common/CssTransition.js
 * import CssTransition from 'src/app/common/CssTransition';
 *
 * CssTransition component
 */

import React, {Component} from 'react';
import { CSSTransition  } from 'react-transition-group'

class CssTransition extends Component
{

    render()
    {
        return (
            <CSSTransition
                appear={true}
                in={true}
                classNames={"react-transition"+(this.props.type ? this.props.type : '')}
                addEndListener={(node, done) => {
                    node.addEventListener('transitionend', done, false);
                }}
            >
                <div>
                    {this.props.children}
                </div>
            </CSSTransition>
        );
    }
}

export default CssTransition