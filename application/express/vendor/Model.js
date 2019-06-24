/*
 * File application/express/vendor/Model.js
 * const Model = require('application/express/vendor/Model');
 *
 * Base model component
 */

const Component = require('application/express/vendor/Component');
const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Functions = require('application/express/functions/BaseFunctions');

class Model extends Component {

    constructor() {
        super();

        /*
         * DB table Fields
         *
         * @type object
         *
         *
         * 'rules':
         *      required - value must be specified and must not be empty
         *      not_empty - if value specified then must not be empty
         *      numeric - value must be integer
         *      float - value must be float
         *      boolean - value must be boolean
         *      {max:number} - maximum length of value
         *      {min:number} - minimum length of value
         *      {pattern:RegExp} - value must match regular expression
         *      word - value must be a word (strng type)
         *      hash - value must be a hash (strng type)
         *      login - value must match a login conception (strng type)
         *      name - value must match a human name conception (strng type)
         *      email - value must match a email conception
         *      phone - value must match a phone conception (number type)
         *      ip - value must match an ip conception
         *      url - value must match an url conception
         *      varname - value must match a variable name conception
         *      get_query_string_var_value - value must match a value of url query variable (after ? sign) conception
         *      db_table_name - value must match a database table name conception
         *      none - value must not be specified (for example 'created': will be set automatically)
         *
         * 'processing':
         *      strip_tags
         *
         *
         */
        this.fields;
    }

    /*
     * Checking value according with field rules
     *
     * @param string name - field name
     * @param string value - checked value (usually field value)
     * @param string filter_type - validation type (either all rules or only 'required' rule or all rules besides 'required' rule)
     * @param string with_rollback - should we execute roolback or only return false if checking will not be passed
     *
     * @return boolean
     */
    filter(name, value, filter_type = Consts.FILTER_TYPE_ALL, with_rollback = true)
    {

        if (!Functions.isSet(this.fields[name])) {
            ErrorHandler.process(ErrorCodes.ERROR_DB_UNDEFINED_FIELD, 'unknown field_name: [' + name + '], value: [' + value + ']');
        }

        if (Functions.isSet(this.fields[name]['rules'] && Functions.isArray(this.fields[name]['rules']))) {

            for (let index in this.fields[name]['rules']) {

                let rule = this.fields[name]['rules'][index];

                let result;

                if ((filter_type === Consts.FILTER_TYPE_ALL) || ((filter_type === Consts.FILTER_TYPE_ONLY_REQUIRED) && rule === 'required')
                        || ((filter_type === Consts.FILTER_TYPE_WITHOUT_REQUIRED) && rule !== 'required')) {
                    result = this.validate(rule, value);
                    if (result === Consts.ERROR_UNKNOWN_VALIDATION_RULE) {
                        ErrorHandler.process(ErrorCodes.ERROR_MODEL_FILTER, 'unknown rule: name[' + name + '], value[' + value + '], rule[' + JSON.stringify(rule) + ']');
                    } else if (!result) {
                        if (with_rollback === true) {
                            ErrorHandler.process(ErrorCodes.ERROR_MODEL_FILTER, 'wrong value: name[' + name + '], value[' + value + '], rule[' + JSON.stringify(rule) + ']');
                        } else {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }
}

module.exports = Model;