<?php

namespace modules\app\analyze\classes;

use \components\app as components;

abstract class Analyze extends \vendor\Module
{

    static private $_is_first_visit = false;
    static private $_visitor_email_id = false;
    static private $_is_visitor_interested = false;


    public function identify()
    {
        $id_email = (int) @self::get_get_var(MY_SPAM_TRANSFERED_EMAIL_ID_VAR_NAME);
        $code_email = (int) @self::get_get_var(MY_SPAM_TRANSFERED_EMAIL_CODE_VAR_NAME);
        $is_visitor_interested = (int) @self::get_get_var(MY_SPAM_TRANSFERED_EMAIL_INTEREST_VAR_NAME);

        if ($is_visitor_interested) {
            self::$_is_visitor_interested = $is_visitor_interested;
        }

        if (!$id_email || !$code_email) {
            return false;
        }

        $spam_db_model = self::get_model(MY_MODEL_NAME_DB_SPAM);
        $config = self::get_config();

        $condition = "id='" . $id_email . "' AND code = '" . $code_email . "'";
        $select = '*';
        $limit = 1;
        $need_result = false;

        $email_data = $spam_db_model->get_by_condition($condition, '', '', $select, $limit, $need_result);

        if ($email_data) {

            self::$_visitor_email_id = $email_data['id'];

            if (!$email_data['greeting']) {
                self::$_is_first_visit = true;
            }

            $entry_point = self::get_entry_point();

            $data = array(
                'id' => $email_data['id'],
                'greeting' => 1, // в любом случае ставим 1
                'entry_points' => $email_data['entry_points'] ? $email_data['entry_points'] . ',' . $entry_point['string'] : $entry_point['string'],
            );

            $spam_db_model->update_data($data);
        }
    }


    public function is_visitor_interested()
    {
        return self::$_is_visitor_interested;
    }


    public function is_virst_visit()
    {
        return self::$_is_first_visit;
    }


    public function get_visitor_email_id()
    {
        return self::$_visitor_email_id;
    }


    public function get_entry_point()
    {
        $entry_point_array = array();
        $entry_point_string = '';
        $service = self::get_get_var('var1');
        if ($service) {
            $entry_point_array['var1'] = $service;
        }

        /* $map_type = self::get_get_var(MY_SERVICE_VAR_NAME);
          if ($map_type) {
          $entry_point_array[MY_SERVICE_VAR_NAME] = $map_type;
          } */

        $country = self::get_get_var(MY_CATALOG_COUNTRY_VAR_NAME);
        if ($country) {
            $entry_point_array[MY_CATALOG_COUNTRY_VAR_NAME] = $country;
        }

        $state = self::get_get_var(MY_CATALOG_STATE_VAR_NAME);
        if ($state) {
            $entry_point_array[MY_CATALOG_STATE_VAR_NAME] = $state;
        }

        $id_placemark = self::get_get_var(MY_ID_VAR_NAME);
        if ($id_placemark) {
            $entry_point_array[MY_ID_VAR_NAME] = $id_placemark;
        }
        if (my_array_is_not_empty($entry_point_array)) {
            $entry_point_string = implode('_', $entry_point_array);
        }

        return array(
            'array' => $entry_point_array,
            'string' => $entry_point_string
        );
    }
}
