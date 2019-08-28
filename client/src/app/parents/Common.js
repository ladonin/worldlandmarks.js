/*
 * File src/app/parents/Common.js
 * import Common from 'src/app/parents/Common';
 *
 * Common component for controllers, actions and blocks
 */

import { Component } from 'react';
import Consts from 'src/settings/Constants';

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
        //ATTENTION - обратите внимание
        this.props.updateStyleData(
            {
                ['#category_info_content_row_block_']:
                        {class:'+hidden', ending: id},

                '#category_info_content_row_block_selected':
                        {html:document.getElementById('category_info_content_row_block_' + id).innerHTML},

                '#category_info_block':
                        {class:'-hidden +showed'}
            }
        );
    }

    /*
     * Hide categories viewer
     */
    hideCategoryViewer(){
        this.props.updateStyleData(
            {
                '.category_info_content_row_title':
                    {class:'-category_info_selected'},
                '#category_info_block':
                    {class:'+hidden -showed'}
            }
        );
    }
}

export default Common;

export function UpdateStyleData(data) {
    return {type:Consts.UPDATE_STYLE_DATA, data}
}

export function RemoveDynamicData() {
    return {type:Consts.REMOVE_DYNAMIC_DATA}
}

export function RemoveStyleData() {
    return {type:Consts.REMOVE_STYLE_DATA}
}