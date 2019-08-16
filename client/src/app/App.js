import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";


import Socket from 'src/app/socket/Socket';

import { withRouter } from 'react-router-dom';

// Modules
//import Localization from 'src/modules/localization/Localization';

// Settings
import Consts from 'src/settings/Constants';

// Components
import Main from './controllers/main/Main';
import Map from './controllers/map/Map';
import Catalog from './controllers/catalog/Catalog';
import Article from './controllers/article/Article';

import Error404 from './controllers/errors/Error404';

import Language from 'src/modules/Language';
import Router from 'src/modules/router/Router';

// Css
import "./Css";



class App extends Component {
    constructor(){
        super();
        this.initSettings();

    }
    componentWillUpdate() {
        //console.log('App componentWillUpdate');
    }
    componentDidMount() {

        //console.log('App componentWillMount');

    }
    componentDidUpdate() {
        alert(11111);
    }
    initSettings(){
        //Localization.changeLang(Consts.LANGUAGE_EN);
    }

//  rr(){
//     Socket.getSocket().emit('api', {data:{a:1,b:2}, controller: 'main', action: 'index', service:'landmarks', language:Language.getName()});
//  }

    componentDidMount(){
    }
  render() {

    const App = () => (
      <div onClick={this.rr}>

        <Switch>
          <Route exact path='/' component={Main}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_MAP+')/:var2?'} component={Map}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_CATALOG+')/:var2?/:var3?/:var4?'} component={Catalog}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_ARTICLE+')/:var2?'} component={Article}/>
          <Route component={Error404}/>
        </Switch>
      </div>
    );

    return (
      <div>
        <App/>
      </div>
    );
  }
}


export default App
