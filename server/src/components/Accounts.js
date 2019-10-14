/*
 * File server/src/components/Accounts.js
 * const Accounts = require('server/src/components/Accounts');
 *
 * Accounts component - calculate user data
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const UsersRegisteredModel = require('server/src/models/dbase/mysql/UsersRegistered');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');


const Users = require('server/src/core/Users');






class Accounts extends Component {



    constructor(){
        super();
    }


    authentication()
    {
        let _usersInstance = Users.getInstance(this.requestId);

        _usersInstance.id = 1;
        _usersInstance.role = 1;//Consts.ACCOUNT_ROLE_ADMIN_CODE;
        _usersInstance.name = 'admin';
        return true;
        /*//ATTENTION - обратите внимание
        let hash = BaseFunctions.toString(Cookies.get('HASH'));
        let id = parseInt(Cookies.get('ID'));


        if (hash && id) {

            let users_registered_data = UsersRegisteredModel.get_by_id(id);

            if (users_registered_data['password_hash'] === hash) {
                this.id = parseInt(users_registered_data['id']);
                this.role = parseInt(users_registered_data['role']);
                this.name = users_registered_data['name'];
            } else {
                this.error(ErrorCodes.ERROR_USER_NOT_VERIFICATED);
            }
        }*/

    }






















}

Accounts.instanceId = BaseFunctions.uniqueId();
module.exports = Accounts;