/*
 * File server/src/components/base/DBase.js
 * const DBase = require('server/src/components/base/DBase');
 *
 * Databases manager
 */

const mysql = require('mysql');

const Core = require('server/src/core/parents/Core');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Config = require('server/src/settings/Config.js');
const MySqlConfig = require('server/src/settings/gitignore/MySql');


class DBase extends Core
{

    constructor()
    {
        super();

        /*
         * Mysql Database connection
         *
         * @type {object}
         */
        this.mysqlDbConnection = false;

        // ... another dbases
    }


    /*
     * Get db connection - mysql, redis etc.
     *
     * @param {string} type - db type
     *
     * @return {object}
     */
    getDbConnection(type = 'mysql')
    {
        if (type === 'mysql') {
            if (this.mysqlDbConnection === false) {
                //if (Config.db.type === 'mysql') {
                this.mysqlDbConnection = this.createConnection();
                //}
            }
            return this.mysqlDbConnection;
        }
    // ... another dbases
    }


    /*
     * Begin sync transaction
     */
    begin_transaction(type = 'mysql')
    {
        if (type === 'mysql') {
            this.getDbConnection().query('START TRANSACTION;');
        }
    }


    /*
     * Commit sync transaction
     */
    commit(type = 'mysql')
    {
        if (type === 'mysql') {
            this.getDbConnection().query('COMMIT;');
        }
    }


    /*
     * Rollback sync transaction
     */
    rollback(type = 'mysql')
    {
        if (type === 'mysql') {
            this.getDbConnection().query('ROLLBACK;');
        }
    }


    /*
     * Create db connection
     *
     * @param {string} type - db type
     *
     * @returns {object}
     */
    createConnection(type = 'mysql')
    {
        if (type === 'mysql') {

            /*
             * DB async connection
             *
             * @type {object}
             */
            let _connection = mysql.createConnection(MySqlConfig.connect);
            _connection.connect();

            return _connection;

        }
    }


    /*
     * Close db connections
     *
     * @param {string} type - db type
     *
     * @returns {object}
     */
    closeConnection(type = 'mysql')
    {
        if (type === 'mysql') {
            // Only if was created
            if (this.mysqlDbConnection !== false) {
                this.mysqlDbConnection.end();
            }
        }
    }
}

DBase.instanceId = BaseFunctions.uniqueId();
module.exports = DBase;