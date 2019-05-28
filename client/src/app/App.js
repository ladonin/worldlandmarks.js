import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';

// Modules
import Localization from 'src/modules/localization/Localization';

// Settings
import Consts from 'src/settings/Constants';

// Components
import Main from './controllers/main/Main';
import Map from './controllers/map/Map';
import Catalog from './controllers/catalog/Catalog';
import Article from './controllers/article/Article';

// Css
import "./Css";



class App extends Component {
    constructor(){
        super();
        this.initSettings();
    }

    initSettings(){
        Localization.changeLang(Consts.LANGUAGE_EN);
    }

    componentDidMount(){

    }
  render() {
    const App = () => (
      <div>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route path='/map' component={Map}/>
          <Route path='/catalog' component={Catalog}/>
          <Route path='/article' component={Article}/>
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
