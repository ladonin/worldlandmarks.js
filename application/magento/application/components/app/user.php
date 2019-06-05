<?php
/*
 * Class components\app\User
 *
 * Отвечает за работу с пользователем
 */
namespace components\app;

use \vendor\Component;

final class User extends Component
{
    const ADMIN_ACCESS_PASSW = 've6bbunu5nmn';

    /*
     * Идентификация пользователя
     */
    public static function authentication()
    {
        self::get_module(MY_MODULE_NAME_ACCOUNT)->authentication();
    }

    /*
     * Идентификация админа через Admin_Access
     */
    public static function admin_access_authentication()
    {
        $password = @self::get_get_var(MY_ADMIN_PASSWORD_VAR_NAME);
        if ($password !== self::ADMIN_ACCESS_PASSW) {
            return false;
        }
        return true;
    }


}