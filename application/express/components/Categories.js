/*
 * File application/express/components/Categories.js
 * const Categories = require('application/express/components/Categories');
 *
 * Categories component - compute categories data
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');

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
}

Categories.instanceId = BaseFunctions.unique_id();

module.exports = Categories;

