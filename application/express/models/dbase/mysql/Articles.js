/*
 * File application/express/models/dbase/mysql/Articles.js
 * const ArticlesModel = require('application/express/models/dbase/mysql/Articles');
 *
 * Articles MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class ArticlesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.ARTICLES;

        this.fields = {
            title:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            content:{
                'rules':['required'],
                'processing':['strip_tags', 'new_line', 'urls', 'spec_tags'],
            },
            content_plain:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            seo_description:{
                'rules':[],
                'processing':['strip_tags'],
            },
            country_id:{
                'rules':['required', 'numeric'],
            },
            categories:{
                'rules':['required'],
                'processing':['strip_tags'],
            },
            keywords:{
                'rules':[],
                'processing':['strip_tags'],
            },
        };

        this.snapshotFieldsData();
    }


    /*
     * Get last articles
     *
     * @param {integer} limit - max count of returned articles
     * @param {boolean} withContent - whether to take content or not
     *
     * @return {array of objects}
     */
    getLastArticles(limit = 10, withContent = false)
    {
        let _condition = '1';
        let _order = 'id DESC';
        let _select = withContent === true ? '*' : 'id, title';
        let _group = '';
        let _need_result = false;

        return this.getByCondition(_condition, _order, _group, _select, undefined, limit, _need_result);
    }


}

ArticlesModel.instanceId = BaseFunctions.unique_id();

module.exports = ArticlesModel;