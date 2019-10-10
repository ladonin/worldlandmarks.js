/*
 * File src/app/common/blocks/PageScrolling.js
 * import PageScrolling from 'src/app/common/blocks/PageScrolling';
 *
 * PageScrolling block component
 */

import React from 'react';

import Block from 'src/app/parents/Block';
import Consts from 'src/settings/Constants';
import BaseFunctions from 'src/functions/BaseFunctions';
import Events from 'src/modules/Events';
import CssTransition from 'src/app/common/CssTransition';

class PageScrolling extends Block {

    constructor() {
        super();

        this._scrollStarted = false;
        this._scrollDownCoords = 0;
        this._scrollDownStatus = 0;
        this._buttonPressed = false;

        this.state={status:'up', hidden:true};

        this.scroll = this.scroll.bind(this);
        this.reset = this.reset.bind(this);
    }

    componentWillUnmount() {alert(111);
        Events.remove(Consts.EVENT_RESET_PAGE_SCROLLING, this.reset);
    }

    reset(){
        this._scrollStarted = false;
        this._scrollDownCoords = 0;
        this._scrollDownStatus = 0;
        this._buttonPressed = false;
        this.setState({status:'up', hidden:true});
    }

    componentDidMount(){

        let _callback = function () {
            let _scroll = BaseFunctions.getScrollTop(window);

            if ((_scroll <= 500) && (!this._buttonPressed)) {
                this._scrollDownStatus = 0;
                if (this._scrollStarted === false) {
                    this.hide();
                } else {
                    this.arrowDown();
                }
            }
            else {
                this.show();
            }
        };

        BaseFunctions.onScroll(window, _callback.bind(this));
        Events.add(Consts.EVENT_RESET_PAGE_SCROLLING, this.reset);
    }

    scroll(){
            this._buttonPressed = true;
            if (this._scrollStarted === true) {

                if (this._scrollDownStatus === 0) {

                    let _callback = function () {
                        // Animation complete.
                        this._buttonPressed = false;
                        this.arrowUp();
                    }
                    BaseFunctions.scrollTop('body,html', this._scrollDownCoords, true, 200, _callback.bind(this));
                    this._scrollDownStatus = 1;
                } else if (this._scrollDownStatus === 1) {

                    let _callback = function () {
                        // Animation complete.
                        this._buttonPressed = false;
                        this.arrowDown();
                    }
                    BaseFunctions.scrollTop('body,html', 0, true, 200, _callback.bind(this));
                    this._scrollDownCoords = BaseFunctions.getScrollTop(window);
                    this._scrollDownStatus = 0;
                }
            } else {
                let _callback = function () {
                    // Animation complete.
                    this._buttonPressed = false;
                    this.arrowDown();
                }
                BaseFunctions.scrollTop('body,html', 0, true, 200, _callback.bind(this));
                this._scrollStarted = true;
                this._scrollDownCoords = BaseFunctions.getScrollTop(window);
            }
    }

    show(){
        this.setState({hidden:false});//BaseFunctions.fadeIn('#my_page_scrolling_button');
    }
    hide(){
        this.setState({hidden:true});//BaseFunctions.fadeOut('#my_page_scrolling_button');
    }

    arrowUp(){
        this.setState({status:'up'});
    }

    arrowDown(){
        this.setState({status:'down'});
    }

    render() {
        let _content = '';
        if (this.state.hidden === true) {
            return null;
        }

        return (<CssTransition type={1}><div id="my_page_scrolling_button" onClick={this.scroll} className={"my_page_scrolling_button my_page_scrolling_button_" + this.state.status}></div>
            </CssTransition>
        );
    }
}

export default PageScrolling