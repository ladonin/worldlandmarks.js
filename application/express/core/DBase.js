/*
 * File application/express/core/DBase.js
 * const DBase = require('application/express/core/DBase');
 *
 * Databases manager
 */

const syncMySql = require('sync-mysql');
//const asyncMySql = require('mysql2');
//const Deasync = require('deasync');

const Core = require('application/express/core/Core');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Config = require('application/express/settings/Config.js');
const MySqlConfig = require('application/express/settings/gitignore/MySql');



class DBase extends Core {

    constructor() {
        super();

        /*
         * Mysql Database connection
         *
         * @type resource
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
    begin_transaction(type = 'mysql') {
        if (type === 'mysql') {
            this.getDbConnection().query('START TRANSACTION;');
        }
    }

    /*
     * Commit sync transaction
     */
    commit(type = 'mysql') {
        if (type === 'mysql') {
            this.getDbConnection().query('COMMIT;');
        }
    }

    /*
     * Rollback sync transaction
     */
    rollback(type = 'mysql') {
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
    createConnection(type = 'mysql') {

        if (type === 'mysql') {
            let _connection;
            //######################### Create connection #################################
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
            _connection = new syncMySql(MySqlConfig.connect);

            // Checking sync connection
            try {
                _connection.query("SELECT 1");
            } catch (e) {
                this.error(ErrorCodes.ERROR_DB_NO_CONNECT, 'mysql: ' + e.code);
            }

            return _connection;

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
    }

}

DBase.instanceId = BaseFunctions.unique_id();
module.exports = DBase;