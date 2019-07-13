/*
 * File application/express/core/DBase.js
 * const DBase = require('application/express/core/DBase');
 *
 * Database component
 */

const Core = require('application/express/core/Core');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Config = require('application/express/settings/Config.js');
const DBaseMysql = require('application/express/core/dbases/Mysql');




class DBase extends Core {

    constructor() {
        super();

        /*
         * Database connection model
         *
         * @type resource
         */
        this.db;
    }


    /*
     * Get db - mysql, redis etc.
     *
     * @return {string}
     */
    getDb()
    {
        if (!this.db) {
            if (Config.db.type === 'mysql') {
                this.db = DBaseMysql.getInstance(this.requestId);
            }
        }
        return this.db;
    }
}

DBase.instanceId = BaseFunctions.unique_id();
module.exports = DBase;