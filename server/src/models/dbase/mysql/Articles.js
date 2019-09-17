/*
 * File server/src/models/dbase/mysql/Articles.js
 * const ArticlesModel = require('server/src/models/dbase/mysql/Articles');
 *
 * Articles MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Service = require('server/src/core/Service');
const Countries = require('server/src/components/Countries');
const Categories = require('server/src/components/Categories');
const ErrorCodes = require('server/src/settings/ErrorCodes');

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

    /*
     * Return last articles for current country
     *
     * @param {string} countryCode
     * @param {boolean} withContent - whether to take content or not
     *
     * @return {array of objects}
     */
    getLastCountryArticles(countryCode = null, withContent = false)
    {
        if (!countryCode) {
            countryCode = Countries.getInstance(this.requestId).getCountryCodeFromRequest();
        }
        let _countryId = Countries.getInstance(this.requestId).getCountryDataByCode(countryCode)['id'];

        return this.getByCondition(
            /*condition*/'country_id=' + _countryId,
            /*order*/'id DESC',
            /*group*/'',
            /*select*/withContent === true ? '*' : 'id, title',
            /*where_values*/[],
            /*limit*/ Service.getInstance(this.requestId).getMaxLastCountryArticles(),
            /*need_result*/false
        );
    }

    /*
     * Return articles for current country
     *
     * @param {string} countryCode
     * @param {number} offset - starting id
     * @param {number} limit - articles count to return
     *
     * @return {array of objects}
     */
    getCountryArticles(countryCode, offset, limit)
    {
        let _condition = '1';
        if (countryCode) {
            let _countryId = Countries.getInstance(this.requestId).getCountryDataByCode(countryCode)['id'];
            _condition = "country_id=" + _countryId;
        }

        let _limit = false;
        if (BaseFunctions.isSet(offset) && BaseFunctions.isSet(limit)) {
            _limit = parseInt(offset) + ', ' + parseInt(limit);
        }

        return this.getByCondition(
            /*condition*/ _condition,
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'id, title',
            /*where_values*/ [],
            /*limit*/ _limit,
            /*need_result*/ false
        );
    }


    /*
     * Return all countries about which have articles
     *
     * @return {array of objects}
     */
    getCountriesData()
    {
        let _sql = `
                SELECT
                    a.country_id as id,
                    c.local_code as country_code,
                    cn.name as name,
                    COUNT(*) as articles_count
                FROM ${this.getTableName()} a
                    LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY)} c on c.id = a.country_id
                    LEFT JOIN ${this.getTableName(this.tableInitNames.COUNTRY_NAME)} cn on c.id = cn.country_id AND cn.language='${this.getLanguage()}'
                GROUP by a.country_id
                ORDER by cn.name`;

        return this.getBySql(_sql, [], false);
    }



    /*
     * Return all categories data which articles have
     *
     * @return {array of objects}
     */
    getCategoriesData()
    {
        let _categoriesList = this.getByCondition(
            /*condition*/ 1,
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'categories',
            /*where_values*/ [],
            /*limit*/ false,
            /*need_result*/ false
        );

        let _categoriesArray = [];
        for (let _index in _categoriesList) {
            let _categories = _categoriesList[_index]['categories'].split(',');
            for (let _index in _categories) {
                _categoriesArray[parseInt(_categories[_index])] = true;
            }
        }

        let _result = [];
        for (let _categoryId in _categoriesArray) {

            let _categoryData = Categories.getInstance(this.requestId).getCategory(_categoryId);
            _result.push({
                id:_categoryData.code,
                title:Categories.getInstance(this.requestId).prepareNameForArticles(_categoryData.code, _categoryData.title)
            });
        }

        return _result;
    }



    /*
     * Return articles count for current country
     *
     * @param {string} countryCode
     *
     * @return {number}
     */
    getArticlesCountForCountry(countryCode)
    {
        return this.getByCondition(
            /*condition*/ 'country_id=?',
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'COUNT(*) as count',
            /*where_values*/ [Countries.getInstance(this.requestId).getCountryDataByCode(countryCode).id],
            /*limit*/ false,
            /*need_result*/ true
        )[0]['count'];
    }



    /*
     * Return articles for current category
     *
     * @param {number} categoryId - category id
     * @param {number} offset - starting id
     * @param {number} limit - articles count to return
     *
     * @return {array of objects}
     */
    getCategoryArticles(categoryId, offset, limit)
    {
        let _condition = "categories REGEXP '[[:<:]]" + parseInt(categoryId) + "[[:>:]]'";

        let _limit = false;
        if (BaseFunctions.isSet(offset) && BaseFunctions.isSet(limit)) {
            _limit = parseInt(offset) + ', ' + parseInt(limit);
        }

        return this.getByCondition(
            /*condition*/ _condition,
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'id, title',
            /*where_values*/ [],
            /*limit*/ _limit,
            /*need_result*/ false
        );
    }

    /*
     * Return articles count for current category
     *
     * @param {number} categoryId
     *
     * @return {number}
     */
    getArticlesCountForCategory(categoryId)
    {
        let _condition = "categories REGEXP '[[:<:]]" + parseInt(categoryId) + "[[:>:]]'";

        return this.getByCondition(
            /*condition*/ _condition,
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'COUNT(*) as count',
            /*where_values*/ [],
            /*limit*/ false,
            /*need_result*/ true
        )[0]['count'];

    }


    /*
     * Return article data by id
     *
     * @param {number} id - article id
     *
     * @return {object}
     */
    getArticle(id)
    {
        return this.getByCondition(
            /*condition*/ 'id=' + parseInt(id),
            /*order*/ '',
            /*group*/ '',
            /*select*/ 'id, categories, content, country_id, keywords, seo_description, title',
            /*where_values*/ [],
            /*limit*/ 1,
            /*need_result*/ false
        )[0]
    }

    /*
     * Return random articles list
     *
     * @param {number} ignoreId - article id to be ignored
     *
     * @return {array of objects}
     */
    getRandomArticles(ignoreId){

        let _maxRandomArticles = Service.getInstance(this.requestId).getMaxRandomArticles();
        ignoreId = parseInt(ignoreId);

        return this.getArticlesData([ignoreId], true, true, _maxRandomArticles)
    }


    /*
     * Return articles data
     *
     * @param {array} ids - article ids to be ignored or fetch
     * @param {boolean} ignore - either articles ids must be ignored or fetched
     * @param {boolean} random - mix articles list or not
     * @param {number} limit - result limit
     * @param {string} select - fields for select
     *
     * @return {array of objects}
     */
    getArticlesData(ids = [], ignore = false, random = false, limit = 10, select = 'id, title')
    {

        ids = BaseFunctions.prepareToIntArray(ids);

        let _idsString = ids.join(',');
        let _condition = _idsString ? ("id " + (ignore === true ? "NOT" : "") + " IN (" + _idsString + ")") : '';
        let _order = (random === true) ? 'RAND()' : '';

        return this.getByCondition(
            /*condition*/ _condition,
            /*order*/ _order,
            /*group*/ '',
            /*select*/ select,
            /*where_values*/ [],
            /*limit*/ limit,
            /*need_result*/ false
        );
    }








}


