<?php

namespace modules\app\account\classes;

use \components\app as components;

abstract class Account extends \vendor\Module
{

// id account
    private $_id;
// role account
    private $_role;
// name account
    private $_name;

    public function authentication()
    {

        if ((!empty($_COOKIE['HASH'])) && (!empty($_COOKIE['ID']))) {

            $id = (int) $_COOKIE['ID'];

            $db_users_registered = self::get_model(MY_MODEL_NAME_DB_USERS_REGISTERED);

            $users_registered_data = $db_users_registered->get_by_id($id);

            if ($users_registered_data['password_hash'] === $_COOKIE['HASH']) {
                $this->_id = (int)$users_registered_data['id'];
                $this->_role = (int)$users_registered_data['role'];
                $this->_name = $users_registered_data['name'];
            } else {
                self::set_error(MY_ERROR_USER_NOT_VERIFICATED);
            }
        }
    }

    public function is_admin()
    {
        if (($this->_id) && ($this->_role === MY_MODULE_ACCOUNT_ROLE_ADMIN_CODE) || (isset($_SESSION['admin_access_autorize']) && $_SESSION['admin_access_autorize'] === true)) {
            return true;
        }
    }

}
