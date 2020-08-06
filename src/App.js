import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import { VisSettings, MetronomeCore } from './containers/Editor/MetronomeCore.js';
import Editor from './containers/Editor/Editor';

import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';


class App extends Component {
  render() {
    // this.metroCore = new MetronomeCore(
    //   soundsPath, sounds, metroSoundListener);
    // this.metroCore.setAudioContext(new (window.AudioContext || window.webkitAudioContext)());

    return (
      <Switch>
        <Route path="/" component={Editor} />
      </Switch>
    );
  }
}

export default App;
