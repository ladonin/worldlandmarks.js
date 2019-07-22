import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { Provider } from "react-redux";


import Socket from 'src/app/socket/Socket';



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



// Css
import "./Css";













//////////////////redux1111111
import { connect } from 'react-redux'
import {updateStaticText} from 'src/app/redux/actions/Actions';

//////////////////////



















class App extends Component {
    constructor(){
        super();
        this.initSettings();

    }
    componentWillUpdate() {
        console.log('App componentWillUpdate');
    }
    componentWillMount() {
        console.log('App componentWillMount');
    }
    componentDidUpdate() {
        console.log('App componentDidUpdate');
    }
    initSettings(){
        //Localization.changeLang(Consts.LANGUAGE_EN);




    }

                                    rr(){
                                         Socket.getSocket().emit('api', {data:{a:1,b:2}, controller: 'main', action: 'index', service:'landmarks', language:Language.getName()});
                                    }

    componentDidMount(){
Socket.getSocket().emit('api', {data:{a:1,b:2}, controller: 'main', action: 'index', service:'landmarks', language:Language.getName()});
    }
  render() {console.log('App render');
    const App = () => (
      <div onClick={this.rr}>
        <Switch>
          <Route exact path='/' component={Main}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_MAP+')/:action?'} component={Map}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_CATALOG+')/:action?'} component={Catalog}/>
          <Route path={'/:controller('+Consts.CONTROLLER_NAME_ARTICLE+')/:action?'} component={Article}/>
          <Route component={Error404}/>
        </Switch>
      </div>
    );



    //////////////redux1111111
    const { redux1111111 } = this.props;
    /////////////////
console.log('this.props');
console.log(this.props);

    return (

      <div>========={redux1111111}
        <App/>
      </div>
    );
  }
}

//export default App; redux1111111





/////////////////redux1111111
function mapStateToProps(state) {
  const { redux1111111 } = state.staticText;

  return {
    redux1111111
  }
}
let mapDispatchToProps = {
    updateStaticText
  }

export default connect(mapStateToProps, mapDispatchToProps)(App)
    //////////////////