/*
 * File src/app/parents/Controller.js
 * import Controller from 'src/app/parents/Controller';
 *
 * Common controller component
 */

import React, {Component } from 'react';
import Router from 'src/modules/Router';
import Consts from 'src/settings/Constants';
import Socket from 'src/app/socket/Socket';
import Common from 'src/app/parents/Common';
import Events from 'src/modules/Events';

export default class Controller extends Common
{

    getActionName()
    {
        return Router.getActionName(this.props.match.params);
    }


    componentDidMount()
    {
        Events.add(Consts.EVENT_GOTO, (e)=>{this.props.history.push(e.detail.url)});
    }


    componentWillUnmount()
    {
        Events.remove(Consts.EVENT_GOTO);
    }
}