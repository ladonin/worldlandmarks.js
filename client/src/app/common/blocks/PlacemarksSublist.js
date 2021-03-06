/*
 * File src/app/common/blocks/PlacemarksSublist.js
 * import PlacemarksSublist from 'src/app/common/blocks/PlacemarksSublist';
 *
 * PlacemarksSublist block component
 */

import React from 'react';
import {isMobile} from "react-device-detect";
import { withRouter } from 'react-router-dom';

import Consts from 'src/settings/Constants';
import Block from 'src/app/parents/Block';
import CroppedPhoto from 'src/app/common/blocks/CroppedPhoto';
import PlacemarkCaregories from 'src/app/common/blocks/PlacemarkCaregories';
import BaseFunctions from 'src/functions/BaseFunctions';
import MapModule from 'src/modules/Map';

class PlacemarksSublist extends Block
{

    render()
    {
        if (this.props.placemarks.length) {

            let itemsList = [];
            let _i = 0;

            let _style1 = {};
            let _style2 = {};

            if (this.props.isMap === true && this.props.atCluster === true) {
                if (isMobile) {
                    _style1 = {
                        width: BaseFunctions.getWidth(window) - MapModule.getClusterListImageWidth() - 25
                    }
                } else {
                    _style1 = {
                        width: 630
                    }
                }
            } else {
                if (isMobile) {
                    _style1 = {
                        width: BaseFunctions.getWidth(window)
                    }
                }
            }

            if (_style1.width) {
                _style2 = {
                    width: _style1.width - this.props.imageWidth - 30 + 'px'
                }
                _style1.width = _style1.width + 'px';
            }

            for (let _index in this.props.placemarks) {
                _i++;
                let _placemark = this.props.placemarks[_index];
                let _photoData = _placemark['photos'][0];
                let dataUrl = this.props.isMap ? ('/' + Consts.CONTROLLER_NAME_MAP + '/' + _placemark['id']) : (_placemark['url']);

                itemsList.push(
                        <div key={_index} className="sublist_placemarks_block" style={_style1}>
                            <div
                            onClick={this.goTo}
                            data-url={dataUrl}
                            className="sublist_placemarks_photo"
                            style={{width: this.props.imageWidth + 'px'}}
                            id={'sublist_placemarks_photo_' + this.props.ident + '_' + _index}>
                                <CroppedPhoto
                                    blockWidth = {this.props.imageWidth}
                                    blockHeight ={this.props.imageHeight}
                                    photoWidth = {_photoData['width']}
                                    photoHeight = {_photoData['height']}
                                    photoSrc = {_photoData['dir']+'5_'+_photoData['name']}
                                    />
                            </div>
                            <div className="sublist_placemarks_content" style={_style2}>
                                {_placemark['title'] &&
                                    <div className="sublist_placemarks_content_title">
                                        <a onClick={this.goTo} data-url={dataUrl}>{_placemark['title']}</a>
                                    </div>}
                                <div className="sublist_placemarks_content_adress">
                                    {isMobile &&
                                        <img src={_placemark['flag_url']} className='adress_country_flag'/>}
                                    {!isMobile &&
                                        <div dangerouslySetInnerHTML={{__html:_placemark['formatted_address']}}></div>}
                                </div>
                                <PlacemarkCaregories
                                    subcategories={_placemark['subcategories']}
                                    category={_placemark['category']}
                                    />
                            </div>
                            <div className="clear"></div>
                        </div>);
                if (_i % 2 === 0) {
                    itemsList.push(<div key={_index+'_c'} className="clear"></div>)
                }
            }
            return <div className="sublist_placemarks">
                    <div className="sublist_placemarks_title">
                        {this.props.title}
                    </div>
                    {itemsList}
                    <div className="clear"></div>
                </div>;
        }
    }
}

export default withRouter(PlacemarksSublist)