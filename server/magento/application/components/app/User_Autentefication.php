<?php
namespace components\app;
use \modules\base\Security\Security;
use \models\dbase\mysql\User;
use \vendor\Component;

final class User_Autentefication extends Component {

    public static function autenteficate() {

        if ((!empty($_COOKIE['HASH'])) && (!empty($_COOKIE['ID']))) {

            if (User::model()->verificate($_COOKIE['HASH'], $_COOKIE['ID'])) {

                return true;
            }
        }
        self::set_error(MY_ERROR_USER_NO_VERIFICATED);
    }

}
