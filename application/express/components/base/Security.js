/*
 * File application/express/components/base/Security.js
 * const Security = require('application/express/components/base/Security');
 *
 * The main component for working with application
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const ErrorHandler = require('application/express/components/ErrorHandler');
const Config = require('application/express/settings/Config.js');
const Component = require('vendor/Component');
const DBaseMysql = require('application/express/vendor/dbases/DBaseMysql');
const Responce = require('application/express/components/base/Responce');
const Request = require('application/express/components/base/Request');
const ErrorCodes = require('application/settings/express/ErrorCodes');
const Consts = require('application/express/settings/Constants');


class Security extends Component {
    constructor(){
        super();


        /*
         * Controllet name
         *
         * @type string
         */
        this.controller;

        /*
         * Name controller's action
         *
         * @type string
         */
        this.action;



        /*
         * Database connection model
         *
         * @type resource
         */
        this.db_model;

    }


    init(){
        this.set_controller_and_action();


    }

    /*
     * Get controller name
     *
     * @return string
     */
    get_controller()
    {
        return this.controller;
    }


    /*
     * Get action name
     *
     * @return string
     */
    get_action()
    {
        return this.action;
    }




























    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Path to laoyut file
     *
     * @type string
     */
    /*this.layout_file=undefined;*/



    /*
     * #????????????????????????????
     * Path to view file
     *
     * @type string
     */
    /*this.view_file=undefined;*/

    /*
     * #????????????????????????????
     * Layout file's name
     *
     * @type string
     */
    /*this.layout_name=undefined;*/



    /*
     * #????????????????????????????
     * View's file name
     *
     * @type string
     */
    /*this.view_name=undefined;


    }*/

    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Change view file
     *
     * @param string controller - controller name
     * @param string action - action name
     */


    /*#???????????????????????????? - то, что возможно не нужно
     * Change view data
     *
     * @param string controller - controller name
     * @param string action - action name
     */
    /*change_view_file(controller, action)
    {
        this.view_file = controller + '/' + action + '.js';
        this.view_name = action;
    }*/






    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Change layout data
     *
     * @param string controller - controller name
     * @param string action - action name
     */
    /*change_layout_file(controller, action)
    {
        $config = self::get_config();
        $this->layout_file = my_pass_through(@$config['layouts'][$controller][$action]) . '.php';
        $this->layout_name = my_pass_through(@$config['layouts'][$controller][$action]);
    }*/



    /*
     * #???????????????????????????? - то, что возможно не нужно
     * Получить путь до view файла
     *
     * @return string

    protected function get_view_file()
    {

        return $this->view_file ? $this->view_file : \strtolower($this->get_controller()) . MY_DS . $this->get_view_name() . '.php';
    }

     * Получить название view файла, без расширения и пути
     *
     * @return string

    protected function get_view_name()
    {
        if (is_null($this->view_name)) {
            $this->view_name = $this->get_action();
        }

        return $this->view_name;
    }


     * Получить путь до layout файла
     *
     * @return string

    protected function get_layout_file()
    {

        return $this->get_layout_name() . '.php';
    }


     * Получить название layout файла, без расширения и пути
     *
     * @return string

    protected function get_layout_name()
    {
        $config = self::get_config();
        if (is_null($this->layout_name)) {
            $this->layout_name = my_pass_through(@$config['layouts'][strtolower($this->get_controller())][$this->get_action()]);
        }

        return $this->layout_name;
    }
         *
         **/













    /*
     * Detect and set controller and action
     */
    set_controller_and_action()
    {
        let controller_name = Request.get('controller').toLowerCase();

        if (BaseFunctions.is_not_empty(Config.controllers.enabled[controller_name])){

            let controller_file_name = Config.controllers.enabled[controller_name];
            let controller_path = 'application/express/controllers/'+controller_file_name+'.js';

            let Controller = require(controller_path);
            let controller_object = Controller.get_instance(this.requestId);


            nextTTTTTTTTTTTT - продолжать с этого момента




            
            let action_name = 'action_' + Request.get('action').toLowerCase();

            // If action exists
            if (typeof controller_object[action_name] === 'function') {

                this.controller = controller_object;
                this.action = action_name;
            }
        }
        ErrorHandler.process(ErrorCodes.ERROR_WRONG_ADRESS, 'url:[' + Request.getFullUrl() + ']');
    }



    /*
     * Controller runner
     *
     * @return object - controller execution result
     */
    run_controller()
    {
        let controller_object = this.get_controller();
        let action_name = this.get_action();

        return controller_object[action_name]();
    }






    /*
     * Run operations before or after controller running
     *
     * @param string ('before'/'after') param - determine which operations will be performed
     */
    app_operations(param)
    {
        if (BaseFunctions.is_not_empty(Config.operations[param])) {
            let operations = Config.operations[param];
            for (let index in operations) {
                let operation = operations[index];
                let operation_object = require(operation.class);
                operation_object[operation.method]();
            }
        } else {
            ErrorHandler.process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'param [' + param + ']');
        }
    }


    /*
     * Validate all GET variables
     */
    validate_get_vars()
    {

        let var_category = Consts.VAR_CATEGORY_SYSTEM;
        let get_variables = Request.getQueryVars();

        // All passed GET variables must be valid
        for (let get_name in get_variables) {
            let get_value = get_variables[get_name];

            if (get_name === Consts.GET_VARS_QUERY_STRING_NAME) {
                var_category = Consts.VAR_CATEGORY_USER;
                continue;
            }
            let var_category_array = Config.get_vars[var_category];

            // If GET variable exists in config
            if (BaseFunctions.in_array(get_name, var_category_array)) {

                // Validation by set rules
                for (var index in var_category_array[get_name].rules) {
                    let rule = var_category_array[get_name].rules[index];

                    if (!this.validate(rule, get_value)) {
                        ErrorHandler.process(ErrorCodes.ERROR_WRONG_ADRESS, 'name[' + get_name + '], value[' + get_value + '], rule[' + JSON.stringify(rule) + '], url[' + Request.getUrl() + ']');
                    }
                }
            } else {
                ErrorHandler.process(ErrorCodes.ERROR_WRONG_ADRESS, get_name + ':unknown GET variable, url[' + Request.getUrl() + ']');
            }
        }

/*#???????????????????????????? - то, что возможно не нужно
        // Prepare GET variables
        $self_url = '';

        $get_vars_config = my_pass_through(@$config['get_vars']);
        // 1) System vars
        foreach (my_pass_through(@$get_vars_config[MY_VAR_CATEGORY_SYSTEM]) as $var_name => $arary) {
            if (array_key_exists($var_name, $_GET)) {
                $this->get_vars[$var_name] = strtolower($_GET[$var_name]);
                $self_url .= $this->get_vars[$var_name] !== 'index' ? $this->get_vars[$var_name] . '/' : '';
            }
        }
        $self_url = trim($self_url, '/');

        $self_url_without_query_string = $self_url;

        // 2) Query vars
        $self_url .= '?';
        $query_string = '';
        foreach (my_pass_through(@$get_vars_config[MY_VAR_CATEGORY_USER]) as $var_name => $array) {
            if (array_key_exists($var_name, $_GET)) {
                $this->get_vars[$var_name] = strtolower($_GET[$var_name]);
                $self_url .= $var_name . '=' . $this->get_vars[$var_name] . '&';
                $query_string .= $var_name . '=' . $this->get_vars[$var_name] . '&';
            }
        }

        $self_url = trim($self_url, '&');
        $query_string = trim($query_string, '&');
        $this->set_self_url($self_url);
        $this->set_query_string($query_string);

        $this->set_self_url_without_query_string($self_url_without_query_string);
*/

    }








    /*
     * Get db - mysql, redis etc.
     *
     * @return string
     */
    get_db()
    {
        if (Config.db.type === 'mysql') {
            return new DBaseMysql();
        }
    }







    /*
     * Run primary methods
     */
    execute()
    {
        this.init();

        this.validate_get_vars();

        this.app_operations('before');

        this.set_controller_and_action();

        let data = this.run_controller();

        this.app_operations('after');

        return data;
    }






    /*
     * Run application
     */
    run()
    {
        this.db_model = this.get_db();

        try {

            this.db_model.begin_transaction();

            this.execute();

            this.db_model.commit();

        } catch (e) {

            this.db_model.rollback();

            if (Config.debug === 1) {

                Responce.send(ErrorHandler.getLogMessage());

            } else {
                Responce.sendJson(
                    {
                        status:'error',
                        code:ErrorHandler.getErrorCode()
                    }
                );
            }
        }
    }
};

Security.id = BaseFunctions.unique_id();