/*
 * File application/express/vendor/Controller.js
 * const Controller = require('application/express/vendor/Controller');
 *
 * Basic controller
 */

const Component = require('application/express/vendor/Component');

class Controller extends Component {

    constructor() {
        super();
        /*
         * Data for response
         *
         * @type object
         */
        this.data = {};

    }

    /*
     * Flush result
     *
     * @return object
     */
    flush_data() {

        let data = this.data;
        this.data = null;
        return data;
    }

}
module.exports = Controller;