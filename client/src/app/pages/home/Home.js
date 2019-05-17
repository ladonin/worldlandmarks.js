import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import "./Css";


import Hat from "src/app/common/blocks/Hat";
import HomeMain from "src/app/common/blocks/HomeMain";






class Home extends Component {

    //constructor() {
    //    super();
    //}


    render() {
        return (
                <React.Fragment>
                    <Hat/>
                    <div className="padding_after_hat"></div>
                    <HomeMain/>




                </React.Fragment>
                );
    }
}
export default Home;
