/*
 * File server/src/core/Users.js
 * const Users = require('server/src/core/Users');
 *
 * Users class - store user data
 */


const Core = require('server/src/core/parents/Core');
const AccessConfig = require('server/src/settings/gitignore/Access');

const Consts = require('server/src/settings/Constants');
const BaseFunctions = require('server/src/functions/BaseFunctions');


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