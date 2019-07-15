/*
 * File application/express/components/Seo.js
 * const Seo = require('application/express/components/Seo');
 *
 * Seo component - compute seo data
 */

const Component = require('application/express/core/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Language = require('application/express/core/Language');
const Countries = require('application/express/components/Countries');
const RequestsPool = require('application/express/core/RequestsPool');

class Seo extends Component {

    constructor(){
        super();
    }

    /*
     * Get page title
     *
     * $param string action - controller's action
     * $param object params - values to insert into the title
     *
     * @return {string}
     */
    getTitle(action, params = {})
    {
        return  this.getText('site/title/' + action, params);
    }

    /*
     * Get page keywords
     *
     * $param string action - controller's action
     *
     * @return {string}
     */
    getKeywords(action)
    {
        let {controller, action} = RequestsPool.getControllerAndActionNames(this.requestId);


        $data_db_model = components\Map::get_db_model('data');




        

        if ($controller_name === MY_CONTROLLER_NAME_CATALOG) {

            if ($action_name === MY_ACTION_NAME_COUNTRY) {
                return Countries->get_country_name_by_get_var();
            } else if ($action_name === MY_ACTION_NAME_STATE) {

                $country_code = Countries->get_country_code_from_url();
                $state_code = $this->get_get_var(MY_CATALOG_STATE_VAR_NAME);
                $country_data = Countries->get_state_and_country_name_by_code($country_code, $state_code);

                return $country_data['country'] . ',' . $country_data['state'];
            } else if ($action_name === MY_ACTION_NAME_PLACEMARK) {

                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $placemark = $data_db_model->get_by_condition($condition, '', '', 'title, seo_keywords', 1, false);
                return $placemark['seo_keywords'] ? $placemark['seo_keywords'] : clear_special_symbols($placemark['title']);
            }
        }

        return my_pass_through(@self::trace('site/keywords/' . $action, $params));
    }




























    /*
     * Вернуть description страницы
     *
     * $param string $action - action контроллера
     * $param array $params - переменные для постороения description
     *
     * @return {string}
     */
    public function get_description($action=null, $params=null)
    {
        $country_component = components\Countries::get_instance();
        $controller_name = get_controller_name();
        $action_name = get_action_name();
        $service_module = self::get_module(MY_MODULE_NAME_SERVICE);
        $data_db_model = components\Map::get_db_model('data');
        $config = self::get_config();

        if ($controller_name === MY_CONTROLLER_NAME_CATALOG) {

            if ($action_name === MY_ACTION_NAME_COUNTRY) {
                return '';
            } else if ($action_name === MY_ACTION_NAME_STATE) {
                return '';
            } else if ($action_name === MY_ACTION_NAME_PLACEMARK) {

                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $placemark = $data_db_model->get_by_condition($condition, '', '', 'comment_plain, seo_description', 1, false);
                return $placemark['seo_description'] ? $placemark['seo_description'] : get_cutted_text($placemark['comment_plain'], $config['allows']['max_cropped_seo_description_length'], false);
            }
        } elseif ($controller_name === MY_CONTROLLER_NAME_ARTICLE) {

            $articles_db_model = self::get_model(MY_MODEL_NAME_DB_ARTICLES);

            if ($action_name === MY_ACTION_NAME_VIEW) {
                $condition = "id=" . (int) $_GET[MY_ID_VAR_NAME];
                $article = $articles_db_model->get_by_condition($condition, '', '', 'content_plain, seo_description', 1, false);
                return $article['seo_description'] ? $article['seo_description'] : get_cutted_text($article['content_plain'], $config['allows']['max_cropped_seo_description_length'], false);
            }

        }

        return my_pass_through(@self::trace('site/description/' . $action, $params));
    }
}



















    getLastArticles(limit = 10)
    {
        let _condition = '';
        let _order = 'id DESC';
        let _select = '*';
        let _group = '';
        let _need_result = false;

        return ArticlesModel.getInstance(this.requestId).getByCondition(_condition, _order, _group, _select, limit, _need_result);
    }
}

Seo.instanceId = BaseFunctions.unique_id();

module.exports = Seo;