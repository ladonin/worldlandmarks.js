/*
 * File src/app/common/blocks/catalog/placemark/PhotosNavigator.js
 * import PhotosNavigator from 'src/app/common/blocks/catalog/placemark/PhotosNavigator';
 *
 * PhotosNavigator block component
 */

import React from 'react';

import Block from 'src/app/parents/Block';
import BaseFunctions from 'src/functions/BaseFunctions';
import Consts from 'src/settings/Constants';

class PhotosNavigator extends Block {

    constructor() {
        super();
        this.photosKeys = [];
        this.paste = <span style={{marginLeft:'30px'}}></span>;
        this.scrollTop = this.scrollTop.bind(this);
        this.scrollTo = this.scrollTo.bind(this);
        this.toStart = this.toStart.bind(this);
        this.previous = this.previous.bind(this);
        this.toDescription = this.toDescription.bind(this);
        this.toCurrent = this.toCurrent.bind(this);
    }

    scrollTop() {
        BaseFunctions.scrollTop(this.props.scrollBlockSelector,0);
    }

    emptyButton(width) {
        return <span style={{marginLeft:width+'px'}}></span>;
    }

    scrollTo(to){
        let _from = this.props.scrollBlockSelector;
        return function(){
            BaseFunctions.scrollTo(_from, to)
        }
    }

    toStart() {
        return <i className="fa fa-fast-backward pointer hover_blue" aria-hidden="true" onClick={this.scrollTop}></i>;
    }

    next(key) {
        return <i className="fa fa-step-forward pointer hover_blue" aria-hidden="true" onClick={this.scrollTo('#placemark_photo_'+(key+1)+'_navigator')}></i>;
    }

    previous(key) {
        return <i className="fa fa-step-backward pointer hover_blue" aria-hidden="true" onClick={this.scrollTo('#placemark_photo_'+(key-1)+'_navigator')}></i>;
    }

    toDescription() {
        return <i className="fa fa-fast-forward pointer hover_blue" aria-hidden="true" onClick={this.scrollTo('#'+this.props.contentBlockIdName)}></i>;
    }

    toCurrent(key) {
        return <i className="fa fa-circle pointer hover_blue" aria-hidden="true" onClick={this.scrollTo('#placemark_photo_'+(key)+'_navigator')}></i>;
    }

    render() {
        if (this.props.photosCount > 1) {
            if (this.props.number === 0) {
                return <React.Fragment>
                    {this.emptyButton(13)}{this.paste}{this.emptyButton(7)}{this.paste}{this.toCurrent(this.props.number)}{this.paste}{this.next(this.props.number)}{this.paste}{this.toDescription()}
                    </React.Fragment>;
            } else if ((this.props.number+1) < this.props.photosCount) {
                return <React.Fragment>
                    {this.toStart()}{this.paste}{this.previous(this.props.number)}{this.paste}{this.toCurrent(this.props.number)}{this.paste}{this.next(this.props.number)}{this.paste}{this.toDescription()}
                    </React.Fragment>;
            }  else {
                return <React.Fragment>
                    {this.toStart()}{this.paste}{this.previous(this.props.number)}{this.paste}{this.toCurrent(this.props.number)}{this.paste}{this.emptyButton(7)}{this.paste}{this.toDescription()}
                    </React.Fragment>;
            }
        } else {
            return <React.Fragment>
                {this.toCurrent(this.props.number)}{this.paste}{this.toDescription()}
                </React.Fragment>;
        }
    }
}

export default PhotosNavigator