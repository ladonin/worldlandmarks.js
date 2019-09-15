/*
 * File server/src/controllers/Article.js
 *
 * Controller article/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Seo = require('server/src/components/Seo');



const Countries = require('server/src/components/Countries');

const ArticlesModel = require('server/src/models/dbase/mysql/Articles');
const Config = require('server/src/settings/Config');
const ConfigRestrictions = require('server/common/settings/Restrictions');
const Service = require('server/src/core/Service');


const CommonController = require('server/src/controllers/CommonController');

class Article extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action countries
     */
    action_countries() {
        this.addActionData({
            'countriesData':ArticlesModel.getInstance(this.requestId).getCountriesData()
        });

        this.sendMe();
    }

    /*
     * Action categories
     */
    action_categories() {
        this.addActionData({
            'categoriesData':ArticlesModel.getInstance(this.requestId).getCategoriesData()
        });

        this.sendMe();
    }


    /*
     * Action country
     */
    action_country() {
        let _countriesData = ArticlesModel.getInstance(this.requestId).getCountriesData();
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _currentPage = this.getFromRequest(Consts.PAGE_NUMBER_VAR_NAME);
        let _limit = ConfigRestrictions['max_pager_rows'];
        let _articlesCount = ArticlesModel.getInstance(this.requestId).getArticlesCountForCountry(_countryCode);

        let _pagesCount =  Math.ceil(_articlesCount/_limit);
        let _offset = (_currentPage - 1) * _limit;


        this.addActionData({
            'countryName':_countryName,
            'countryCode':_countryCode,
            'countriesData':_countriesData,
            'articlesData': ArticlesModel.getInstance(this.requestId).getCountryArticles(_countryCode, _offset, _limit),
            'currentPage':_currentPage,
            'pagesCount':_pagesCount,
        });

        this.sendMe();
    }

    /*
     * Action category
     */
    action_category() {
        let _categoriesData = ArticlesModel.getInstance(this.requestId).getCategoriesData();











        
        let _countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        let _countryName = Countries.getInstance(this.requestId).getCountryNameFromRequest();
        let _currentPage = this.getFromRequest(Consts.PAGE_NUMBER_VAR_NAME);
        let _limit = ConfigRestrictions['max_pager_rows'];
        let _articlesCount = ArticlesModel.getInstance(this.requestId).getArticlesCountForCountry(_countryCode);

        let _pagesCount =  Math.ceil(_articlesCount/_limit);
        let _offset = (_currentPage - 1) * _limit;


        this.addActionData({
            'countryName':_countryName,
            'countryCode':_countryCode,
            'categoriesData':_categoriesData,
            'articlesData': ArticlesModel.getInstance(this.requestId).getCountryArticles(_countryCode, _offset, _limit),
            'currentPage':_currentPage,
            'pagesCount':_pagesCount,
        });

        this.sendMe();
    }

}


Article.instanceId = BaseFunctions.unique_id();
module.exports = Article;