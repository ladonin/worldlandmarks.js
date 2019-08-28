/*
 * File src/modules/ImageDimensions.js
 * import ImageDimensions from 'src/modules/ImageDimensions';
 *
 * Works with image dimensions
 */

import Consts from 'src/settings/Constants';
import Config from 'src/settings/Config';
import Service from 'src/modules/Service';
import Language from 'src/modules/Language';
import CommonBaseFunctions from 'src/../../application/common/functions/BaseFunctions';
import ConfigRestrictions from 'src/../../application/common/settings/Restrictions';

/*
 * Return image size prefix. Image width must be >= than container width in order not to lose quality
 *
 * @param {integer} width - approximate necessary image width
 * @param {integer} amendment - approximate for width selection
 *  For example:
 *
 *  we have the next sixe prefixes in config
 *      6 => 500
 *      9 => 670
 *
 *  1) block has width 501px with scrollbar having width 16px,
 *  then arguments will be (501,16)
 *  and result will be 9_
 *
 *  2) block has width 490px with scrollbar having width 16px,
 *  then arguments will be (490,16)
 *  and result will be 9_ (490 + 16) = 506
 *
 *  3) block has width 499px without scrollbar (inner block),
 *  then arguments will be (499,0)
 *  and result will be 6_
 *
 *  4) block has width 500px without scrollbar (inner block),
 *  then arguments will be (500,0)
 *  and result will be 6_
 *
 *  5) block has width 501px without scrollbar (inner block),
 *  then arguments will be (501,0)
 *  and result will be 9_
 *
 * @return {boolean}
 */

let _prefixWidths = ConfigRestrictions['sizes']['images']['widths'];

function getPrefix(width, amendment) {

    let _imageWidthCurrent = 0;
    let _maxSizePrefix = 0;
    let _maxSizeWidth = 0;
    let _contentImagePrefix = null;

    for (let _prefix in _prefixWidths) {
        let _prefixWidth = _prefixWidths[_prefix];

        if (((_imageWidthCurrent > _prefixWidth) || (_imageWidthCurrent === 0)) && (width <= (_prefixWidth - amendment))) {
            _contentImagePrefix = _prefix + '_';
            _imageWidthCurrent = _prefixWidth;
        }

        // On case if prefix will not be found
        if ((_maxSizeWidth == 0) || (_maxSizeWidth < _prefixWidth)) {
            _maxSizeWidth = _prefixWidth;
            _maxSizePrefix = _prefix;
        }
    }

    // If prefix is not found then get the biggest
    if (!_contentImagePrefix) {
        _contentImagePrefix = _maxSizePrefix + '_';
    }

    return _contentImagePrefix;
}


export default {
    getPrefix
}





