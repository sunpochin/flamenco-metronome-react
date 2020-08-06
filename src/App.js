import React, { Component } from 'react';
import { Route, Switch} from 'react-router-dom';
import Editor from './containers/Editor/Editor';

import './App.css';


class App extends Component {
  render () {
    return (
        <Switch>
            <Route path="/" component={Editor} />
        </Switch>
    );
  }
}

export default App;
