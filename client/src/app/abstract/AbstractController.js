/*
 * File src/app/abstract/AbstractController.js
 * import AbstractController from 'src/app/abstract/AbstractController';
 *
 * Common controller component
 */

import { Component } from 'react';
import Controller from 'src/modules/controller/Controller';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';


export default class AbstractController extends Component {




    componentDidMount() {
        Controller.setControllerName(this.props.match.params.controller);
        Controller.setActionName(this.props.match.params.action);
        Socket.query();
    }








}