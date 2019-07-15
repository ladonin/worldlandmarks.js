/*
 * File application/express/controllers/Catalog.js
 *
 * Controller catalog/* pages
 */

const BaseFunctions = require('application/express/functions/BaseFunctions');
const Language = require('application/express/core/Language');
const ErrorCodes = require('application/express/settings/ErrorCodes');
const Consts = require('application/express/settings/Constants');

const AbstractController = require('application/express/controllers/AbstractController');

class Catalog extends AbstractController {

    constructor() {
        super();
    }

    /*
     * Action index
     */
    action_index() {

        $seo_module = self::get_module(MY_MODULE_NAME_SEO);
        $catalog_module = self::get_module(MY_MODULE_NAME_CATALOG);
        $security = \modules\base\Security\Security::get_instance();

        $this->data['title'] = $seo_module->get_title('catalog/index');
        $this->data['keywords'] = $seo_module->get_keywords('catalog/index');
        $this->data['description'] = $seo_module->get_description('catalog/index');

        $this->data['data'] = $catalog_module->get_countries_data();
        // ЧПУ
        $this->data['scroll_url'] = MY_DOMEN . '/' . $security->get_controller() . '/' . 'scroll';
        $this->data['current_url'] = MY_DOMEN . '/' . $security->get_controller() . '/';

        return $this->data;
    }













        this.addDynamicData({errorMessage: 'errorMessageerrorMessageerrorMessageerrorMessage'});////ATTENTION - обратите внимание






        this.data = {};

        this.sendMe('index');



    }




}



Catalog.instanceId = BaseFunctions.unique_id();
module.exports = Catalog;

