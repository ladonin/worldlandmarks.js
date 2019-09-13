<?php

namespace controllers;

final class Welcome extends \vendor\Controller {

    public function actionIndex() {

        $user = \models\dbase\mysql\User::model();        
        $formRegister = \models\forms\Register::model()->enterFields(); //заносим данные из POST- запроса в модель формы
        $formEnter = \models\forms\Enter::model()->enterFields(); //заносим данные из POST- запроса в модель формы

        $this->data['formRegister'] = $formRegister;
        $this->data['formEnter'] = $formEnter;

        if (myIsNotEmpty(@$_POST['enter'])) {

            //если пароль совпадает
            if ($id = $user->revisionEnter($formEnter)) {

                //генерируем временной хеш и записываем его в базу и куки
                $hash_temporary = self::hash(self::returnRandom());
                if (!$user->updatePasswordTemporary(array($hash_temporary, $id))) {
                    return false;
                }
                self::setCookie('HASH', $hash_temporary);
                self::setCookie('ID', $id);
                self::redirect('site');
            } else {

                $this->data['alert'][] = 'Данные введены неверно, либо такого пользователя нет.';
            }
        } else if (myIsNotEmpty(@$_POST['register'])) {

            //заносим данные из формы в модель таблицы и проверяем на валидацию
            if (!$user->setValuesToFieldsFromForm($formRegister)) {
                return false;
            }

            //добавляем временной хеш
            $hash_temporary = self::hash(self::returnRandom());
            if (!$user->setValuesToFields(array('hash_temporary' => $hash_temporary))) {
                return false;
            }

            $user->revisionBorndate();

            //проверяем - есть ли уже такой логин в базе
            if ($user->revisionLogin()) {

                //вставляем данные в базу
                if (!$id_user = $user->insert()) {
                    return false;
                }

                //заносим хеш пароля                
                $passwordUser = \models\dbase\mysql\PasswordUser::model();
                if (!$passwordUser->setValuesToFields(array('hash' => self::hash($formRegister->getPassword()), 'id' => $id_user))) {
                    return false;
                }
                if ($passwordUser->insert() === false) {
                    return false;
                }
				
                $userHistory = \models\dbase\mysql\UserHistory::model();
                //заносим данные из формы в модель таблицы и проверяем на валидацию
                if (!$userHistory->setValuesToFieldsFromForm($formRegister)) {
                    return false;
                }
                if (!$userHistory->setValuesToFields(array('user_id' => $id_user))) {
                    return false;
                }
                //вставляем данные в базу
                if (!$userHistory->insert()) {
                    return false;
                }


                //пишем в куки временный хеш и id пользователя

                self::setCookie('HASH', $hash_temporary);
                self::setCookie('ID', $id_user);
                self::redirect('site');
            } else {

                $this->data['alert'][] = 'Такой логин уже существует';
            }
        } else if (myIsNotEmpty(@$_POST['out'])) {
            //удаляем куки пользователя
            self::setCookie('HASH', '');
            self::setCookie('ID', '');
            self::redirect('welcome');
        }
        $this->data['title'] = '';
        return $this->data;
    }

}
