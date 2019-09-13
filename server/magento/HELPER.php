<?php
if (my_is_empty($country_code)) {
    self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'country_code:' . $country_code));
}


$language_component = components\Language::get_instance();
$language = $language_component->get_language();



$connect->quote($state_code);



$condition = "id='" . $id_email . "' AND code = '" . $code_email . "'";
$select = '*';
$limit = 1;
$need_result = false;
$email_data = $spam_db_model->get_by_condition($condition, '', '', $select, $limit, $need_result);
