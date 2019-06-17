/*
 * File application/express/vendor/Controller.js
 *
 * Basic controller
 */

const Component = require('vendor/Component');

class Controller extends Component {



    constructor(){

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