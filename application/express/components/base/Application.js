/*
 * File application/express/components/base/Application.js
 * const Application = require('application/express/components/base/Application');
 *
 * The main component for working with application
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Config = require('application/express/settings/Config.js');
const Component = require('application/express/core/abstract/Component');
const RequestsPool = require('application/express/core/RequestsPool');
const SocketsPool = require('application/express/core/SocketsPool');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const DBase = require('application/express/core/DBase');
const Validator = require('application/express/components/base/Validator');

class Application extends Component {
    constructor(){
        super();


        /*
         * Controller name
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

    }


    init(){


    }

    /*
     * Get controller name
     *
     * @return {string}
     */
    get_controller()
    {
        return this.controller;
    }


    /*
     * Get action name
     *
     * @return {string}
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
     * @param {string} controller - controller name
     * @param {string} action - action name
     */


    /*#???????????????????????????? - то, что возможно не нужно
     * Change view data
     *
     * @param {string} controller - controller name
     * @param {string} action - action name
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
     * @param {string} controller - controller name
     * @param {string} action - action name
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
     * @return {string}

    protected function get_view_file()
    {

        return $this->view_file ? $this->view_file : \strtolower($this->get_controller()) . MY_DS . $this->get_view_name() . '.php';
    }

     * Получить название view файла, без расширения и пути
     *
     * @return {string}

    protected function get_view_name()
    {
        if (is_null($this->view_name)) {
            $this->view_name = $this->get_action();
        }

        return $this->view_name;
    }


     * Получить путь до layout файла
     *
     * @return {string}

    protected function get_layout_file()
    {

        return $this->get_layout_name() . '.php';
    }


     * Получить название layout файла, без расширения и пути
     *
     * @return {string}

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
        let _controller_name = this.getFromRequest('controller').toLowerCase();

        if (BaseFunctions.is_not_empty(Config.controllers.enabled[_controller_name])){

            let _controller_file_name = Config.controllers.enabled[_controller_name];
            let _controller_path = 'application/express/controllers/'+_controller_file_name+'.js';

            let _Controller = require(_controller_path);
            let _controller_object = _Controller.getInstance(this.requestId);

            let _action_name = this.getFromRequest('action').toLowerCase();
            let _action_name_prepared = 'action_' + _action_name;

            // If action exists
            if (BaseFunctions.isMethod(_controller_object[_action_name_prepared])) {
                this.controller = _controller_object;
                this.action = _action_name_prepared;

                // All ok, controller and action are valid
                RequestsPool.setControllerAndActionNames(this.requestId, _controller_name, _action_name);

                return true;
            }
        }
        this.error(ErrorCodes.ERROR_WRONG_ADRESS, 'data:[' + this.getRequestData(string = true) + ']');
    }



    /*
     * Controller runner
     *
     * @return {object} - controller execution result
     */
    run_controller()
    {
        let _controller_object = this.get_controller();
        let _action_name = this.get_action();

        return _controller_object[_action_name]();
    }






    /*
     * Run operations before or after controller running
     *
     * @param {string} ('before'/'after') param - determine which operations will be performed
     */
    app_operations(param)
    {
        if (BaseFunctions.is_not_empty(Config.operations[param])) {
            let _operations = Config.operations[param];
            for (let _index in _operations) {
                let _operation = _operations[_index];
                let _operation_component = require(_operation.class);
                // If traditional class
                if (BaseFunctions.isClass(_operation_component)) {
                    _operation_component.getInstance(this.requestId)[_operation.method]();
                } else {
                    // Otherwise it is a simple common object with methods
                    _operation_component[_operation.method]();
                }
            }
        } else {
            this.error(ErrorCodes.ERROR_FUNCTION_ARGUMENTS, 'param [' + param + ']');
        }
    }


    /*
     * Validate all GET variables
     * Url variables don't specified in config is not used in project
     */
    validate_get_vars()
    {
        let _get_variables = this.getRequestData();

        for (let _config_get_name in Config.get_vars) {

            let _config_get_rules = Config.get_vars[_config_get_name].rules;
            let get_value = _get_variables[_config_get_name];

            for (let _index in _config_get_rules) {
                let _rule = _config_get_rules[_index];
                if (!Validator.validate(_rule, get_value)) {
                    this.error(ErrorCodes.ERROR_GET_VAR_IS_INVALID,
                    'name[' + _config_get_name + '], value[' + get_value + '], rule[' + BaseFunctions.toString(_rule) + '], data[' + this.getRequestData(string = true) + ']',
                            undefined, false);
                }
            }
        }
    }












    /*
     * Run primary methods
     */
    execute()
    {console.log('\n\n\n------------->>>>>>>>>>>>>>>>>>>execute :request id = '+this.requestId+'');
        this.init();

        this.validate_get_vars();

        this.app_operations('before');

        this.set_controller_and_action();

        let _result = this.run_controller();

        this.app_operations('after');

        console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<----------execute :request id = '+this.requestId+'\n\n\n');
        return _result;
    }






    /*
     * Run application
     */
    static run(data, token)
    {
        let _applicationObject;

        return new Promise((resolve, reject) => {
            console.log('# Promise started');
            _applicationObject = Application.getInstance(
                RequestsPool.init(data, token)
            );
            resolve(true);
        })
        .then(res => {
            console.log('# then 1');
            DBase.getInstance(_applicationObject.requestId).begin_transaction();
            _applicationObject.execute();
            DBase.getInstance(_applicationObject.requestId).commit();
            console.log('> applicationObject executed');
        })
        .catch(e => {
            console.log('# catch 1');
            console.log('\n\n              --------------->>>>>>>>> CATCHED');

            if (_applicationObject) {
                DBase.getInstance(_applicationObject.requestId).rollback();
            }

            let _errorMessage = '';

            if (!e.syntCode) {
                console.log('system error!');
                console.log(e);
            }
            if (Config.debug === 1) {
                _errorMessage = e.syntMessage;
                console.log('error: ' + _errorMessage);
            } else {
                _errorMessage = e.syntCode;
            }
            SocketsPool.sendPrivate(token, {message: _errorMessage}, 'error-catch');
            console.log('<<<<<<<<<<<<<<<<---------------              CATCHED\n\n\n');
        })
        .then(res => {
            console.log('# then 2');

            // Only if object managed to preserve in requests pool
            if (_applicationObject) {
                RequestsPool.remove(_applicationObject.requestId);
                console.log('> RequestsPool removed');
            }
        })
        .catch(e => {
            console.log('# catch 2');
            console.log(e.syntMessage ? e.syntMessage : e);
        });
    }
};

Application.instanceId = BaseFunctions.unique_id();

module.exports = Application;