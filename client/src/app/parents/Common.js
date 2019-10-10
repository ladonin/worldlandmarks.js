/*
 * File src/app/parents/Common.js
 * import Common from 'src/app/parents/Common';
 *
 * Common component for controllers, actions and blocks
 */

import { Component } from 'react';
import Consts from 'src/settings/Constants';
import Events from 'src/modules/Events';

class Common extends Component {
    constructor() {
        super();
        this.goTo = this.goTo.bind(this);
        this.showCategoryViewer = this.showCategoryViewer.bind(this);
        this.hideCategoryViewer = this.hideCategoryViewer.bind(this);
    }

    /*
     * NOTE: if you want to use goTo you must wrap your component with a withRouter() HOC
     */
    goTo(event) {
        this.props.history.push(event.target.closest("[data-url]").dataset.url);
    }

    /*
     * Show all categories viewer with backlighting viewed category
     *
     * @param {integer} id - viewed category id
     */
    showCategoryViewer(id){
        Events.dispatch(Consts.EVENT_TOGGLE_CATEGORY_VIEWER, {
            id
        });
    }

    /*
     * Hide categories viewer
     */
    hideCategoryViewer(){
        Events.dispatch(Consts.EVENT_TOGGLE_CATEGORY_VIEWER, {
            id:null
        });
    }
}

export default Common;

export function UpdateStyleData(data) {
    return {type:Consts.UPDATE_STYLE_DATA, data}
}

export function ClearActionData() {
    return {type:Consts.CLEAR_ACTION_DATA}
}

export function ClearStyleData() {
    return {type:Consts.CLEAR_STYLE_DATA}
}

export function RemoveBackgroundData(prop) {
    return {type:Consts.REMOVE_BACKGROUND_DATA, prop}
}

export function ClearBackgroundData() {
    return {type:Consts.CLEAR_BACKGROUND_DATA}
}