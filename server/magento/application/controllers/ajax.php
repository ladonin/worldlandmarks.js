<?php

namespace controllers;

use \components\app\image;

final class Ajax extends \vendor\Controller {

    public function action_index() {
        
    }


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    public function actionAddNewPoint() {
        
    }

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    public function actionDeleteFile() {

        //пост запрос на изменение содержимого строки в списке данных пользователя
        $user = \models\dbase\mysql\User::model();
        $file = \models\dbase\mysql\File::model();

        $fileName = $file->getFileNameFromId($user, $_POST['id']);


        if (!$fileName) {
            exit();
        } else {
            $file->deleteFile($user, $_POST['id'], $fileName);
        }
        exit();
    }

    public function actionRedactData() {

        //пост запрос на изменение содержимого строки в списке данных пользователя
        $user = \models\dbase\mysql\User::model();

        $this->data['error'] = 0;
        if (empty($_POST['name'])) {
            $this->data['error'] = 1;
        }


        $methodName = "update" . $_POST['name'];
        if (!\method_exists($user, $methodName)) {
            $this->data['error'] = 1;
        }


        if (!$user->filter($_POST['name'], $_POST['value'])) {
            $this->data['error'] = 2;
        }


        if (empty($this->data['error'])) {
            $value = htmlspecialchars($_POST['value']);
            if (!$user->$methodName($value)) {
                $this->data['error'] = 1;
            }
        }

        $this->data['value'] = $value;
        echo json_encode($this->data);
        exit();
    }

}
