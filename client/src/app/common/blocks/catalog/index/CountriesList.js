/*
 * File src/app/common/blocks/catalog/index/CountriesList.js
 * import CountriesList from 'src/app/common/blocks/catalog/index/CountriesList';
 *
 * CountriesList block component
 */

import React from 'react';
import { withRouter } from 'react-router-dom';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import { connect } from 'react-redux';


import ArticlesList from 'src/app/common/blocks/ArticlesList';
import Block from 'src/app/parents/Block';
import BaseFunctions from 'src/functions/BaseFunctions';
import Consts from 'src/settings/Constants';

class CountriesList extends Block {

    constructor() {
        super();
    }

    render() {

        let _countriesList =[];


        let _style = {};
        if (isMobile) {
            _style.width = Math.floor(BaseFunctions.getWidth(window)/2) - 25 + 'px'
        }

        for (let _index in this.props.redux.data) {
            let _item = this.props.redux.data[_index];
            _countriesList.push(
                <div className="catalog_index_country_row" style={_style} onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/'+_item.country_code}>
                    <div>
                        <img className="flag" src={BaseFunctions.getFlagUrl(_item.country_code)}/>
                        <div className="catalog_index_country_row_name"><div className="catalog_index_country_name">{_item.country}</div>
                            <div className="catalog_index_country_placemarks_count">{this.props.redux.placemarks_count} {_item.placemarks_count}</div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <React.Fragment>
                {_countriesList}
                <div className="clear h_20px"></div>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {

    return {
        redux: {
            data:state.actionData['data'],
            placemarks_count:state.staticData['placemarks_count'],
        }
    }
}

export default connect(mapStateToProps)(withRouter(CountriesList))