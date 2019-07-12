/*
 * File application/express/vendor/dbases/Mysql.js
 * const DBaseMysql = require('application/express/vendor/dbases/Mysql');
 *
 * Base database component for MySql
 */

//const syncMySql = require('sync-mysql');
const asyncMySql = require('mysql2');
const Deasync = require('deasync');
const MySqlConfig = require('application/express/settings/gitignore/MySql');
const Functions = require('application/express/functions/BaseFunctions');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Service = require('application/express/components/base/Service');
const User = require('application/express/components/User');
const Model = require('application/express/vendor/Model');



class DBase_Mysql extends Model
{

    constructor() {
        super();

        /*
         * Table name
         *
         * @type string
         */
        this.table_name;

        /*
         * DB table Fields
         *
         * @type object
         */
        this.fields;

        /*
         * Initial db fields data for returning updated fields to initial statement
         *
         * @type object
         */
        this.fields_initial_data;


        //this.syncConnection;
        this.asyncConnection;
        this.createConnections();
    }


    createConnections(){

        //######################### Create connections #################################
        //##                                                                          ##
        //##                                                                          ##

        // You can use only one of two connections per request
        //
        // If your request requires only fetching data from db (SELECT queries)
        // then you can use either async or sync conneection
        //
        // If your request also make changes in db,
        // then you should use ONLY sync connection to provide correct transaction work
        //
        // Connection by default is sync

        /*
         * DB sync connection
         * Use in requests where needed db changes
         *
         * @type object
         */
//        this.syncConnection = new syncMySql(MySqlConfig.connect);
//
//        // Checking sync connection
//        try {
//            this.syncConnection.query("SELECT 1");
//        } catch (e) {
//            this.error(ErrorCodes.ERROR_DB_NO_CONNECT, 'mysql: ' + e.code);
//        }

        /*
         * DB async connection
         *
         * @type resource
         */
        this.asyncConnection = asyncMySql.createPool(MySqlConfig.connect).promise();

        //##                                                                          ##
        //##                                                                          ##
        //##############################################################################
    }




////ATTENTION - обратите внимание
    snapshot_fields_data() {
        this.fields_initial_data = Functions.clone(this.fields);
    }

    reset_fields() {
        this.fields = Functions.clone(this.fields_initial_data);
    }

    /*
     * Get connection
     *
     * @param boolean async - whether we use async query or sync
     *
     * @return resource/object
     */
    get_connection()//async = false
    {
        return this.asyncConnection;//async === true ? this.asyncConnection : this.syncConnection;
    }

    /*
     * Execute query and return result
     *
     * @param string - sql query
     * @param array values - values to be escaped
     * @param boolean async - whether we use async query or sync
     *
     * @return array of objects or empty array / promise
     */
    query(sql, values = [], async = false) {

        return async === true ? this.query_async(sql, values) : this.query_sync(sql, values);
    }

    /*
     * Async query
     *
     * @param string - sql query
     * @param array values - values to be escaped
     *
     * @return promise
     */
    query_async(sql, values = []) {
        return this.get_connection()//true
                .query(sql, values)
                .catch(err => {
                    this.error(
                            ErrorCodes.ERROR_MYSQL
                            + ': ' + err.code
                            + ': request[' + sql + '], values[' + Functions.toString(values) + ']',
                            Consts.LOG_MYSQL_TYPE
                            );
                })
                .then((res) => {
                    return res[0];
                });
    }

    /*
     * Sync query
     *
     * @param string - sql query
     * @param array values - values to be escaped
     *
     * @return array of objects or empty array
     */
    query_sync(sql, values = []) {
        let _result = [];
        let _done = false;

        this.query_async(sql, values).then((res) => {
                    _done = true;
                    _result = res[0];
                });

        Deasync.loopWhile(function () {
            return !_done;
        });

        return _result;
    }





    /*
     * Begin sync transaction
     */
    begin_transaction(){
        this.query('START TRANSACTION;');
    }


