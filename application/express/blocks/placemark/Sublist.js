/*
 * File application/express/blocks/placemark/Sublist.js
 * const SublistBlock = require('application/express/blocks/placemark/Sublist');
 *
 * Sublist html block - under placemark - list of relevant or relative placemarks
 */


const Component = require('application/express/core/abstract/Component');
const BaseFunctions = require('application/express/functions/BaseFunctions');
const Consts = require('application/express/settings/Constants');
const ErrorCodes = require('application/express/settings/ErrorCodes');/////////////
const Catalog = require('application/express/components/Catalog');//////
const Service = require('application/express/core/Service');
const CaregoriesViewerBlock = require('application/express/blocks/category/CaregoriesViewer');


class SublistBlock extends Component {

    constructor() {
        super();
    }

    render(data) {
        let _html = '';


        if (BaseFunctions.isSet(data['ids'])) {

            let _placemarks = Catalog.getInstance(this.requestId).getPlacemarksSublist(data['ids']);

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
                            <div ${linkText1} class="sublist_placemarks_photo" id="sublist_placemarks_photo_${_ident}_${_index}">
                                <script type="text/javascript">
                                    $(document).ready(function () {
                                        var photo = view_cropped_photo('${_photoData['url']}',${_photoData['width']},${_photoData['height']}, ${_imageWidth}, ${_imageHeight});
                                        $('#sublist_placemarks_photo_${_ident}_${_index}').append(photo);
                                        $('.sublist_placemarks_photo').width('${_imageWidth}');
                                    });
                                </script>
                            </div>
                            <div class="sublist_placemarks_content">`;

//ATTENTION - обратите внимание - прямая ссылка
                    if (Service.getInstance(this.requestId).whetherUseTitles()){
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
                                    <img src='" + _placemark['flag_url'] + "' class='adress_country_flag'/>`;
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