/*
 * File application/express/controllers/Main.js
 *
 * Controller main/* pages
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Controller = require('application/express/vendor/Controller');

class Main extends Controller {

    constructor(){
        super();
    }

    /*
     * Action index
     */
    action_index() {

        console.log('index action');

    }

}

/*

 const Controller = require('application/express/vendor/Controller');

 class Main extends Controller
 {


 action_index()
 {
 this.data['title'] = self::get_module(MY_MODULE_NAME_SEO)->get_title('main/index');
 $this->data['keywords'] = self::get_module(MY_MODULE_NAME_SEO)->get_keywords('main/index');
 $this->data['description'] = self::get_module(MY_MODULE_NAME_SEO)->get_description('main/index');
 $this->data['block_path'] = '_pages' . MY_DS . 'main';
 $this->data['placemarks_count'] = self::get_module(MY_MODULE_NAME_CATALOG)->get_placemarks_count();

 return $this->data;
 }
 }






 */


Main.instanceId = BaseFunctions.unique_id();
module.exports = Main;

