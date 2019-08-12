/*
 * File application/express/core/Users.js
 * const Users = require('application/express/core/Users');
 *
 * Users class - store user data
 */


const Core = require('application/express/core/parents/Core');
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

    isAdmin()
    {
        if ((this.id) && (this.role === Consts.ACCOUNT_ROLE_ADMIN_CODE)) {
            return true;
        }
        return false;
    }


    /*
     * Check whether the user has admin access or not via GET vars
     *
     * @return {boolean}
     */
    checkAdminAccess()
    {
        if (this.getFromRequest(Consts.ADMIN_PASSWORD_VAR_NAME) !== AccessConfig['adminPassword']) {
            return false;
        }
        return true;
    }
}


Users.instanceId = BaseFunctions.unique_id();


module.exports = Users;