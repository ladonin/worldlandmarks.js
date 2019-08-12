/*
 * File application/express/blocks/category/CaregoriesViewer.js
 * const CaregoriesViewerBlock = require('application/express/blocks/category/CaregoriesViewer');
 *
 * Placemark's categories and subcategories block
 */

const Component = require('application/express/core/parents/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const Catalog = require('application/express/components/Catalog');


class CaregoriesViewerBlock extends Component {

    constructor() {
        super();
    }

    render(data) {
        let _html = `
            <div class="placemarks_category_html_content">
                <img src="${Consts.SERVICE_IMGS_URL_CATEGORIES + Catalog.getInstance(this.requestId).getCategoryCode(data['category']) + '.png'}"
                    alt="${Catalog.getInstance(this.requestId).getCategoryTitle(data['category'])}"
                    title="${Catalog.getInstance(this.requestId).getCategoryTitle(data['category'])}" onclick="category_info_show('${data['category']}');"/>`;

        let _subcategories = Catalog.getInstance(this.requestId).getSubcategories(data['subcategories']);
        for (let _index in _subcategories) {
            let _subcategory = _subcategories[_index];
            _html += `
                <img src="${Consts.SERVICE_IMGS_URL_CATEGORIES + Catalog.getInstance(this.requestId).getCategoryCode(_subcategories[_index]) + '.png'}"
                    alt="${Catalog.getInstance(this.requestId).getCategoryTitle(_subcategories[_index])}"
                    title="${Catalog.getInstance(this.requestId).getCategoryTitle(_subcategories[_index])}" onclick="category_info_show('${_subcategory}');"/>`;
        }
        _html += `
                <div class="clear"></div>
            </div>`;
    }
}

CaregoriesViewerBlock.instanceId = BaseFunctions.unique_id();
module.exports = CaregoriesViewerBlock;