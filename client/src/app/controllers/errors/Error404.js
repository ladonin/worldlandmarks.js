/*
 * File src/app/controllers/errors/Error404.js
 * import Error404 from 'src/app/controllers/errors/Error404';
 */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Hat from 'src/app/common/blocks/Hat';

import { connect } from 'react-redux'


import Controller from 'src/app/parents/Controller';
import Consts from 'src/settings/Constants';

class Error404 extends Controller {

    constructor() {
        super();



      //  this.props.match.params.controller;
       //this.props.match.params.action
    }

    componentWillMount(){
        this.props.match.params.controller = Consts.CONTROLLER_NAME_ERRORS;
        this.props.match.params.action = 'error404';
    }
    render() {
        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    {this.props.errorMessage}
                </React.Fragment>
                );
    }
}










/////////////////redux1111111
function mapStateToProps(state) {
  const { errorMessage } = state.dynamicData;

  return {
    errorMessage
  }
}
let mapDispatchToProps = {

  }

export default connect(mapStateToProps, mapDispatchToProps)(Error404)





