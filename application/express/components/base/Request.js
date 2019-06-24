/*
 * File application/express/components/base/Request.js
 * const Request = require('application/express/components/base/Request');
 *
 * Request component
 */

const ErrorHandler = require('application/express/components/ErrorHandler');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Component = require('application/express/vendor/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');



class Request extends Component {

    constructor() {
        super();
        this.data={};
//        this.request;
//        this.query_vars;
//        this.full_url;
//        this.query_url;
//        this.pathname;

    }

    init(data) {
        this.data = BaseFunctions.clone(data);
//        this.request = req;
//        this.query_vars = BaseFunctions.clone(req.query);
//        this.full_url = req.url;
//        this.query_url = req._parsedUrl.query;
//        this.pathname = req._parsedUrl.pathname;
    }

    /*
     * @return string - value of specific query variable
     */
    get(name) {
        if (this.data.hasOwnProperty(name)) {
            return this.data[name];
        }
        ErrorHandler.process(ErrorCodes.ERROR_UNDEFINED_REQUEST_VARIABLE, '[' + name + ']');
    }


   getStringData() {
       return BaseFunctions.toString(this.data);
   }

    /*
     * @return object - copy of request query data {name1:value1, name2:value2}
     */
    getData() {
        return BaseFunctions.clone(this.data)
    }

//    set(name, value) {
//        this.query_vars[name] = value;
//    }
//    /*
//     * @return string - before '?' sign
//     */
//    getPathName() {
//        return this.pathname;
//    }
//    /*
//     * @return string
//     */
//    getFullUrl() {
//        return this.full_url;
//    }
//    /*
//     * @return string - after '?' sign
//     */
//    getQueryUrl() {
//        return this.query_url;
//    }
//    /*
//     * @return object
//     * Attention: use with caution
//     */
//    getRequest() {
//        return this.request;
//    }




}

Request.instanceId = BaseFunctions.unique_id();
module.exports = Request;