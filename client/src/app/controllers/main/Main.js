import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Settings
import Consts from 'src/settings/Constants';

// Modules
import Url from 'src/modules/controller/Controller';

// Components
import Hat from "src/app/common/blocks/Hat";
import MainBlock_1 from "src/app/common/blocks/Main_1";

//Css
import "./Css";








class Main extends Component {

    constructor() {
        super();
        Url.setControllerName(Consts.MY_CONTROLLER_NAME_MAIN);
    }


    render() {
        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    <MainBlock_1/>




                </React.Fragment>
                );
    }
}
export default Main;
