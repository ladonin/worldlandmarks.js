/*
 * File server/src/models/dbase/mysql/UsersRegistered.js
 * const UsersRegisteredModel = require('server/src/models/dbase/mysql/UsersRegistered');
 *
 * Users registered MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');


class UsersRegistered extends DBaseMysql
{

    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.USERS_REGISTERED;

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
}





UsersRegistered.instanceId = BaseFunctions.unique_id();

module.exports = UsersRegistered;
