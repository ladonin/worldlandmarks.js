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

                                                import Socket from 'socket.io-client';
                                            const socket = Socket('http://192.168.56.1:3001');



class App extends Component {
    constructor(){
        super();
        this.initSettings();
    }

    initSettings(){
        Localization.changeLang(Consts.LANGUAGE_EN);

                                    socket.on('news', function (data) {
                                                     console.log(data);
                                                 socket.emit('my other event', { my: 'data' });
                                                });

    }
                                                 rr(){
                                                        socket.emit('my other event', { my: 'data' });
                                             }
    componentDidMount(){

    }
  render() {
    const App = () => (
      <div                                                                              onClick={this.rr}>
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
