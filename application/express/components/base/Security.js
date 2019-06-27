/*
 * File application/express/components/base/Security.js
 * const Security = require('application/express/components/base/Security');
 *
 * The main component for working with application
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const ErrorHandler = require('application/express/components/ErrorHandler');
const Config = require('application/express/settings/Config.js');
const Component = require('application/express/vendor/Component');
const DBaseMysql = require('application/express/vendor/dbases/Mysql');
const Responce = require('application/express/components/base/Responce');
const Request = require('application/express/components/base/Request');
const ErrorCodes = require('application/express/settings/ErrorCodes');
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


    init(data){


        Request.getInstance(this.requestId).init(data);



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
        let requestInstance = Request.getInstance(this.requestId);

        let controller_name = requestInstance.get('controller').toLowerCase();

        if (BaseFunctions.is_not_empty(Config.controllers.enabled[controller_name])){

            let controller_file_name = Config.controllers.enabled[controller_name];
            let controller_path = 'application/express/controllers/'+controller_file_name+'.js';

            let Controller = require(controller_path);
            let controller_object = Controller.getInstance(this.requestId);

            let action_name = 'action_' + requestInstance.get('action').toLowerCase();

            // If action exists
            if (BaseFunctions.isMethod(controller_object[action_name])) {
                this.controller = controller_object;
                this.action = action_name;
                return true;
            }
        }
        ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_WRONG_ADRESS, 'data:[' + requestInstance.getStringData() + ']');
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
                let operation_component = require(operation.class);
                // If traditional class
                if (BaseFunctions.isClass(operation_component)) {
                    operation_component.getInstance(this.requestId)[operation.method]();
                } else {
                    // Otherwise it is a simple common object with methods
                    operation_component[operation.method]();
                }
            }
        } else {
            ErrorHandler.getInstance(this.requestId).process(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'param [' + param + ']');
        }
    }


    /*
     * Validate all GET variables
     * Url variables don't specified in config is not used in project
     */
    validate_get_vars()
    {
        let requestInstance = Request.getInstance(this.requestId);
        let errorHandlerInstance = ErrorHandler.getInstance(this.requestId);
        let get_variables = requestInstance.getData();

        for (let config_get_name in Config.get_vars) {

            let config_get_rules = Config.get_vars[config_get_name].rules;
            let get_value = get_variables[config_get_name];

            for (let index in config_get_rules) {
                let rule = config_get_rules[index];
                if (!this.validate(rule, get_value)) {
                    errorHandlerInstance.process(ErrorCodes.ERROR_GET_VAR_IS_INVALID,
                    'name[' + config_get_name + '], value[' + get_value + '], rule[' + BaseFunctions.toString(rule) + '], data[' + requestInstance.getStringData() + ']');
                }
            }
        }
    }








    /*
     * Get db - mysql, redis etc.
     *
     * @return string
     */
    get_db()
    {
        if (Config.db.type === 'mysql') {
            return DBaseMysql.getInstance(this.requestId);
        }
    }







    /*
     * Run primary methods
     */
    execute(data)
    {console.log('execute');
        this.init(data);

        this.validate_get_vars();

        this.app_operations('before');

        this.set_controller_and_action();

        let result = this.run_controller();

        this.app_operations('after');

        console.log('//execute');
        return result;
    }






    /*
     * Run application
     */
    run(data)
    {

        this.db_model = this.get_db();

        try {

            this.db_model.begin_transaction();

            this.execute(data);

            this.db_model.commit();

        } catch (e) {

            let errorHandlerInstance = ErrorHandler.getInstance(this.requestId);
            let responceInstance = Responce.getInstance(this.requestId);

            this.db_model.rollback();

            let errorMessage = '';

            if (!errorHandlerInstance.getErrorCode()) {
                console.log('code error');
                console.log(e);
            }
            if (Config.debug === 1) {
                errorMessage = errorHandlerInstance.getLogMessage();
                console.log('error: ' + errorMessage);
            } else {
                errorMessage = errorHandlerInstance.getErrorCode();
            }



            responceInstance.sendPrivate({
                    status:'error',
                    data: errorMessage
                }
            );
        }
    }
};

Security.instanceId = BaseFunctions.unique_id();

module.exports = Security;