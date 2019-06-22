/*
 * File application/express/components/User.js
 * const User = require('application/express/components/User');
 *
 * User component
 */


const Component = require('vendor/Component');
const AccessConfig = require('application/express/settings/gitignore/Access');
const Account = require('application/express/components/base/Account');
const Request = require('application/express/components/base/Request');
const Consts = require('application/express/settings/Constants');
const BaseFunctions = require('application/express/functions/BaseFunctions');


class User extends Component
{

    /*
     * User identification
     */
    authentication()
    {
        Account.authentication();
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