import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
//import './App.css';
import Home from './pages/home/Home';
import Map from './pages/map/Map';
import Catalog from './pages/catalog/Catalog';
import Localization from 'src/modules/localization/Localization';
import Consts from 'src/settings/Consts';
import "./Css";





class App extends Component {
    constructor(){
        super();
        this.initSettings();
    }

    initSettings(){
        Localization.changeLang(Consts.MY_LANGUAGE_EN);
    }

    componentDidMount(){

    }
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route path='/map' component={Map}/>
          <Route path='/catalog' component={Catalog}/>
        </Switch>
      </div>
    )
    return (
      <Switch>
        <App/>
      </Switch>
    );
  }
}

export default App;