    /*
     * Commit sync transaction
     */
    commit(){
        this.query('COMMIT;');
    }


    /*
     * Rollback sync transaction
     */
    rollback(){
        this.query('ROLLBACK;');
    }


    /*
     * Processing field value according its 'processing' settings
     *
     * @param array field - field data
     */
    processing_value(field)
    {
        if (Functions.is_not_empty(field['processing']) && Functions.is_not_empty(field['value'])) {

            // Delete all html tags
            // Attention: if used then 'htmlspecialchars' has no sense
            // Attention: html tags created subsequently will not be deleted
            if (Functions.in_array("strip_tags", field['processing'])) {
                field['value'] = Functions.strip_tags(field['value']);
            }

            // Convert html tags into simple entities
            // Attention: html tags created subsequently will not be converted
            if (Functions.in_array("htmlspecialchars", field['processing'])) {
                field['value'] = Functions.escapeHtml(field['value']);
            }

            // Convert special tags into html tags
            if (Functions.in_array("spec_tags", field['processing'])) {

                let _tags = Service.get_text_form_tags();

                for (let _index in _tags) {
                    let _tag = _tags[_index];

                    if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_B) {

                        field['value'] = field['value'].replace(/\[b\](.+?)\[\/b\]/g, '<b>$1</b>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_P) {

                        // Also remove new lines in and after paragraph
                        field['value'] = field['value'].replace(/\[p\]((?:.*?[\n\r]?.*?)*?)\[\/p\][\n\r]*/gm, function (matches, part1) {
                            return '<p class="text_form_tag_p">' + part1.replace(/[\r\n]*/g, '') + '</p>';
                        });

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_STRONG) {

                        field['value'] = field['value'].replace(/\[strong\](.+?)\[\/strong\]/g, '<strong>$1</strong>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_A) {

                        let _follow = ' rel="nofollow"';
                        if (User.is_admin()) {
                            _follow = '';
                        }
                        field['value'] = field['value'].replace(/\[a\=(.+?)\](.+?)\[\/a\]/g, '<a href="$1"' + _follow + '>$2</a>');
                        field['value'] = field['value'].replace(/\[a\=(.+?)\]\[\/a\]/g, '<a href="$1"' + _follow + '>$1</a>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_IMAGE_ADVANCED) {

                        field['value'] = field['value'].replace(/\[img url=\"(.+?)\" style=\"(.+?)\"]/g, '<img src="$1" style="$2"/>');

                    }
                }
            }

            // Delete special tags
            // Attention: works after 'spec_tags' and if 'spec_tags' is used then only rest special tags not processed by 'spec_tags' will be deleted
            if (Functions.in_array("strip_spec_tags", field['processing'])) {
                field['value'] = field['value'].replace(/\[.*?\]/gi, '');
            }

            // Convert text urls into links
            if (Functions.in_array("urls", field['processing'])) {

                if (((User.is_admin() || User.admin_access_authentication()) && Service.is_available_to_process_links_in_text_for_admin())
                        || Service.is_available_to_process_links_in_text_for_free_users()) {

                    // Mask already existed links
                    field['value'] = field['value'].replace(/<a href=\"(https|http)/g, '<a href="$1_mask');
                    field['value'] = field['value'].replace(/<img src=\"(https|http)/g, '<img src="$1_mask');

                    // Process links
                    field['value'] = field['value'].replace(/([^\"]?)\b((http(s?):\/\/)(?:www\.)?)([\w\.\:\-]+)([\/\%\w+\.\:\-#\(\)]+)([\?\w+\.\:\=\-#\(\)]+)([\&\w+\.\:\=\-#\(\)]+)\b([\-]?)([\/]?)/g, '$1 <a href=\"http$4://$5$6$7$8$9$10\" target=\"_blank\">$5$6$7$8$9$10</a>');

                    // Unmask processed links
                    field['value'] = field['value'].replace(/<a href=\"http_mask/g, '<a href="http');
                    field['value'] = field['value'].replace(/<a href=\"https_mask/g, '<a href="https');
                    field['value'] = field['value'].replace(/<img src=\"http_mask/g, '<img src="http');
                    field['value'] = field['value'].replace(/<img src=\"https_mask/g, '<img src="https');
                }
            }

            // Convert new lines into <br/> tags
            if (in_array("new_line", field['processing'])) {
                field['value'] = field['value'].replace(/\r/g, '');
                field['value'] = field['value'].replace(/\n/g, '<br/>');
            }
        }
    }






    /*
     * Get data by id
     *
     * @param integer idValue - id key value
     * @param boolean async - whether we use async query or sync
     *
     * @return array of objects / promise
     */
    get_by_id(idValue, async = false)
    {
        let _id = Functions.toInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + Functions.toString(idValue) + ']');
        }

        return this.query("SELECT * FROM " + this.table_name + " WHERE id = " + _id, [], async);
    }

    /*
     * Validate all fields
     *
     * @param string filter_type - validation type
     *
     * @return boolean
     */
    filter_all_fields(filter_type = Consts.FILTER_TYPE_ALL)
    {
        // Check all model fields
        for (let _key in this.fields) {
            this.filter(_key, this.fields[_key]['value'], filter_type);
        }
        return true;
    }

    /*
     * Sync update field by id
     *
     * @param integer idValue - row id
     */
    update(idValue)
    {

        let _id = Functions.toInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + Functions.toString(idValue) + ']');
        }

        this.filter_all_fields(Consts.FILTER_TYPE_WITHOUT_REQUIRED);

        array_values = [];

        let _sql = 'update ' + this.table_name + " set modified='" + Functions.get_current_time() + "'";

        for (let _field_name in this.fields) {

            let _field = this.fields[_field_name];

            // Field (column) will be updated ONLY if we set a value to field
            if (Functions.isSet(_field['value'])) {

                /*
                 * Rule 'none' tells that we should not update this field by hand
                 * For example - 'created' field (if specified in model fields)
                 */
                if (Functions.in_array('none', _field['rules'])) {
                    continue;
                }

                _sql += ',' + _field_name + '=?';

                this.processing_value(_field);
                array_values.push(_field['value']);
            }
        }
        _sql += ' where id = ' + Functions.toInt(_id);

        this.query(_sql, array_values);

        // Reset field to initial values
        this.reset_fields();
    }



    /*
     * Sync insert new record
     *
     * @return integer - new record id
     */
    insert()
    {
        this.filter_all_fields(Consts.FILTER_TYPE_ONLY_REQUIRED);

        array_values = [];

        let _sql = 'insert into ' + this.table_name;
        let _sql_fields = 'created,modified';
        let _sql_values = Functions.get_current_time() + ',' + Functions.get_current_time();

        for (let _field_name in this.fields) {
            let _field = this.fields[_field_name];

            /*
             * Rule 'none' tells that we should not set this field by hand
             * For example - 'created' field (if specified in model fields)
             */
            if (Functions.in_array('none', _field['rules'])) {
                continue;
            }

            _sql_fields += ',' + _field_name;
            _sql_values += ',?';

            this.processing_value(_field);
            array_values.push(Functions.isSet(_field['value']) ? _field['value'] : null);
        }

        _sql += '(' + _sql_fields + ') values (' + _sql_values + ')';

        let _result = this.query(_sql, array_values);

        // Reset field to initial values
        this.reset_fields();

        return _result.insertId;
    }

    /*
     * Sync delete record by id
     *
     * @param integer idValue - row id
     *
     * @return integer - number of deleted rows
     */
    delete(idValue)
    {
        let _id = Functions.toInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + Functions.toString(idValue) + ']');
        }

        sql = 'DELETE FROM ' + this.table_name + ' WHERE id = ' + _id;
        let _result = this.query(sql);

        return _result.affectedRows;

    }

    /*
     * Set values to fields checking each value according with field rules
     *
     * @param object data - fields values {field_name:field_value}
     *
     * @return boolean
     */
    set_values_to_fields(data)
    {

        for (let _field_name in data) {
            let _field_value = data[_field_name];
            this.filter(_field_name, _field_value, Consts.FILTER_TYPE_WITHOUT_REQUIRED);
            if (!_field_value && Functions.is_not_empty(this.fields[_field_name]['default_value'])) {
                _field_value = this.fields[_field_name]['default_value'];
            }
            this.fields[_field_name]['value'] = _field_value;
        }
        return true;
    }

    /*
     * Prepare type order for select query
     *
     * @param string order - order type
     *
     * @return string
     */
    return_order(order)
    {

        if (order === 'asc') {
            return order;
        }

        return 'desc';
    }

    /*
     * Prepare limit to query
     *
     * @param array limit - limit parameters [min, max]
     *
     * @return string
     */
    return_limit(limit = [1])
    {
        if (Functions.toInt(limit[1]) > 0) {
            return  Functions.toInt(limit[0]) + ',' + Functions.toInt(limit[1]);
        } else if (Functions.toInt(limit[0]) > 0) {
            return Functions.toInt(limit[0]);
        } else {
            return '1';
    }
    }

    /*
     * Get data by condition
     *
     * @param string condition - presentation of 'WHERE' condition
     * @param string order - presentation of 'ORDER BY' condition
     * @param string group - presentation of 'GROUP BY' condition
     * @param string select - presentation of 'SELECT'
     * @param string limit -  presentation of 'LIMIT'
     * @param boolean need_result - is result required
     * @param array where_values - values to be escaped for 'WHERE' condition
     * @param boolean async - whether we use async query or sync
     *
     * @return array of objects / promise - fetched data
     */
    get_by_condition(condition = 1, order = '', group = '', select = '*', limit = false, need_result = true, where_values = [], async = false)
    {
        let _sql = 'SELECT ' + select + ' FROM ' + this.table_name + ' WHERE ' + condition;

        if (group) {
            _sql += ' GROUP BY ' + group + ' ';
        }
        if (order) {
            _sql += ' ORDER BY ' + order + ' ';
        }
        if (limit) {
            // LIMIT = 1 or LIMIT > 1 or LIMIT = LIMIT + OFFSET
            _sql += ' limit ' + limit;
        }

        return this.fetch_query(_sql, need_result, where_values, async);
    }

    /*
     * Fetch data using straight sql query
     *
     * @param string sql - sql query
     * @param boolean need_result - is result required
     * @param array where_values - values to be escaped for 'WHERE' condition
     * @param boolean async - whether we use async query or sync
     *
     * @return array of objects / promise - fetched data
     */
    fetch_query(sql, need_result = true, where_values = [], async = false) {

        let _result = this.query(sql, where_values, async);

        function process_error() {
            this.error(
                    ErrorCodes.ERROR_MYSQL
                    + ': request[' + sql + '], where_values[' + Functions.toString(where_values) + ']',
                    Consts.LOG_MYSQL_TYPE
                    );
        }

        if (need_result === true) {
            if (async === true) {
                // Async query
                // We have promise
                _result.then((res) => {
                    if (!res.length) {
                        process_error();
                    } else {
                        return res;
                    }
                });
            } else {
                // Sync query
                if (!_result.length) {
                    process_error();
                }
            }
        }
        return _result;
    }

    /*
     * Fetch data by straight query string
     *
     * @param string sql
     * @param boolean need_result - is result required
     * @param array where_values - values to be escaped for 'WHERE' condition
     * @param boolean async - whether we use async query or sync
     *
     * @return array of objects / promise - fetched data
     */
    get_by_sql(sql, need_result = true, where_values = [], async = false)
    {
        return this.fetch_query(sql, need_result, where_values, async);
    }






}

DBase_Mysql.instanceId = Functions.unique_id();
module.exports = DBase_Mysql;