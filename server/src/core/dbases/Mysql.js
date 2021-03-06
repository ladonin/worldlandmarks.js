/*
 * File server/src/core/dbases/Mysql.js
 * const DBaseMysql = require('server/src/core/dbases/Mysql');
 *
 * Base database component for MySql
 */

const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const Model = require('server/src/core/parents/Model');
const DBase = require('server/src/components/base/DBase');
const TableNames = require('server/src/models/dbase/TableNames');
const TableNamesConstants = require('server/src/settings/TableNames');
const Deasync = require('deasync');


class DBaseMysql extends Model
{

    constructor()
    {
        super();

        /*
         * Table name
         *
         * @type string
         */
        this.tableName;

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
        this.fieldsInitialData;

        /*
         * Collection of initial db table names
         *
         * @type object
         */
        this.tableInitNames = TableNamesConstants;
    }


    snapshotFieldsData()
    {
        this.fieldsInitialData = BaseFunctions.clone(this.fields);
    }


    reset_fields()
    {
        this.fields = BaseFunctions.clone(this.fieldsInitialData);
    }


    /*
     * Get connection
     *
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return resource/object
     */
    getConnection()//async = false
    {
        return DBase.getInstance(this.requestId).getDbConnection();//async === true ? this.asyncConnection : this.syncConnection;
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
    query(sql, values = []) //, async = false
    {

        return this.queryAsync(sql, values);//async === true ? this.queryAsync(sql, values) :
    }


    /*
     * Async query
     *
     * @param {string} - sql query
     * @param {array} values - values to be escaped
     *
     * @return promise
     */
    queryAsync(sql, values = [])
    {

        let _finished = false;
        let _result;
        let _error = false;

        this.getConnection().query(sql, values, function (error, result, fields) {
            _finished = true;
            if (error) {
                _error = error;
            } else {
                _result = result;
            }
        });

       // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !_finished;
        });

        if (_error !== false) {
            this.error(
                ErrorCodes.ERROR_MYSQL,
                _error.code + ': request[' + sql + '], values[' + BaseFunctions.toString(values) + ']',
                Consts.LOG_MYSQL_TYPE
                );
        }

