/*
 * File server/src/blocks/category/CaregoriesViewer.js
 * const CaregoriesViewerBlock = require('server/src/blocks/category/CaregoriesViewer');
 *
 * Placemark's categories and subcategories block
 */

const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const Categories = require('server/src/components/Categories');

class CaregoriesViewerBlock extends Component {

    constructor() {
        super();
    }

    render(data) {
        let _html = `
            <div class="placemarks_category_html_content">
                <img src="${Consts.SERVICE_IMGS_URL_CATEGORIES + Categories.getInstance(this.requestId).getCategoryCode(data['category']) + '.png'}"
                    alt="${Categories.getInstance(this.requestId).getCategoryTitle(data['category'])}"
                    title="${Categories.getInstance(this.requestId).getCategoryTitle(data['category'])}" onclick="dispatchEvent('${Consts.EVENT_SHOW_CATEGORY_VIEWER}', {id:${data['category']}});"/>`;

        let _subcategories = data['subcategories'] ? data['subcategories'].split(',') : [];
        for (let _index in _subcategories) {
            let _subcategory = _subcategories[_index].trim();
            _html += `
                <img src="${Consts.SERVICE_IMGS_URL_CATEGORIES + Categories.getInstance(this.requestId).getCategoryCode(_subcategories[_index]) + '.png'}"
                    alt="${Categories.getInstance(this.requestId).getCategoryTitle(_subcategories[_index])}"
                    title="${Categories.getInstance(this.requestId).getCategoryTitle(_subcategories[_index])}" onclick="dispatchEvent('${Consts.EVENT_SHOW_CATEGORY_VIEWER}', {id:${_subcategory}});"/>`;
        }
        _html += `
                <div class="clear"></div>
            </div>`;
        return _html;
    }
}

CaregoriesViewerBlock.instanceId = BaseFunctions.uniqueId();
module.exports = CaregoriesViewerBlock;