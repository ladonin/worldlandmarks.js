/*
 * File src/app/common/blocks/Breadcrumbs.js
 * import Breadcrumbs from 'src/app/common/blocks/Breadcrumbs';
 *
 * Breadcrumbs block component
 */

import React, {Component} from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom';

import Block from 'src/app/parents/Block';

class Breadcrumbs extends Block {

    render() {
        let _breadcrumbs = this.props.redux.breadcrumbs;

        if (_breadcrumbs && _breadcrumbs.length) {

            let _breadbrumbsList = [];

            for (let _index in _breadcrumbs) {
                let _breadcrumb = _breadcrumbs[_index];
                if (_breadcrumb['url']) {
                    _breadbrumbsList.push(
                        <a key={_index} onClick={this.goTo} data-url={_breadcrumb['url']}>{_breadcrumb['name']}</a>
                    );
                } else {
                    _breadbrumbsList.push(
                        <h3 key={_index}>{_breadcrumb['name']}</h3>
                    );
                }
            }

            return (
                <React.Fragment>
                    <div className="breadcrumbs">
                        <div className="left_10">
                            {_breadbrumbsList}
                        </div>
                    </div>
                    <div className="padding_after_hat"></div>
                </React.Fragment>);
        }

        let showBlank = false;

        if (this.props.redux.controller === 'catalog' && this.props.redux.action && this.props.redux.action !== 'index') {
            showBlank = true;
        }

        return showBlank === false ? null :
            <React.Fragment>
                <div className="breadcrumbs">
                    <div className="left_10">
                        <div style={{height:'26px'}}></div>
                    </div>
                </div>
                <div className="padding_after_hat"></div>
            </React.Fragment>;
    }
}

function mapStateToProps(state) {

    return {
        redux: {
            breadcrumbs: state.actionData['breadcrumbs'],
            controller: state.staticData['controller'],
            action: state.staticData['action'],
        }
    };
}

export default connect(mapStateToProps)(withRouter(Breadcrumbs))