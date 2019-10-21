/*
 * File src/app/controllers/articles/Articles.js
 * import MainIndex from 'src/app/controllers/articles/Articles';
 *
 * Articles controller
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';
import Router from 'src/modules/Router';

// Action components
import ArticlesCountries from 'src/app/controllers/articles/actions/Countries';
import ArticlesCountry from 'src/app/controllers/articles/actions/Country';
import ArticlesCategories from 'src/app/controllers/articles/actions/Categories';
import ArticlesCategory from 'src/app/controllers/articles/actions/Category';
import ArticlesArticle from 'src/app/controllers/articles/actions/Article';

class Articles extends Controller {

    constructor() {
        super();
    }

    render() {
        let _actionName = this.getActionName();
        let _actionComponent;
        switch (_actionName) {
            case Consts.ACTION_NAME_COUNTRIES:
                _actionComponent = <ArticlesCountries/>; break;
            case Consts.ACTION_NAME_CATEGORIES:
                _actionComponent = <ArticlesCategories/>; break;
            case Consts.ACTION_NAME_COUNTRY:
                _actionComponent = <ArticlesCountry/>; break;
            case Consts.ACTION_NAME_CATEGORY:
                _actionComponent = <ArticlesCategory/>; break;
            case Consts.ACTION_NAME_ARTICLE:
                _actionComponent = <ArticlesArticle/>; break;
            default:
                _actionComponent = <ArticlesCountries/>;
        }

        return <React.Fragment>
        {_actionComponent}
        </React.Fragment>;
    }
}

export default connect()(withRouter(Articles))