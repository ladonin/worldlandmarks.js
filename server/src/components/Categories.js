/*
 * File server/src/components/Categories.js
 * const Categories = require('server/src/components/Categories');
 *
 * Categories component - compute categories data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Service = require('server/src/core/Service');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');

class Categories extends Component {

    constructor() {
        super();

        this.categories_colors = {
            0: '#9F9F9F',
            1: '#5E8488',
            2: '#5E8488',
            3: '#009353',
            4: '#5E8488',
            5: '#5E8488',
            6: '#006FCE',
            7: '#006FCE',
            8: '#006FCE',
            9: '#B0250E',
            10: '#FF0072',
            11: '#B0250E',
            12: '#7101B8',
            13: '#7101B8',
            14: '#0C6676',
            15: '#009353',
            16: '#E8F511',
            17: '#F6571F',
            18: '#76DAFF',
            19: '#76DAFF',
            20: '#76DAFF',
            21: '#009CFF',
            22: '#009CFF',
            23: '#009CFF',
            24: '#5E8488',
            25: '#B0250E',
            26: '#5E8488',
            27: '#FFFFFF'
        };

    }

    /*
     * Prepare categories names for articles
     *
     * @param {string} categoryCode - category code
     * @param {string} categoryTitle - category title
     *
     * @return {TYPE} - DESCRIPTION
     */
    prepareNameForArticles(categoryCode, categoryTitle)
    {
        if (this.getServiceName() === 'landmarks') {
            if (categoryCode === 'other') {
                return this.getText('text/general_review');
            }
        }
        return categoryTitle;
    }


    /*
     * Return category code by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryCode(id)
    {
        id = BaseFunctions.toInt(id);
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['id'] === id) {
                return _category['code'];
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id[' + id + ']', undefined, false);
    }


    /*
     * Return category title by id
     *
     * @param {integer} id - category id
     *
     * @return {string}
     */
    getCategoryTitle(id)
    {
        return this.getCategory(id)['title'];
    }

    /*
     * Return category data by id
     *
     * @param {integer} id - category id
     *
     * @return {object}
     */
    getCategory(id)
    {
        id = BaseFunctions.toInt(id);
        let _categories = this.getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['id'] === id) {
                return _category;
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id[' + id + ']', undefined, false);
    }

    /*
     * Return category data by code
     *
     * @param {string} code - category code
     *
     * @return {object}
     */
    getCategoryByCode(code)
    {
        let _categories = this.getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

                if (_category['code'] === code) {
                return _category;
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'code[' + code + ']', undefined, false);
    }












    /*
     * Return all available categories data according with controller name
     *
     * @return {array of objects}
     */
    getCategories()
    {

        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            _categories[_index]['title'] = this.getText('category/name/' + _categories[_index]['id']);
        }

        if (this.getControllerName() === Consts.CONTROLLER_NAME_ARTICLES){

            for (let _index in _categories) {
                _categories[_index]['title'] = Categories.getInstance(this.requestId).prepareNameForArticles(_categories[_index]['code'], _categories[_index]['title']);
            }
        }

        return _categories;
    }

    /*
     * Return category id by code
     *
     * @param {string} code - category code
     *
     * @return {integer}
     */
    getCategoryId(code)
    {
        let _categories = Service.getInstance(this.requestId).getCategories();

        for (let _index in _categories) {
            let _category = _categories[_index];

            if (_category['code'] === code) {
                return _category['id'];
            }
        }
        this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'code[' + code + ']', undefined, false);
    }

}

Categories.instanceId = BaseFunctions.uniqueId();

module.exports = Categories;

