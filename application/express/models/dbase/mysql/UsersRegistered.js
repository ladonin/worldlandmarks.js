/*
 * File application/express/models/dbase/mysql/UsersRegistered.js
 * const UsersRegistered = require('application/express/models/dbase/mysql/UsersRegistered');
 *
 * Users registered MySql db model
 */

const DBaseMysql = require('application/express/vendor/dbases/Mysql');


class Users_Registered extends DBaseMysql
{


    constructor(){
        super();

        this.table_name = 'users_registered';

        this.fields = {
            role:{
                'rules':['numeric', 'required'],
                //'processing':['htmlspecialchars'],
            },
            name:{
                'rules':['word', 'required'],
                //'processing':['htmlspecialchars'],
            },
            password_hash:{
                'rules':['hash', 'required'],
                //'processing':['htmlspecialchars'],
            },
        };
        this.snapshot_fields_data();
}

    add_new_user(data)
    {
        this.set_values_to_fields(data);

        return this.insert();
    }

}






