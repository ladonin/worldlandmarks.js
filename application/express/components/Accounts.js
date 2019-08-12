/*
 * File application/express/components/Accounts.js
 * const Accounts = require('application/express/components/Accounts');
 *
 * Accounts component - calculate user data
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const UsersRegisteredModel = require('application/express/models/dbase/mysql/UsersRegistered');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');


const Users = require('application/express/core/Users');






class Accounts extends Component {



    constructor(){
        super();
    }


    authentication()
    {
        let _usersInstance = Users.getInstance(this.requestId);

        _usersInstance.id = 1;
        _usersInstance.role = 1;
        _usersInstance.name = 'admin';
        return true;
        /*//ATTENTION - обратите внимание
        let hash = BaseFunctions.toString(Cookies.get('HASH'));
        let id = BaseFunctions.toInt(Cookies.get('ID'));


        if (hash && id) {

            let users_registered_data = UsersRegisteredModel.get_by_id(id);

            if (users_registered_data['password_hash'] === hash) {
                this.id = BaseFunctions.toInt(users_registered_data['id']);
                this.role = BaseFunctions.toInt(users_registered_data['role']);
                this.name = users_registered_data['name'];
            } else {
                this.error(ErrorCodes.ERROR_USER_NOT_VERIFICATED);
            }
        }*/

    }






















}

Accounts.instanceId = BaseFunctions.unique_id();
module.exports = Accounts;