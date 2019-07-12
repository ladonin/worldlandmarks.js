/*
 * File application/express/components/Account.js
 * const Account = require('application/express/components/Account');
 *
 * Account component - calculate user data
 */

const Component = require('application/express/vendor/Component');
const Functions = require('application/express/functions/BaseFunctions');
const UsersRegistered = require('application/express/models/dbase/mysql/UsersRegistered');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');


const User = require('application/express/components/User');






class Account extends Component {



    constructor(){
        super();
    }


    authentication()
    {
        let _userInstance = User.getInstance(this.requestId);

        _userInstance.id = 1;
        _userInstance.role = 1;
        _userInstance.name = 'admin';
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
                this.error(ErrorCodes.ERROR_USER_NOT_VERIFICATED);
            }
        }*/

    }


}

Account.instanceId = Functions.unique_id();
module.exports = Account;