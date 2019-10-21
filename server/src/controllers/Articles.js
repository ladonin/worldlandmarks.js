/*
 * File server/src/controllers/Articles.js
 *
 * Controller article/* pages
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Seo = require('server/src/components/Seo');


const Categories = require('server/src/components/Categories');
const Countries = require('server/src/components/Countries');

const ArticlesModel = require('server/src/models/dbase/mysql/Articles');
const ArticlesComponent = require('server/src/components/Articles');
const Config = require('server/src/settings/Config');
const ConfigRestrictions = require('server/common/settings/Restrictions');
const Service = require('server/src/core/Service');


const CommonController = require('server/src/controllers/CommonController');

class Articles extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action countries
     */
    action_countries() {
        let _seoPath = 'articles/index';
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath),
            'countriesData':ArticlesModel.getInstance(this.requestId).getCountriesData()
        });

        this.sendMe();
    }

    /*
     * Action categories
     */
    action_categories() {
        let _seoPath = 'articles/index';
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath),
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
        let _seoPath = 'articles/country';

        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath, {'country':_countryName}),
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

        let _categoryCode = this.getFromRequest(Consts.CATEGORY_VAR_NAME);
        let _categoryData = Categories.getInstance(this.requestId).getCategoryByCode(_categoryCode);

        let _currentPage = this.getFromRequest(Consts.PAGE_NUMBER_VAR_NAME);
        let _limit = ConfigRestrictions['max_pager_rows'];
        let _articlesCount = ArticlesModel.getInstance(this.requestId).getArticlesCountForCategory(_categoryData.id);

        let _pagesCount =  Math.ceil(_articlesCount/_limit);
        let _offset = (_currentPage - 1) * _limit;
        let _seoPath = 'articles/category';
        let _categoryTitle = Categories.getInstance(this.requestId).prepareNameForArticles(_categoryData.code, {'category':_categoryData.title});
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath, {'category':_categoryTitle}),
            'categoryTitle':_categoryTitle,
            'categoryId':_categoryData.id,
            'categoriesData':_categoriesData,
            'articlesData': ArticlesModel.getInstance(this.requestId).getCategoryArticles(_categoryData.id, _offset, _limit),
            'currentPage':_currentPage,
            'pagesCount':_pagesCount,
        });

        this.sendMe();
    }

    /*
     * Action article page
     */
    action_article() {

        let _articleId = this.getFromRequest(Consts.ID_VAR_NAME);
        let _articleData = ArticlesModel.getInstance(this.requestId).getArticle(_articleId);
        let _countryCode = Countries.getInstance(this.requestId).getСountryCodeById(_articleData['country_id']);
        let _categoriesData = [];
        let _categoriesArray = _articleData.categories.split(',');
        for (let _index in _categoriesArray) {
            let _categoryData = Categories.getInstance(this.requestId).getCategory(parseInt(_categoriesArray[_index]));
            _categoriesData.push(_categoryData);
        }


        this.addActionData({
            'title':_articleData.title,
            'data': _articleData,
            'breadcrumbs': ArticlesComponent.getInstance(this.requestId).getBreadcrumbsData(_articleData),
            'countryCode':_countryCode,
            'countryName': Countries.getInstance(this.requestId).getCountryNameByCode(_countryCode),
            'categoriesData':_categoriesData,
            'randomArticles': ArticlesModel.getInstance(this.requestId).getRandomArticles(_articleData.id)
        });

        this.sendMe();
    }
}


Articles.instanceId = BaseFunctions.uniqueId();
module.exports = Articles;