/*
 * File application/express/models/dbase/mysql/Articles.js
 * const ArticlesModel = require('application/express/models/dbase/mysql/Articles');
 *
 * Articles MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const StrictFunctions = require('application/express/functions/StrictFunctions');


class ArticlesModel extends DBaseMysql
{
    constructor() {
        super();

        this.tableName;

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
     * Get db table name
     *
     * @return {string} - table name
     */
    getTableName() {
        if (!this.tableName) {
            this.tableName = this.getServiceName() + '_articles';
        }
        return this.tableName;
    }

    /*
     * Add new article
     *
     * @param {object} data - new article data
     *
     * @return {integer} - new record id
     */
    add(data)
    {
        this.setValuesToFields(data);
        return this.insert();
    }

    /*
     * Update existed article
     *
     * @param {object} data - article's new data with id
     */
    update(data)
    {
        let _id = data.id;
        delete data.id;
        this.setValuesToFields(data);
        this.update(_id);
    }
}

ArticlesModel.instanceId = BaseFunctions.unique_id();

module.exports = ArticlesModel;