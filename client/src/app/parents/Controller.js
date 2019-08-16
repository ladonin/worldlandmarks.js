/*
 * File src/app/parents/Controller.js
 * import Controller from 'src/app/parents/Controller';
 *
 * Common controller component
 */

import { Component } from 'react';
import Router from 'src/modules/router/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';


export default class Controller extends Component {

    getActionName() {
        return Router.getActionName(this.props.match.params);
    }

}


