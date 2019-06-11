/*
 * File application/express/components/base/Account.js
 *
 * Account component
 */

const Component = require('vendor/Component');

const Cookies = require('application/express/components/base/Cookies');
const Functions = require('application/express/functions/BaseFunctions');
const UsersRegistered = require('application/express/models/dbase/mysql/UsersRegistered');
const Consts = require('application/express/settings/Constants');



class Account extends Component {



    constructor(){
        super();

        /*
         *  Account id
         *
         * @type number
         */
        this.id;

        /*
         *  Account role
         *
         * @type string
         */
        this.role;

        /*
         *  Account name
         *
         * @type string
         */
        this.name;

    }


    authentication()
    {
        let hash = Functions.toString(Cookies.get('HASH'));
        let id = Functions.toInt(Cookies.get('ID'));


        if (hash && id) {

            let users_registered_data = UsersRegistered.get_by_id(id);

            if (users_registered_data['password_hash'] === hash) {
                this.id = Functions.toInt(users_registered_data['id']);
                this.role = Functions.toInt(users_registered_data['role']);
                this.name = users_registered_data['name'];
            } else {
                ErrorHandler.process(ErrorCodes.ERROR_USER_NOT_VERIFICATED);
            }
        }
    }

    is_admin()
    {
        if ((this.id) && (this.role === Consts.ACCOUNT_ROLE_ADMIN_CODE) ||



                //Admin_Access.autorize() - сессий не будет



                (isset($_SESSION['admin_access_autorize']) && $_SESSION['admin_access_autorize'] === true)) {
            return true;
        }
    }
}
module.exports = Account;








}
