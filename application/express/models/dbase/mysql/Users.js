/*
 * File application/express/models/dbase/mysql/Users.js
 * const UsersModel = require('application/express/models/dbase/mysql/Users');
 *
 * Users MySql db model
 */

const DBaseMysql = require('application/express/core/dbases/Mysql');
const BaseFunctions = require('application/express/functions/BaseFunctions');

class Users extends DBaseMysql
{

    constructor() {
        super();

        this.tableName;

        this.fields = {
            email: {
                'rules': ['email', 'required'],
            },
            password_hash: {
                'rules': ['hash', 'required'],
            },
        };
        this.snapshotFieldsData();
    }

    getTableName() {
        if (!this.tableName) {
            this.tableName = 'users';
        }
        return this.tableName;
    }

    /*
     * Get user data by email
     *
     * @param {string} email
     *
     * @return {object}
     */
    getByEmail(email){

        return this.getByCondition(
            condition = 'email=?',
            order = '',
            group = '',
            select = '*',
            where_values = [email],
            limit = 1,
            need_result = false
        )[0];
    }












}

Users.instanceId = BaseFunctions.unique_id();

module.exports = Users;



//ATTENTION - обратите внимание
//    public function add_new_user($data)
//    {
//        $this->set_values_to_fields($data);
//
//        return $this->insert();
//    }
