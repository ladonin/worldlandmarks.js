/*
 * File application/express/components/base/Request.js
 *
 *
 * Request component
 */


const ErrorCodes = require('application/express/settings/ErrorCodes');
const Component = require('application/express/core/abstract/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');



module.exports =  {



    init(data) {
        this.data = BaseFunctions.clone(data);
//        this.request = req;
//        this.query_vars = BaseFunctions.clone(req.query);
//        this.full_url = req.url;
//        this.query_url = req._parsedUrl.query;
//        this.pathname = req._parsedUrl.pathname;
    }

    /*
     * @return {string} - value of specific query variable
     */
    get(name, required = true) {
        if (this.data.hasOwnProperty(name)) {
            return BaseFunctions.toString(this.data[name]);
        } else if (required === false) {
            return undefined;
        } else {
            this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, '[' + name + ']');
        }
    }


   getStringData() {
       return BaseFunctions.toString(this.data);
   }

    /*
     * @return {object} - copy of request query data {name1:value1, name2:value2}
     */
    getData() {
        return BaseFunctions.clone(this.data)
    }

//    set(name, value) {
//        this.query_vars[name] = value;
//    }
//    /*
//     * @return {string} - before '?' sign
//     */
//    getPathName() {
//        return this.pathname;
//    }
//    /*
//     * @return {string}
//     */
//    getFullUrl() {
//        return this.full_url;
//    }
//    /*
//     * @return {string} - after '?' sign
//     */
//    getQueryUrl() {
//        return this.query_url;
//    }
//    /*
//     * @return {object}
//     * Attention: use with caution
//     */
//    getRequest() {
//        return this.request;
//    }




}

Request.instanceId = BaseFunctions.unique_id();
module.exports = Request;