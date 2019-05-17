import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
//import Button from 'react-bootstrap/Button';
import App from './app/App';



///<Button>fghgfh</Button>

render((
    <BrowserRouter>
        <App/>
    </BrowserRouter>
), document.getElementById('root'));

