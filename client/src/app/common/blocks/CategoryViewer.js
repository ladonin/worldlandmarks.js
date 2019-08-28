/*
 * File src/app/common/blocks/CategoryViewer.js
 * import CategoryViewer from 'src/app/common/blocks/CategoryViewer';
 *
 * CategoryViewer block component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";

import Consts from 'src/settings/Constants';
import CategoryViewerModule from 'src/modules/CategoryViewer';
import Block from 'src/app/parents/Block';
import {UpdateStyleData} from 'src/app/parents/Common';
import CommonBaseFunctions from 'src/../../application/common/functions/BaseFunctions';
import BaseFunctions from 'src/functions/BaseFunctions';
import Events from 'src/modules/Events';

class CategoryViewer extends Block {
    constructor() {
        super();
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this)
    }

    show(e){
        this.showCategoryViewer(e.detail.id)
    }

    hide(){
        this.hideCategoryViewer()
    }

    componentDidMount() {
        Events.add(Consts.EVENT_SHOW_CATEGORY_VIEWER, this.show);
        Events.add(Consts.EVENT_HIDE_CATEGORY_VIEWER, this.hide);
    }

    componentWillUnmount() {
       Events.remove(Consts.EVENT_SHOW_CATEGORY_VIEWER);
       Events.remove(Consts.EVENT_HIDE_CATEGORY_VIEWER);
    }

    render() {

        let _categories = CategoryViewerModule.getCategories();
        let _categoriesList = [];

        for (let _index in _categories) {
            let _category = _categories[_index];

            let _additionalClasses = (this.props.redux.styleData.ending1 === _category.id) ? this.props.redux.styleData.class1 : '';

            _categoriesList.push(
                <div className={"category_info_content_row_block "+_additionalClasses} id={'category_info_content_row_block_' + _category.id}>
                    <div className="category_info_content_row_img">
                        <img src={Consts.SERVICE_IMGS_URL_CATEGORIES + _category.code + '.png'}/>
                    </div>
                    <div className={"category_info_content_row_title " + this.props.redux.styleData.class4} id={'category_info_content_row_title_' + _category.id}>
                        <div>
                            {_category.title}
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div id="category_info_block" class={this.props.redux.styleData.class3} onClick={this.hideCategoryViewer} style={{height:BaseFunctions.getHeight(window) + 'px'}}>
                <div class="category_info_content">
                    <div class="category_info_content_title">
                        {this.props.redux.title}
                    </div>
                    <div class="category_info_content_close">
                        X
                    </div>
                    <div class="clear"></div>

                    <div class="category_info_content_row_block"
                        id="category_info_content_row_block_selected"
                        dangerouslySetInnerHTML={{__html: this.props.redux.styleData.html2}}></div>

                    <div class="clear"></div>
                    {_categoriesList}
                    <div class="clear"></div>
                </div>
            </div>
        );
    }

}
function mapStateToProps(state) {
    let _class1 = '';
    let _ending1 = '';
    if (state.styleData['#category_info_content_row_block_']) {
        _class1 = state.styleData['#category_info_content_row_block_'].class;
        _ending1 = state.styleData['#category_info_content_row_block_'].ending;
    }

    let _html2 = '';
    if (state.styleData['#category_info_content_row_block_selected']) {
        _html2 = state.styleData['#category_info_content_row_block_selected'].html;
    }

    let _class3 = '';
    if (state.styleData['#category_info_block']) {
        _class3 = state.styleData['#category_info_block'].class;
    }

    let _class4 = '';
    if (state.styleData['.category_info_content_row_title']) {
        _class4 = state.styleData['.category_info_content_row_title'].class;
    }

    return {
        redux:{
            styleData:{
                class1:_class1,
                ending1:_ending1,
                html2:_html2,
                class3:_class3,
                class4:_class4
            },
            title:state.staticData['category_info_title_text'],
        }
    };
}

export default connect(mapStateToProps,{updateStyleData:UpdateStyleData})(withRouter(CategoryViewer))