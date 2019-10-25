/*
 * File src/app/common/blocks/PlacemarkCaregories.js
 * import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
 *
 * PlacemarkCaregories block component - show placemark's category and subcategories
 */

import React from 'react';
import { connect } from 'react-redux';

import {UpdateStyleData} from 'src/app/parents/Common';
import CategoryViewerModule from 'src/modules/CategoryViewer';
import Block from 'src/app/parents/Block';

class PlacemarkCaregories extends Block
{

    constructor()
    {
        super();
        this.seeCategory = this.seeCategory.bind(this);
        this.categories = CategoryViewerModule.getCategories();
    }


    /*
     * Open category window with explanation of interested category
     *
     * @param {integer} id - category id to show
     */
    seeCategory(id)
    {
        return function()
        {
            this.showCategoryViewer(id)
        }.bind(this)
    }


    render()
    {

        let _subcategoriesList = [];
        let _subcategories = this.props.subcategories ? this.props.subcategories.split(',') : [];

        for (let _index in _subcategories) {
            let _subcategory = parseInt(_subcategories[_index]);
            _subcategoriesList.push(
                <img key={'category_'+_subcategory} src={CategoryViewerModule.getCategoryImageUrl(_subcategory)}
                    alt={this.categories[_subcategory].title}
                    title={this.categories[_subcategory].title}
                    onClick={this.seeCategory(_subcategory)}/>
            );
        }

        return (
            <React.Fragment>
                <div className="placemarks_category_html_content">
                    <img key={'category_'+this.props.category} src={CategoryViewerModule.getCategoryImageUrl(this.props.category)}
                        alt={this.categories[this.props.category].title}
                        title={this.categories[this.props.category].title}
                        onClick={this.seeCategory(this.props.category)}/>
                    {_subcategoriesList}
                    <div className="clear"></div>
                </div>
            </React.Fragment>
        );
    }
}

export default connect(undefined,{updateStyleData:UpdateStyleData})(PlacemarkCaregories)