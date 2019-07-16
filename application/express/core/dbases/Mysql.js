/*
 * File application/express/core/dbases/Mysql.js
 * const DBaseMysql = require('application/express/core/dbases/Mysql');
 *
 * Base database component for MySql
 */

const syncMySql = require('sync-mysql');
//const asyncMySql = require('mysql2');
//const Deasync = require('deasync');
const MySqlConfig = require('application/express/settings/gitignore/MySql');
const Functions = require('application/express/functions/BaseFunctions');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Model = require('application/express/core/Model');



class DBaseMysql extends Model
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


        this.syncConnection;
        //this.asyncConnection;

        this.createConnections();
    }

    createConnections() {

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
        this.syncConnection = new syncMySql(MySqlConfig.connect);

        // Checking sync connection
        try {
            this.syncConnection.query("SELECT 1");
        } catch (e) {
            this.error(ErrorCodes.ERROR_DB_NO_CONNECT, 'mysql: ' + e.code);
        }

//        /*
//         * DB async connection
//         *
//         * @type resource
//         */
//        this.asyncConnection = asyncMySql.createPool(MySqlConfig.connect).promise();

        //##                                                                          ##
        //##                                                                          ##
        //##############################################################################
    }

////ATTENTION - обратите внимание
    snapshotFieldsData() {
        this.fields_initial_data = Functions.clone(this.fields);
    }

    reset_fields() {
        this.fields = Functions.clone(this.fields_initial_data);
    }

    /*
     * Get connection
     *
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return resource/object
     */
    get_connection()//async = false
    {
        return this.syncConnection;//async === true ? this.asyncConnection : this.syncConnection;
    }

    /*
     * Execute query and return result
     *
     * @param {string} - sql query
     * @param {array} values - values to be escaped
     * @param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects or empty array / promise}
     */
    query(sql, values = []) {//, async = false

        return this.query_sync(sql, values);//async === true ? this.query_async(sql, values) :
    }

    /*
     * Async query
     *
     * @param {string} - sql query
     * @param {array} values - values to be escaped
     *
     * @return promise
     */
//    query_async(sql, values = []) {
//        return this.get_connection()//true
//                .query(sql, values)
//                .catch(err => {
//                    this.error(
//                            ErrorCodes.ERROR_MYSQL
//                            + ': ' + err.code
//                            + ': request[' + sql + '], values[' + Functions.toString(values) + ']',
//                            Consts.LOG_MYSQL_TYPE
//                            );
//                })
//                .then((res) => {
//                    return res[0];
//                });
//    }

    /*
     * Sync query
     *
     * @param {string} - sql query
     * @param {array} values - values to be escaped
     *
     * @return {array of objects or empty array}
     */
    query_sync(sql, values = []) {
        try {
            return this.get_connection().query(sql, values);
        } catch (e) {
            this.error(
                    ErrorCodes.ERROR_MYSQL,
                    e.code + ': request[' + sql + '], values[' + Functions.toString(values) + ']',
                    Consts.LOG_MYSQL_TYPE);
    }
    }

    /*
     * Begin sync transaction
     */
    begin_transaction() {
        this.query('START TRANSACTION;');
    }

    /*
     * Commit sync transaction
     */
    commit() {
        this.query('COMMIT;');
    }

    /*
     * Rollback sync transaction
     */
    rollback() {
        this.query('ROLLBACK;');
    }



    /*
     * Get data by id
     *
     * @param {integer} idValue - id key value
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise}
     */
    getById(idValue)//, async = false
    {
        let _id = Functions.toInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + Functions.toString(idValue) + ']');
        }

        return this.query("SELECT * FROM " + this.table_name + " WHERE id = " + _id, []);//, async
    }

    /*
     * Validate all fields
     *
     * @param {string} filter_type - validation type
     *
     * @return {boolean}
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
     * @param {integer} idValue - row id
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
     * @param {integer} idValue - row id
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
     * @param {object} data - fields values {field_name:field_value}
     *
     * @return {boolean}
     */
    setValuesToFields(data)
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
     * @param {string} order - order type
     *
     * @return {string}
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
     * @param {array} limit - limit parameters [min, max]
     *
     * @return {string}
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
     * @param {string} condition - presentation of 'WHERE' condition
     * @param {string} order - presentation of 'ORDER BY' condition
     * @param {string} group - presentation of 'GROUP BY' condition
     * @param {string} select - presentation of 'SELECT'
     * @param {array} where_values - values to be escaped for 'WHERE' condition
     * @param {string} limit -  presentation of 'LIMIT'
     * @param {boolean} need_result - is result required
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise} - fetched data
     */
    getByCondition(condition = 1, order = '', group = '', select = '*', where_values = [], limit = false, need_result = true)//, async = false
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

        return this.fetchQuery(_sql, where_values, need_result);//, async
    }

    /*
     * Fetch data using straight sql query
     *
     * @param {string} sql - sql query
     * @param {array} whereValues - values to be escaped for 'WHERE' condition
     * @param {boolean} needResult - is result required
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise} - fetched data
     */
    fetchQuery(sql, whereValues = [], needResult = true) {//, async = false

        let _result = this.query(sql, whereValues);//, async

        function process_error() {
            this.error(
                    ErrorCodes.ERROR_MYSQL,
                    '|REQUIRED RESULT| request[' + sql + '], where_values[' + Functions.toString(whereValues) + ']',
                    Consts.LOG_MYSQL_TYPE
                    );
        }
        process_error = process_error.bind(this);

        if (needResult === true) {
//            if (async === true) {
//                // Async query
//                // We have promise
//                _result.then((res) => {
//                    if (!res.length) {
//                        process_error();
//                    } else {
//                        return res;
//                    }
//                });
//            } else {
            // Sync query
            if (!_result.length) {
                process_error();
            }
            //}
        }
        return _result;
    }

    /*
     * Fetch data by straight query string
     *
     * @param {string} sql
     * @param {array} whereValues - values to be escaped for 'WHERE' condition
     * @param {boolean} needResult - is result required
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise} - fetched data
     */
    getBySql(sql, whereValues = [], needResult = true)//, async = false
    {
        return this.fetchQuery(sql, whereValues, needResult);//, async
    }







    /*
     * Add new record
     *
     * @param {object} data - new record data
     *
     * @return {integer} - new record id
     */
    add(data)
    {
        this.setValuesToFields(data);
        return this.insert();
    }

    /*
     * Update existed record
     *
     * @param {object} data - record's new data with id
     */
    change(data)
    {
        let _id = data.id;
        delete data.id;
        this.setValuesToFields(data);
        this.update(_id);
    }

}

DBaseMysql.instanceId = Functions.unique_id();
module.exports = DBaseMysql;