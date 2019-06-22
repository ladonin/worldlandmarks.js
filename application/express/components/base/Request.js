/*
 * File application/express/components/base/Request.js
 * const Request = require('application/express/components/base/Request');
 *
 * Request component
 */

const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Functions = require('application/express/functions/BaseFunctions');





class Request {

    constructor() {
        this.requestId;
        
        this.request;
        this.query_vars;
        this.full_url;
        this.query_url;
        this.pathname;

    }

    init(req) {
        this.request = req;
        this.query_vars = Functions.clone(req.query);
        this.full_url = req.url;
        this.query_url = req._parsedUrl.query;
        this.pathname = req._parsedUrl.pathname;
    }
    set(name, value) {
        this.query_vars[name] = value;
    }
    /*
     * @return string - before '?' sign
     */
    getPathName() {
        return this.pathname;
    }
    /*
     * @return string
     */
    getFullUrl() {
        return this.full_url;
    }
    /*
     * @return string - after '?' sign
     */
    getQueryUrl() {
        return this.query_url;
    }
    /*
     * @return object
     * Attention: use with caution
     */
    getRequest() {
        return this.request;
    }
    /*
     * @return object - copy of request query {name1:value1, name2:value2} after '?' sign
     */
    getQueryVars() {
        return Functions.clone(this.query_vars)
    }

    /*
     * @return string - value of specific query variable
     */
    get(name) {
        if (this.query_vars.hasOwnProperty(name)) {
            return this.query_vars[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_REQUEST_VARIABLE, '[' + name + ']');
    }

}

Request.instanceId = Functions.unique_id();