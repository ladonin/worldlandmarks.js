/*
 * File server/src/blocks/placemark/Sublist.js
 * const SublistBlock = require('server/src/blocks/placemark/Sublist');
 *
 * Sublist html block - under placemark - list of relevant or relative placemarks
 */


const Component = require('server/src/core/parents/Component');
const BaseFunctions = require('server/src/functions/BaseFunctions');
const Consts = require('server/src/settings/Constants');
const ErrorCodes = require('server/src/settings/ErrorCodes');
const Catalog = require('server/src/components/Catalog');
const Service = require('server/src/core/Service');
const CaregoriesViewerBlock = require('server/src/blocks/category/CaregoriesViewer');
const CommonBaseFunctions = require('server/common/functions/BaseFunctions');
const Placemarks = require('server/src/components/Placemarks');
class SublistBlock extends Component {

    constructor() {
        super();
    }

    render(data) {
        let _html = '';

        if (BaseFunctions.isSet(data['ids'])) {

            let _placemarks = Placemarks.getInstance(this.requestId).getPlacemarksSublist(data['ids']);

            let _imageWidth = data['image_width'];
            let _imageHeight = data['image_height'];
            let _title = data['title'];
            let _ident = data['ident'];

            if (_placemarks.length > 0) {
                _html += `
                    <div class="sublist_placemarks">
                        <div class="sublist_placemarks_title">
                            ${_title}
                        </div>`;

                let _i = 0;

                for (let _index in _placemarks) {

                    let _placemark = _placemarks[_index];
                    _i++;

                    let _photoData = BaseFunctions.getRandomPlacemarkPhoto(_placemark['photos'], 5, true, this);
                    let linkText1 = '';
                    let linkText2 = '';
                    if (this.isMapPage()) {

                        linkText1 = 'onclick="/*//ATTENTION - обратите внимание*/my_map_vendor.get_placemark(' + _placemark['id'] + ');"';
                        linkText2 = linkText1;
                    } else {
                        linkText1 = 'onclick="/*//ATTENTION - обратите внимание*/javascript:document.location.href = \'' + _placemark['url'] + '\'"';
                        linkText2 = 'href="' + _placemark['url'] + '"';
                    }


                    _html += `
                        <div class="sublist_placemarks_block">
                            <div ${linkText1} class="sublist_placemarks_photo" style="width:${_imageWidth}px" id="sublist_placemarks_photo_${_ident}_${_index}">
                                ${CommonBaseFunctions.viewCroppedPhoto(_photoData['url'],_photoData['width'],_photoData['height'],_imageWidth,_imageHeight)}
                            </div>
                            <div class="sublist_placemarks_content">`;

//ATTENTION - обратите внимание - прямая ссылка
                    if (Service.getInstance(this.requestId).whetherToUseTitles()){
                        _placemarks[_index]['title'] = _placemark['title'] ? _placemark['title'] : (this.getText('map/default_title_part/value') + ' ' + _placemark['id']);
                        _html += `
                                <div class="sublist_placemarks_content_title">
                                    <a ${linkText2}>${_placemark['title']}</a>
                                </div>`;
                    }

                    _html += `
                                <div class="sublist_placemarks_content_adress">`;

                    if (this.isMobile()) {
                        _html += `
                                    <img src='${_placemark['flag_url']}' class='adress_country_flag'/>`;
                    } else {
                        _html +=
                                    _placemark['formatted_address'];
                    }
                    _html += `
                                </div>`;


                    _html += `
                                ${CaregoriesViewerBlock.getInstance(this.requestId).render({'category':_placemark['category'],'subcategories':_placemark['subcategories']})}
                            </div>
                            <div class="clear"></div>
                        </div>`;

                    if (_i % 2 === 0) {
                        _html += `
                        <div class="clear"></div>`;
                    }

                }
                _html += `
                    <div class="clear"></div>
                </div>`;
            }
        }
        return _html;
    }
}

SublistBlock.instanceId = BaseFunctions.unique_id();
module.exports = SublistBlock;