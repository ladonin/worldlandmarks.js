/*
 * File application/express/components/base/Account.js
 * const Account = require('application/express/components/base/Account');
 *
 * Account component - calculate user data
 */

const Component = require('application/express/vendor/Component');
const Functions = require('application/express/functions/BaseFunctions');
const UsersRegistered = require('application/express/models/dbase/mysql/UsersRegistered');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const ErrorHandler = require('application/express/components/ErrorHandler');

const User = require('application/express/components/User');






class Account extends Component {



    constructor(){
        super();
    }


    authentication()
    {
        let userInstance = User.getInstance(this.requestId);

        userInstance.id = 1;
        userInstance.role = 1;
        userInstance.name = 'admin';
        return true;
        /*//ATTENTION - обратите внимание
        let hash = Functions.toString(Cookies.get('HASH'));
        let id = Functions.toInt(Cookies.get('ID'));


        if (hash && id) {

            let users_registered_data = UsersRegistered.get_by_id(id);

            if (users_registered_data['password_hash'] === hash) {
                this.id = Functions.toInt(users_registered_data['id']);
                this.role = Functions.toInt(users_registered_data['role']);
                this.name = users_registered_data['name'];
            } else {
                ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_USER_NOT_VERIFICATED);
            }
        }*/

    }


}

Account.instanceId = Functions.unique_id();
module.exports = Account;