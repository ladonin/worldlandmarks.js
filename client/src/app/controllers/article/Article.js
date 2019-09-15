/*
 * File src/app/controllers/article/Article.js
 * import MainIndex from 'src/app/controllers/article/Article';
 *
 * Article controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/Router';

// Action components
import ArticleCountries from 'src/app/controllers/article/actions/Countries';
import ArticleCountry from 'src/app/controllers/article/actions/Country';
import ArticleCategories from 'src/app/controllers/article/actions/Categories';
import ArticleCategory from 'src/app/controllers/article/actions/Category';



//import CatalogCountry from 'src/app/controllers/catalog/actions/Country';
//import CatalogState from 'src/app/controllers/catalog/actions/State';


import { withRouter } from 'react-router-dom';

class Article extends Controller {

    constructor() {
        super();
    }

    render() {
        let _actionName = this.getActionName();
        let _actionComponent;
        switch (_actionName) {
            case Consts.ACTION_NAME_COUNTRIES:
                _actionComponent = <ArticleCountries/>; break;
            case Consts.ACTION_NAME_CATEGORIES:
                _actionComponent = <ArticleCategories/>; break;
            case Consts.ACTION_NAME_COUNTRY:
                _actionComponent = <ArticleCountry/>; break;
            case Consts.ACTION_NAME_CATEGORY:
                _actionComponent = <ArticleCategory/>; break;
            default:
                _actionComponent = <ArticleCountries/>;
        }

        return <React.Fragment>
        {_actionComponent}
        </React.Fragment>;
    }
}

export default connect()(withRouter(Article))