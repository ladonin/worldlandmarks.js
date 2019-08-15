/*
 * File src/app/abstract/AbstractAction.js
 * import AbstractAction from 'src/app/abstract/AbstractAction';
 *
 * Common action component
 */

import { Component } from 'react';
import Router from 'src/modules/router/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';


export default class AbstractAction extends Component {

    componentDidUpdate(){
        document.getElementById('action').style.display = 'block';
    }

    componentWillUnmount(){


        this.props.dispatch({type:Consts.REMOVE_DYNAMIC_DATA})
    }
}




export function MapStateToProps(state) {console.log(Object.keys(state.dynamicData).length);
    return {
        needShow:Object.keys(state.dynamicData).length ? true : false,
    };
}