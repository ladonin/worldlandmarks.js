/*
 * File src/app/parents/Block.js
 * import Block from 'src/app/parents/Block';
 *
 * Common block component
 */

import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Common from 'src/app/parents/Common';
import CommonBaseFunctions from 'src/../../application/common/functions/BaseFunctions';


class Block extends Common {

    shouldComponentUpdate(nextProps, nextState){
        return !CommonBaseFunctions.whetherEqualObjects(nextProps.redux,this.props.redux);
    }

}

export default Block;