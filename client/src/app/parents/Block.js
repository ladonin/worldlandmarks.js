/*
 * File src/app/parents/Block.js
 * import Block from 'src/app/parents/Block';
 *
 * Common block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Common from 'src/app/parents/Common';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';

class Block extends Common {

    shouldComponentUpdate(nextProps, nextState) {

        if (!CommonBaseFunctions.areObjectsEqual(this.state, nextState)) {
            return true;
        }

        if (typeof nextProps.redux === 'undefined') {
            return !CommonBaseFunctions.areObjectsEqual(nextProps, this.props);
        }

        return !CommonBaseFunctions.areObjectsEqual(nextProps.redux, this.props.redux);
    }

}

export default Block;