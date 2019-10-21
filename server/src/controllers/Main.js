/*
 * File server/src/controllers/Main.js
 *
 * Controller main/* pages
 */
const Deasync = require('deasync');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Consts = require('server/src/settings/Constants');

const CommonController = require('server/src/controllers/CommonController');

const Seo = require('server/src/components/Seo');
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
        let _seoPath = 'main/index';
        this.addActionData({
            'title':Seo.getInstance(this.requestId).getTitle(_seoPath),
            'keywords':Seo.getInstance(this.requestId).getKeywords(_seoPath),
            'description':Seo.getInstance(this.requestId).getDescription(_seoPath)
        });

        this.sendMe();
    }

}

Main.instanceId = BaseFunctions.uniqueId();
module.exports = Main;