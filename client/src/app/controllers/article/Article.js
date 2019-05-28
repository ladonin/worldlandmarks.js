import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Settings
import Consts from 'src/settings/Constants';

// Modules
import Url from 'src/modules/controller/Controller';

// Components
import Hat from 'src/app/common/blocks/Hat';

//Css
//import "./Css";








class Article extends Component {

    constructor() {
        super();
        Url.setControllerName(Consts.CONTROLLER_NAME_ARTICLE);
    }


    render() {
        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>





                </React.Fragment>
                );
    }
}
export default Article;
