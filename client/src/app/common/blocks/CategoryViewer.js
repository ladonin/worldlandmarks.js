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

    show(e) {
        this.showCategoryViewer(e.detail.id)
    }

    hide() {
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

    componentDidUpdate() {


    }

    render() {

        let _selectedItem = this.props.redux.styleData.selectedItem;
        let _categories = CategoryViewerModule.getCategories();
        let _categoriesList = [];

        let _categoriesItem = (category, selected = false) => {
            if (!category) {
                return null;
            }

            return [
                <React.Fragment key={'item_' + category.id + (selected ? '_selected' : '')}>
                    <div className="category_info_content_row_img">
                        <img src={CategoryViewerModule.getCategoryImageUrl(category.id)}/>
                    </div>
                    <div className="category_info_content_row_title" id={'category_info_content_row_title_' + category.id}>
                        <div>
                            {category.title}
                        </div>
                    </div>
                </React.Fragment>
            ]
        };

        for (let _index in _categories) {
            let _category = _categories[_index];

            _categoriesList.push(
                <div key={'category_list_' + _category.id} className={'category_info_content_row_block' + (_selectedItem === _category.id ? ' hidden' : '')} id={'category_info_content_row_block_' + _category.id}>
                    {_categoriesItem(_category)}
                </div>
                );
        }

        return (
                <div id="category_info_block" className={_selectedItem === null ? '' : 'showed'} onClick={this.hideCategoryViewer} style={{height: BaseFunctions.getHeight(window) + 'px'}}>
                    <div className="category_info_content">
                        <div className="category_info_content_title">
                            {this.props.redux.title}
                        </div>
                        <div className="category_info_content_close">
                            X
                        </div>
                        <div className="clear"></div>

                        <div className="category_info_content_row_block"
                             id="category_info_content_row_block_selected"
                             >{_selectedItem !== null ? _categoriesItem(_categories[_selectedItem]) : ''}</div>

                        <div className="clear"></div>
                        {_categoriesList}
                        <div className="clear"></div>
                    </div>
                </div>
                );
    }

}
function mapStateToProps(state) {

    let _selectedItem = null;
    if (state.styleData['#category_info_block']
            && state.styleData['#category_info_block'].arbitrary) {
        _selectedItem = state.styleData['#category_info_block'].arbitrary.item;
    }

    return {
        redux: {
            styleData: {
                selectedItem: _selectedItem
            },
            title: state.staticData['category_info_title_text']
        }
    };
}

export default connect(mapStateToProps, {updateStyleData: UpdateStyleData})(withRouter(CategoryViewer))