/*
 * File src/app/parents/Action.js
 * import Action from 'src/app/parents/Action';
 *
 * Common action component
 */

import { Component } from 'react';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';
import Common, {UpdateStyleData, RemoveDynamicData, RemoveStyleData} from 'src/app/parents/Common';

export default class Action extends Common {

    constructor(){
        super();
        this.firstRender = true;
        this.getActionClass = this.getActionClass.bind(this);
    }

    /*
     * Get css class name for action component
     *  Note: at first render action class value will be equal its old value (usually 'showed'),
     *  so we must at first render hide action component, until it gets page data from server
     *  At second render actionClass will be equal current action class value (after dispatch will have worked)
     *
     *  @return {string} - action css class name
     */
    getActionClass(){
        if (this.firstRender === true) {
            this.firstRender = false;
            return '';
        }
        return this.props.redux.actionClass;
    }

    componentDidUpdate(){
        // Only if data has came
        if (Object.keys(this.props.redux.dynamicData).length && !window.$('#action').hasClass('showed')){
            this.props.updateStyleData({'#action':{class:'+showed'}});
        }
    }
    componentWillUnmount(){
        this.props.removeDynamicData();
        this.props.removeStyleData();
    }

    componentDidMount() {
        Socket.actionQuery(this.props.match.params);
    }
}

export function MapStateToProps(state) {

    let _actionClass = '';

    if (state.styleData['#action']) {
        _actionClass = state.styleData['#action'].class;
    }

    return {
        redux:{
            staticData:state.staticData,
            dynamicData:state.dynamicData,
            actionClass:_actionClass
        }
    };
}
export const MapDispatchToProps = {
    updateStyleData: UpdateStyleData,
    removeDynamicData: RemoveDynamicData,
    removeStyleData: RemoveStyleData
}