ArticlesModel.instanceId = BaseFunctions.unique_id();

module.exports = ArticlesModel;









/*

    public function create_new_article()
    {

        $form_data = $_POST['add_new_article_form'];
        $form_data['categories'] = str_replace(' ', '', $form_data['categories']);
        if (isset($form_data['title']) && $form_data['title'] && isset($form_data['content']) && $form_data['content'] && isset($form_data['country_id'])) {

            $form_data['country_id'] = (int) $form_data['country_id'];
            $data = array(
                'title' => $form_data['title'],
                'content' => $form_data['content'],
                'content_plain' => $form_data['content'],
                'country_id' => $form_data['country_id'],
                'categories' => $form_data['categories'],
                'keywords' => $form_data['keywords'],
                'seo_description' => $form_data['seo_description']
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        $config = self::get_config();
        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);

        $id_data = $article_model->add_article($data);


        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/new_article/created')),
            'data' => array(
                'id' => $id_data
            )
        );
        return $result;
    }








    public function update_article()
    {

        $form_data = $_POST['update_article_form'];
        $form_data['categories'] = str_replace(' ', '', $form_data['categories']);
        $form_data['id'] = isset($form_data['id']) ? (int) $form_data['id'] : null;
        if ($form_data['id'] && isset($form_data['title']) && $form_data['title'] && isset($form_data['content']) && $form_data['content'] && isset($form_data['country_id'])) {

            $form_data['country_id'] = (int) $form_data['country_id'];
            $data = array(
                'id' => $form_data['id'],
                'title' => $form_data['title'],
                'content' => $form_data['content'],
                'content_plain' => $form_data['content'],
                'country_id' => $form_data['country_id'],
                'categories' => $form_data['categories'],
                'keywords' => $form_data['keywords'],
                'seo_description' => $form_data['seo_description']
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        self::get_model(MY_MODEL_NAME_DB_ARTICLES)->update_article($data);

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/article/updated')),
            'data' => array(
                'id' => $form_data['id']
            )
        );
        return $result;
    }


    public function delete_article()
    {
        $form_data = $_POST['delete_article_form'];
        $form_data['id'] = isset($form_data['id']) ? (int) $form_data['id'] : null;
        if ($form_data['id']) {
            $data = array(
                'id' => $form_data['id'],
            );
        } else {
            self::concrete_error(array(MY_ERROR_FORM_WRONG_DATA, 'POST array:' . json_encode($_POST)));
        }

        self::get_model(MY_MODEL_NAME_DB_ARTICLES)->delete($data['id']);

        $result = array(
            'status' => MY_SUCCESS_CODE,
            'message' => my_pass_through(@self::trace('success/article/deleted')),
            'data' => array()
        );
        return $result;
    }













    public function get_last_country_articles($country_code = null)
    {

        $limit = self::get_module(MY_MODULE_NAME_SERVICE)->get_max_last_country_articles();


        $country_component = components\Countries::get_instance();

        if (!$country_code) {
            $country_code = $country_component->get_country_code_from_url();
        }
        $country_id = $country_component->get_country_data_by_code($country_code);
        $country_id = $country_id['id'];

        $article_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);
        $condition = 'country_id=' . $country_id;
        $order = 'id DESC';
        $select = '*';
        $group = '';
        $need_result = false;
        $result = $article_model->get_by_condition($condition, $order, '', $select, $limit, $need_result);
        return $result;
    }















 */