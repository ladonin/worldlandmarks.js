/*
 * File application/express/models/dbase/mysql/UsersRegistered.js
 *
 * Users registered MySql db model
 */

const DBaseMysql = require('application/express/vendor/dbases/DBaseMysql');


class Users_Registered extends DBaseMysql
{

    get_table_name()
    {
        if (!this.table_name) {
            this.table_name = 'users_registered';
        }
        return this.table_name;
    }
    constructor(){
        super();
        this.fields = {
            'role':{
                'rules':['numeric', 'required'],
                //'processing':['htmlspecialchars'],
            },
            'name':{
                'rules':['word', 'required'],
                //'processing':['htmlspecialchars'],
            },
            'password_hash':{
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






