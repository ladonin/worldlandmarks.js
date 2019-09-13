/*
 * File server/src/controllers/Main.js
 *
 * Controller main/* pages
 */
const Deasync = require('deasync');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Language = require('server/src/core/Language');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');

const CommonController = require('server/src/controllers/CommonController');


const DBase = require('server/src/components/base/DBase');
const DBaseMysql = require('server/src/core/dbases/Mysql');

class Main extends CommonController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {
       // console.log('+++' + this.requestId);
        //console.log('index action ' + this.getText('site/description/catalog/sitemap_categories/category', {category: '111111111111111'}));
        //this.error(ErrorCodes.ERROR_REQUEST_VARIABLE_NOT_FOUND, 'action_index111111111111');

console.log(this.getRequestFormData());
console.log(this.getRequestFormData().a);

      //  console.log(DBaseMysql.getInstance(this.requestId).getBySql("insert into users values(NULL, 'vhervehve','hgjhj',345435,345335)", [] , false));



        this.sendMe();



    }










    action_index2() {

















        const UsersRegisteredModel = require('server/src/models/dbase/mysql/UsersRegistered');

        //console.log(UsersRegisteredModel.getInstance(this.requestId).method());










        return true;
        let a = 9;
        const mysql2 = require('mysql2');
        const connection2 = mysql2.createConnection({
            host: 'localhost',
            user: 'root',
            password: '111',
            database: 'wlandmarks'
        }).promise();





        let finished = false;

        setTimeout(() => {
            let a;
            console.log('------1');
            for (var i = 0; i < 19000000; i++) {
                a++;
            }
            console.log('-------2');
        }, 500);

        console.log(111);

        connection2.query("SELECT * FROM country where id = ? or id = ?", [1, 9]).catch(err => {
            console.log(err.code)
        }).then(
                r => {
                    for (var i = 0; i < 90000000; i++) {
                        a++;
                    }
                    console.log('SELECT1111111111111');
                }
        );
        connection2.query("SELECT * FROM country where id = ? or id = ?", [1, 9]).catch(err => {
            console.log(err.code)
        }).then(
                r => {
                    finished = true;
                    console.log('SELECT222222222222222');
                }
        );

        // Wait for process to be finished
        Deasync.loopWhile(function () {
            return !finished;
        });


        console.log(333);

        //console.log('+++' + this.requestId);
        //console.log('index action ' + Language.getInstance(this.requestId).get_text('site/description/catalog/sitemap_categories/category', {category: '111111111111111'}));
    }













}

/*

 const Controller = require('server/src/core/parents/Controller');

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