        return _result;
    }


    /*
     * Sync query
     *
     * @param {string} - sql query
     * @param {array} values - values to be escaped
     *
     * @return {array of objects or empty array}
     */
    querySync(sql, values = [])
    {
        try {
            let _result = this.getConnection().query(sql, values);
            this.getConnection().release();
            return _result;
        } catch (e) {
            this.error(
                    ErrorCodes.ERROR_MYSQL,
                    e.code + ': request[' + sql + '], values[' + BaseFunctions.toString(values) + ']',
                    Consts.LOG_MYSQL_TYPE);
        }
    }


    /*
     * Get data by id
     *
     * @param {integer} idValue - id key value
     * @param {array} select - fields to be selected (by default - all)
     * //@param {boolean} async - whether we use async query or sync
     * @param {boolean} needResult - whether result is required
     *
     * @return {array of objects / promise}
     */
    getById(idValue, select = '*', needResult = true)//, async = false
    {
        let _id = parseInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + BaseFunctions.toString(idValue) + ']');
        }
        if (BaseFunctions.isArray(select)) {
            select = select.join(',');
        }
        return this.query("SELECT " + select + " FROM " + this.getTableName() + " WHERE id = " + _id, [])[0];//, async
    }


    /*
     * Validate all fields
     *
     * @param {string} filter_type - validation type
     *
     * @return {boolean}
     */
    filterAllFields(filterType = Consts.FILTER_TYPE_ALL)
    {
        // Check all model fields
        for (let _key in this.fields) {
            this.filter(_key, this.fields[_key]['value'], filterType);
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
        let _id = parseInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + BaseFunctions.toString(idValue) + ']');
        }

        this.filterAllFields(Consts.FILTER_TYPE_WITHOUT_REQUIRED);

        let _arrayValues = [];

        let _sql = 'update ' + this.getTableName() + " set modified='" + BaseFunctions.get_current_time() + "'";

        for (let _field_name in this.fields) {

            let _field = this.fields[_field_name];

            // Field (column) will be updated ONLY if we set a value to field
            if (BaseFunctions.isSet(_field['value'])) {

                /*
                 * Rule 'none' tells that we should not update this field by hand
                 * For example - 'created' field (if specified in model fields)
                 */
                if (BaseFunctions.inArray('none', _field['rules'])) {
                    continue;
                }

                _sql += ',' + _field_name + '=?';

                this.processing_value(_field);
                _arrayValues.push(_field['value']);
            }
        }
        _sql += ' where id = ' + parseInt(_id);

        this.query(_sql, _arrayValues);

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
        this.filterAllFields(Consts.FILTER_TYPE_ONLY_REQUIRED);

        let _arrayValues = [];

        let _sql = 'insert into ' + this.getTableName();
        let _sqlFields = 'created,modified';
        let _sqlValues = BaseFunctions.get_current_time() + ',' + BaseFunctions.get_current_time();

        for (let _fieldName in this.fields) {
            let _field = this.fields[_fieldName];

            /*
             * Rule 'none' tells that we should not set this field by hand
             * For example - 'created' field (if specified in model fields)
             */
            if (BaseFunctions.inArray('none', _field['rules'])) {
                continue;
            }

            _sqlFields += ',' + _fieldName;
            _sqlValues += ',?';

            this.processing_value(_field);
            _arrayValues.push(BaseFunctions.isSet(_field['value']) ? _field['value'] : null);
        }

        _sql += '(' + _sqlFields + ') values (' + _sqlValues + ')';

        let _result = this.query(_sql, _arrayValues);

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
        let _id = parseInt(idValue);

        if (!_id) {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'id [ ' + BaseFunctions.toString(idValue) + ']');
        }

        sql = 'DELETE FROM ' + this.getTableName() + ' WHERE id = ' + _id;
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
        for (let _fieldName in data) {

            let _fieldValue = this.preparingValue(_fieldName, data[_fieldName]);
            this.filter(_fieldName, _fieldValue, Consts.FILTER_TYPE_WITHOUT_REQUIRED);
            if (!_fieldValue && BaseFunctions.is_not_empty(this.fields[_fieldName]['default_value'])) {
                _fieldValue = this.fields[_fieldName]['default_value'];
            }
            this.fields[_fieldName]['value'] = _fieldValue;
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
    returnOrder(order)
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
    returnLimit(limit = [1])
    {
        if (parseInt(limit[1]) > 0) {
            return  parseInt(limit[0]) + ',' + parseInt(limit[1]);
        } else if (parseInt(limit[0]) > 0) {
            return parseInt(limit[0]);
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
     * @param {boolean} needresult - is result required
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise} - fetched data
     */
    getByCondition(condition = 1, order = '', group = '', select = '*', whereValues = [], limit = false, needresult = true)//, async = false
    {
        let _sql = 'SELECT ' + select + ' FROM ' + this.getTableName() + ' WHERE ' + condition;

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

        return this.fetchQuery(_sql, whereValues, needresult);//, async
    }


    /*
     * Fetch data using straight sql query
     *
     * @param {string} sql - sql query
     * @param {array} whereValues - values to be escaped for 'WHERE' condition
     * @param {boolean} needResult - whether result is required
     * //@param {boolean} async - whether we use async query or sync
     *
     * @return {array of objects / promise} - fetched data
     */
    fetchQuery(sql, whereValues = [], needResult = true) //, async = false
    {
        let _result = this.query(sql, whereValues);//, async

        function processError() {
            this.error(
                    ErrorCodes.ERROR_MYSQL,
                    '|REQUIRED RESULT| request[' + sql + '], where_values[' + BaseFunctions.toString(whereValues) + ']',
                    Consts.LOG_MYSQL_TYPE
                    );
        }
        processError = processError.bind(this);

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
                processError();
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
     * @param {boolean} needResult - whether result is required
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


    /*
     * Get db table name
     *
     * @param {string} name - initial table name
     *
     * @return {string} - prepared table name
     */
    getTableName(name)
    {
        let _tableNamesInstance = TableNames.getInstance(this.requestId);

        if (!name) {
            // It means that we want to get our own table name

            name = this.tableNameInit;

            if (!this.tableName) {
                this.tableName = _tableNamesInstance.getTableName(name);
            }
            return this.tableName;
        }

        return _tableNamesInstance.getTableName(name);

    }
}

module.exports = DBaseMysql;