/*
 * File application/express/core/Users.js
 * const Users = require('application/express/core/Users');
 *
 * Users class - keeps user data
 */


const Core = require('application/express/core/Core');
const AccessConfig = require('application/express/settings/gitignore/Access');

const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class Users extends Core
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
     * @return {boolean}
     */
    admin_access_authentication()
    {
        if (this.getFromRequest(Consts.ADMIN_PASSWORD_VAR_NAME) !== AccessConfig['admin_password']) {
            return false;
        }
        return true;
    }
}


Users.instanceId = BaseFunctions.unique_id();


module.exports = Users;