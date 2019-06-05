<?php
/*
 * Class modules\base\mailer\Mailer
 */
namespace modules\base\mailer\classes;
use \components\app as components;

abstract class Mailer extends \vendor\Module
{

    /*
     * Email info отправителя
     *
     * @var string
     */
    protected $info_email;

    /*
     * Имя info отправителя
     *
     * @var string
     */
    protected $info_name;


    protected function __construct(){
        $this->info_email=self::get_module(MY_MODULE_NAME_SERVICE)->get_email_from(1);
        $this->info_name=self::get_module(MY_MODULE_NAME_SERVICE)->get_email_name(1);
    }


    public function send_password_after_create_placemark(array $data, $id_data)
    {
        $id_data = (int) $id_data;
        if (my_is_empty(@$id_data)) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'id_data:' . $id_data));
        }

        $subject = my_pass_through(@self::trace('email/send_password_after_create_placemark/subject'));
        $body = '<div style="font-family:Arial;font-size:13px;color:#515151;line-height:21px;">' . my_pass_through(@self::trace('email/send_password_after_create_placemark/body', array('password' => $data['password']))) . '</div>';
        $alt_body = my_pass_through(@self::trace('email/send_password_after_create_placemark/alt_body'));

        $this->revision_input_data($data);
        $mailer = $this->mailer;
        $mailer->setFrom($this->info_email, $this->info_name);
        $mailer->addAddress($data['recipient']);// Add a recipient

        $mailer->isHTML(true);// Set email format to HTML
        $mailer->Subject = $subject;
        $mailer->Body = $body;
        $mailer->AltBody = $alt_body;

        if (!$mailer->send()) {
            self::concrete_error(array(MY_ERROR_MAILER_NOT_SENT, $mailer->ErrorInfo));
        } else {
            //пишем лог отправки
            $data_db_model = components\Map::get_db_model('data');
            $data = array(
                'map_table' => $data_db_model->get_table_name(),
                'data_id' => $id_data,
                'from_email' => $this->info_email,
                'from_name' => $this->info_name,
                'recipient_email' => $data['recipient'],
                'is_html' => 1,
                'subject' => $subject,
                'body' => $body,
                'plain_text' => $alt_body
            );
            $emails_sent_model = self::get_model(MY_MODEL_NAME_DB_EMAILS_SENT);
            $emails_sent_model->add($data);
            return true;
        }
    }

    protected function revision_input_data(array $data)
    {
        if (my_is_empty(@$data['password'])) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'password:' . $data['password']));
        }
        if (my_is_empty(@$data['recipient'])) {
            self::concrete_error(array(MY_ERROR_FUNCTION_ARGUMENTS, 'recipient:' . $data['recipient']));
        }
    }
}