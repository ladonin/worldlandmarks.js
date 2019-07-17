/*
 * File application/express/core/Model.js
 * const Model = require('application/express/core/Model');
 *
 * Base model component
 */

const Core = require('application/express/core/Core');

const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');
const Functions = require('application/express/functions/BaseFunctions');
const Service = require('application/express/core/Service');
const Users = require('application/express/core/Users');
const Validator = require('application/express/components/base/Validator');

class Model extends Core {

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
         *      numeric - value must be integer or float
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
         *      get_query_string_var_value - value must match a value of url query variable conception
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
     * @param {string} name - field name
     * @param {string} value - checked value (usually field value)
     * @param {string} filter_type - validation type (either all rules or only 'required' rule or all rules besides 'required' rule)
     * @param {string} with_rollback - should we execute roolback or only return false if checking will not be passed
     *
     * @return {boolean}
     */
    filter(name, value, filter_type = Consts.FILTER_TYPE_ALL, with_rollback = true)
    {

        if (!Functions.isSet(this.fields[name])) {
            this.error(ErrorCodes.ERROR_DB_UNDEFINED_FIELD, 'unknown field_name: [' + name + '], value: [' + value + ']');
        }

        if (Functions.isSet(this.fields[name]['rules'] && Functions.isArray(this.fields[name]['rules']))) {

            for (let _index in this.fields[name]['rules']) {

                let _rule = this.fields[name]['rules'][_index];

                let _result;

                if ((filter_type === Consts.FILTER_TYPE_ALL) || ((filter_type === Consts.FILTER_TYPE_ONLY_REQUIRED) && _rule === 'required')
                        || ((filter_type === Consts.FILTER_TYPE_WITHOUT_REQUIRED) && _rule !== 'required')) {
                    _result = Validator.validate(_rule, value);
                    if (!_result) {
                        if (with_rollback === true) {
                            this.error(ErrorCodes.ERROR_MODEL_FILTER, 'wrong value: name[' + name + '], value[' + value + '], rule[' + JSON.stringify(_rule) + ']');
                        } else {
                            return false;
                        }
                    }
                }
            }
        }

        return true;
    }


    /*
     * Processing field value according its 'processing' settings
     *
     * @param {array} field - field data
     */
    processing_value(field)
    {
        if (Functions.is_not_empty(field['processing']) && Functions.is_not_empty(field['value'])) {

            // Delete all html tags
            // Attention: if used then 'htmlspecialchars' has no sense
            // Attention: html tags created subsequently will not be deleted
            if (Functions.in_array("strip_tags", field['processing'])) {
                field['value'] = Functions.strip_tags(field['value']);
            }

            // Convert html tags into simple entities
            // Attention: html tags created subsequently will not be converted
            if (Functions.in_array("htmlspecialchars", field['processing'])) {
                field['value'] = Functions.escapeHtml(field['value']);
            }

            // Convert special tags into html tags
            if (Functions.in_array("spec_tags", field['processing'])) {

                let _tags = Service.get_text_form_tags();

                for (let _index in _tags) {
                    let _tag = _tags[_index];

                    if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_B) {

                        field['value'] = field['value'].replace(/\[b\](.+?)\[\/b\]/g, '<b>$1</b>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_P) {

                        // Also remove new lines in and after paragraph
                        field['value'] = field['value'].replace(/\[p\]((?:.*?[\n\r]?.*?)*?)\[\/p\][\n\r]*/gm, function (matches, part1) {
                            return '<p class="text_form_tag_p">' + part1.replace(/[\r\n]*/g, '') + '</p>';
                        });

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_STRONG) {

                        field['value'] = field['value'].replace(/\[strong\](.+?)\[\/strong\]/g, '<strong>$1</strong>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_A) {

                        let _follow = ' rel="nofollow"';
                        if (Users.is_admin()) {
                            _follow = '';
                        }
                        field['value'] = field['value'].replace(/\[a\=(.+?)\](.+?)\[\/a\]/g, '<a href="$1"' + _follow + '>$2</a>');
                        field['value'] = field['value'].replace(/\[a\=(.+?)\]\[\/a\]/g, '<a href="$1"' + _follow + '>$1</a>');

                    } else if (_tag['code'] === Consts.FORM_TEXT_TAG_CODE_IMAGE_ADVANCED) {

                        field['value'] = field['value'].replace(/\[img url=\"(.+?)\" style=\"(.+?)\"]/g, '<img src="$1" style="$2"/>');

                    }
                }
            }

            // Delete special tags
            // Attention: works after 'spec_tags' and if 'spec_tags' is used then only rest special tags not processed by 'spec_tags' will be deleted
            if (Functions.in_array("strip_spec_tags", field['processing'])) {
                field['value'] = field['value'].replace(/\[.*?\]/gi, '');
            }

            // Convert text urls into links
            if (Functions.in_array("urls", field['processing'])) {

                if (((Users.is_admin() || Users.admin_access_authentication()) && Service.is_available_to_process_links_in_text_for_admin())
                        || Service.is_available_to_process_links_in_text_for_free_users()) {

                    // Mask already existed links
                    field['value'] = field['value'].replace(/<a href=\"(https|http)/g, '<a href="$1_mask');
                    field['value'] = field['value'].replace(/<img src=\"(https|http)/g, '<img src="$1_mask');

                    // Process links
                    field['value'] = field['value'].replace(/([^\"]?)\b((http(s?):\/\/)(?:www\.)?)([\w\.\:\-]+)([\/\%\w+\.\:\-#\(\)]+)([\?\w+\.\:\=\-#\(\)]+)([\&\w+\.\:\=\-#\(\)]+)\b([\-]?)([\/]?)/g, '$1 <a href=\"http$4://$5$6$7$8$9$10\" target=\"_blank\">$5$6$7$8$9$10</a>');

                    // Unmask processed links
                    field['value'] = field['value'].replace(/<a href=\"http_mask/g, '<a href="http');
                    field['value'] = field['value'].replace(/<a href=\"https_mask/g, '<a href="https');
                    field['value'] = field['value'].replace(/<img src=\"http_mask/g, '<img src="http');
                    field['value'] = field['value'].replace(/<img src=\"https_mask/g, '<img src="https');
                }
            }

            // Convert new lines into <br/> tags
            if (in_array("new_line", field['processing'])) {
                field['value'] = field['value'].replace(/\r/g, '');
                field['value'] = field['value'].replace(/\n/g, '<br/>');
            }
        }
    }
}

module.exports = Model;