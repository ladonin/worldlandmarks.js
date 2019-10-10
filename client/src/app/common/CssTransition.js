/*
 * File src/app/common/CssTransition.js
 * import CssTransition from 'src/app/common/CssTransition';
 *
 * CssTransition component
 */

import React, {Component} from 'react';
import { CSSTransition  } from 'react-transition-group'

class CssTransition extends Component {

    constructor(){
        super();
        this.state={mounted:false}
    }

    componentDidMount(){
    //    this.setState({
    //      mounted: true
    //    });
    }
    render() {


        let _type = '';
        let _timeout = 1200;
        if (this.props.type === 1) {
            _timeout = 1000;
        }
        /*
         * Doesn't work properly in this version of react
         * <CSSTransition
          in={this.state.mounted}
          appear={true}
          unmountOnExit
          classNames={"fade"+_type}
          timeout={_timeout}
        ></CSSTransition>
        */
        return (
            <div>{this.props.children}</div>
        );
    }
}



export default CssTransition