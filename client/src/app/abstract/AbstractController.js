/*
 * File src/app/abstract/AbstractController.js
 * import AbstractController from 'src/app/abstract/AbstractController';
 *
 * Common controller component
 */

import { Component } from 'react';
import Router from 'src/modules/router/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';


export default class AbstractController extends Component {

    componentWillMount() {
        Router.set(this.props.match.params);
    }
    componentDidMount() {
        Socket.query();
    }

}


