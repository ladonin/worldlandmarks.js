/*
 * File application/express/models/dbase/mysql/UsersRegistered.js
 * const UsersRegisteredModel = require('application/express/models/dbase/mysql/UsersRegistered');
 *
 * Users registered MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');

class UsersRegistered extends DBaseMysql
{

    constructor() {
        super();

        this.tableName;

        this.fields = {
            role: {
                'rules': ['numeric', 'required'],
                //'processing':['htmlspecialchars'],
            },
            name: {
                'rules': ['word', 'required'],
                //'processing':['htmlspecialchars'],
            },
            password_hash: {
                'rules': ['hash', 'required'],
                //'processing':['htmlspecialchars'],
            },
        };
        this.snapshotFieldsData();
    }

    getTableName() {
        if (!this.tableName) {
            this.tableName = 'users_registered';
        }
        return this.tableName;
    }
}





UsersRegistered.instanceId = BaseFunctions.unique_id();

module.exports = UsersRegistered;
