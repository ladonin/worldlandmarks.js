/*
 * File src/app/common/PhotosList.js
 * import PhotosList from 'src/app/common/PhotosList';
 *
 * Photos List component
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {BrowserView, MobileView, isBrowser, isMobile} from "react-device-detect";
import Events from 'src/modules/Events';

import Consts from 'src/settings/Constants';

import PhotosNavigator from 'src/app/common/blocks/catalog/placemark/PhotosNavigator';
import ImageDimensions from 'src/modules/ImageDimensions';
import ConfigRestrictions from 'src/../../server/common/settings/Restrictions';
import BaseFunctions from 'src/functions/BaseFunctions';

class PhotosList extends Component {

    render() {
        let _photosList = [];
        let _blockWidth = this.props.width ? this.props.width : (isMobile ? BaseFunctions.getWidth(window) : ConfigRestrictions.desctop_content_width);
        let _prefix = this.props.prefix ? this.props.prefix : ImageDimensions.getPrefix(_blockWidth, this.props.amendment ? this.props.amendment : 0);

        for (let _index in this.props.photos) {
            let _number = parseInt(_index);
            let _photo =  this.props.photos[_index];
            let _dimentions = ImageDimensions.prepareContentImageDimentions(
                    _photo['width'],
                    _photo['height'],
                    _blockWidth,
                    (BaseFunctions.getHeight(window) - 100));

            _photosList.push(
                <React.Fragment>
                    <div className="placemark_photo_navigator" id={'placemark_photo_'+_number+'_navigator'}>
                        <PhotosNavigator scrollBlockSelector={this.props.scrollBlockSelector ? this.props.scrollBlockSelector : 'body, html'} photosCount={this.props.photos.length} contentBlockIdName='placemark_comment' number={_number}/>
                    </div>
                    <a href={_photo['dir'] + '1_' + _photo['name']} target="_blank"><img
                        style={{
                            width: _dimentions.width + 'px',
                            height: _dimentions.height + 'px'
                        }}
                        id={'catalog_placemark_photo_'+_number}
                        src={_photo['dir'] + _prefix + _photo['name']}/></a>
                </React.Fragment>);
        }
        return _photosList;
    }
}

export default PhotosList