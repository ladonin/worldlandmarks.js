/*
 * File src/app/parents/Action.js
 * import Action from 'src/app/parents/Action';
 *
 * Common action component
 */

import { Component } from 'react';
import Router from 'src/modules/router/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';


export default class Action extends Component {

    componentDidUpdate(){
        window.$('#action').addClass('showed');
    }
    componentWillUnmount(){
        this.props.dispatch({type:Consts.REMOVE_DYNAMIC_DATA})
    }
    componentDidMount() {
        Socket.query(this.props.match.params);
    }
}

export function MapStateToProps(state) {
    return {
        needShow:Object.keys(state.dynamicData).length ? true : false,
    };
}