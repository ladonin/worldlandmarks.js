/*
 * File application/express/components/User.js
 * const User = require('application/express/components/User');
 *
 * User component - keeps user data and some arbitrary methods
 */


const Component = require('application/express/vendor/Component');
const AccessConfig = require('application/express/settings/gitignore/Access');
const Request = require('application/express/components/base/Request');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class User extends Component
{

    constructor(){
        super();

        /*
         *  User id
         *
         * @type number
         */
        this.id;

        /*
         *  User role
         *
         * @type string
         */
        this.role;

        /*
         *  User name
         *
         * @type string
         */
        this.name;

    }

    is_admin()
    {
        if ((this.id) && (this.role === Consts.ACCOUNT_ROLE_ADMIN_CODE)) {
            return true;
        }
        return false;
    }

    
    /*
     * Admin access authorization via GET vars
     *
     * @return boolean
     */
    admin_access_authentication()
    {
        if (Request.get(Consts.ADMIN_PASSWORD_VAR_NAME) !== AccessConfig['admin_password']) {
            return false;
        }
        return true;
    }
}


User.instanceId = BaseFunctions.unique_id();


module.exports = User;