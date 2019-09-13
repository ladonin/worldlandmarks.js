/*
 * File src/app/common/blocks/CroppedPhoto.js
 * import CroppedPhoto from 'src/app/common/blocks/CroppedPhoto';
 *
 * CroppedPhoto block component
 */

import React from 'react';

import Block from 'src/app/parents/Block';
import CommonBaseFunctions from 'src/../../server/common/functions/BaseFunctions';

class CroppedPhoto extends Block {

    constructor() {
        super();
    }

    render() {

        let _cropData = CommonBaseFunctions.viewCroppedPhoto(
                null,
                this.props.photoWidth,
                this.props.photoHeight,
                this.props.blockWidth,
                this.props.blockHeight,
                false);

        return <div className='cropped_image_div' style={{width: this.props.blockWidth + "px", height: this.props.blockHeight + "px", overflow: 'hidden'}}>
                <img src={this.props.photoSrc} style={{width: _cropData.width + "px", height: _cropData.height + "px", position: 'relative', top: _cropData.top + "px", left: _cropData.left + "px"}}/>
            </div>;
    }
}


export default CroppedPhoto;