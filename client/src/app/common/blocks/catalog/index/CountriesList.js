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
import AbstractBlock from 'src/app/abstract/AbstractBlock';
import BaseFunctions from 'src/functions/BaseFunctions';
import Consts from 'src/settings/Constants';

class CountriesList extends AbstractBlock {

    constructor() {
        super();
    }

    render() {

        let _countriesList =[];

        for (let _index in this.props.data) {
            let _item = this.props.data[_index];
            _countriesList.push(
                <div className="catalog_index_country_row" onClick={this.goTo} data-url={'/' + Consts.CONTROLLER_NAME_CATALOG + '/'+_item.country_code}>
                    <img className="flag" src={BaseFunctions.getFlagUrl(_item.country_code)}/>
                    <div className="catalog_index_country_row_name">{_item.country}
                        <div className="catalog_index_country_placemarks_count">{this.props.placemarks_count} {_item.placemarks_count}</div>
                    </div>
                    <div className="clear"></div>
                </div>
            );
        }

        return (
            <React.Fragment>
                <BrowserView>
                    {_countriesList}
                </BrowserView>
                <MobileView>
                    TODO_MOBILE CountriesList
                </MobileView>
            </React.Fragment>
        );
    }
}


function mapStateToProps(state) {

    return {
        data:state.dynamicData['data'],
        placemarks_count:state.staticData['placemarks_count'],
        last_articles:state.staticData['last_articles']
    }
}
let mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CountriesList))






















