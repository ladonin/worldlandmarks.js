/*
 * File server/src/controllers/CommonController.js
 * const CommonController = require('server/src/controllers/CommonController');
 *
 * Common class for all controllers
 */
const Controller = require('server/src/core/parents/Controller');
const Constants = require('server/src/settings/Constants');
const Users = require('server/src/core/Users');
const Catalog = require('server/src/components/Catalog');
const Articles = require('server/src/components/Articles');

class CommonController extends Controller {

    constructor() {
        super();
    }

    /*
     * Add additional static data to controller's responce according with controller and action name
     *
     * @param {boolean} isBackground - whether request is background (like ajax)
     */
    addStaticData(isBackground = false) {

        if (isBackground) {
            return null;
        }


        this.data = {
            ...this.data,
            [Constants.STATIC_DATA]:{
                'placemarks_count': this.getText('placemarks_count/2/text'),
                'catalog_states_regions_list_title': this.getText('catalog/states/regions/list/title'),
                'catalog_photoalbum_title_text': this.getText('catalog/country/photoalbum_title/text'),
                'catalog_photoalbum_title_text': this.getText('catalog/state/photoalbum_title/text'),
                'default_title_part': this.getText('map/default_title_part/value'),
                'last_articles_text': this.getText('last_articles/text'),
                'last_articles_text': this.getText('last_articles/text'),
                'category_info_title_text': this.getText('category/info/title/text'),
                'is_admin': Users.getInstance(this.requestId).isAdmin(),
                'see_all': this.getText('see_all'),
                'controller': this.getFromRequest(Constants.CLIENT_CONTROLLER_VAR_NAME),
                'action': this.getFromRequest(Constants.CLIENT_ACTION_VAR_NAME),
                'domain_name': this.getText('domain_name'),
                'hat_logo_under_text': this.getText('hat/logo/under_text'),
                'catalog_placemark_link_to_map_text':this.getText('catalog/placemark/link_to_map/text'),
                'bottom':{
                    '1': this.getText('page_bottom/column_1/header/text'),
                    '2': this.getText('page_bottom/catalog/text'),
                    '3': this.getText('page_bottom/map/text'),
                    '4': this.getText('page_bottom/search/text'),
                    '5': this.getText('page_bottom/sitemap_countries/text'),
                    '6': this.getText('page_bottom/sitemap_categories/text'),
                    '7': this.getText('page_bottom/articles_countries/text'),
                    '8': this.getText('page_bottom/articles_categories/text'),
                    '9': this.getText('page_bottom/rights/text')
                },
                'articles_countries_header':this.getText('page_bottom/articles_countries/text'),
                'articles_categories_header':this.getText('page_bottom/articles_categories/text'),
                'select_a_country_text':this.getText('select_a_country_text'),
                'select_a_category_text':this.getText('select_a_category_text'),
                'another_articles_title':this.getText('another_articles/title/text'),
                'catalog_search_form_title_label':this.getText('site/title/catalog/search/form/title/label'),
                'catalog_search_form_category_label':this.getText('site/title/catalog/search/form/category/label'),
                'catalog_search_form_all_categories':this.getText('site/title/catalog/search/form/all_categories'),
                'catalog_search_form_country_label':this.getText('site/title/catalog/search/form/country/label'),
                'catalog_search_form_all_countries':this.getText('site/title/catalog/search/form/all_countries'),
                'catalog_search_form_submit_text':this.getText('site/title/catalog/search/submit/text'),
                'nothing_found':this.getText('warning/search/empty_result'),
                'catalog_sitemap_countries_header':this.getText('page_bottom/sitemap_countries/text'),
                'catalog_sitemap_categories_header':this.getText('page_bottom/sitemap_categories/text')
            }
        };
    }
}
module.exports = CommonController;