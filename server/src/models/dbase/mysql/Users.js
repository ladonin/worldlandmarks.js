/*
 * File server/src/models/dbase/mysql/Users.js
 * const UsersModel = require('server/src/models/dbase/mysql/Users');
 *
 * Users MySql db model
 */

const DBaseMysql = require('server/src/core/dbases/Mysql');
const BaseFunctions = require('server/src/functions/BaseFunctions');

class Users extends DBaseMysql
{

    constructor() {
        super();

        this.tableNameInit = this.tableInitNames.USERS;

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


    /*
     * Get user data by email
     *
     * @param {string} email
     *
     * @return {object}
     */
    getByEmail(email){

        return this.getByCondition(
            /*condition*/'email=?',
            /*order*/'',
            /*group*/'',
            /*select*/'*',
            /*where_values*/[email],
            /*limit*/1,
            /*need_result*/false
        )[0];
    }












}

Users.instanceId = BaseFunctions.uniqueId();

module.exports = Users;



//ATTENTION - обратите внимание
//    public function add_new_user($data)
//    {
//        $this->set_values_to_fields($data);
//
//        return $this->insert();
//    }
