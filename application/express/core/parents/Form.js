/*
 * File application/express/core/parents/Form.js
 * const Form = require('application/express/core/parents/Form');
 *
 * Base form component
 */

const Model = require('application/express/core/parents/Model');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const ErrorCodes = require('application/express/settings/ErrorCodes');

class Form extends Model {

    constructor() {
        super();
        /*
         * Form fields
         *
         * @type object
         */
        this.fields = {};

    }

    /*
     * Processing data according with fields settings
     *
     * @param {object} datas
     *
     * @return {object} - processed data {fieldName : fieldValue}
     */
    processData(datas) {

        // Set values to fields
        for (let _name in datas) {

            // If undefined field name
            if (!BaseFunctions.isSet(this.fields[_name])) {
                this.error(ErrorCodes.ERROR_FORM_WRONG_DATA, 'field name [' + _name + ']', undefined, false);
            }

            // Set prepared value to field
            this.fields[_name].value = this.preparingValue(_name, datas[_name]);
        }

        // Validate
        for (let _name in this.fields) {
            this.filter(_name, this.fields[_name].value);
        }

        // Processing
        for (let _name in this.fields) {
            this.processing_value(this.fields[_name]);
        }

        let _result = {};
        for (let _name in this.fields) {
            _result[_name] = this.fields[_name].value;
        }
        return _result;
    }

}
module.exports = Form;
