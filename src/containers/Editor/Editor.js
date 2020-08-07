import { Button, Table } from 'react-bootstrap';
import React, { Component } from 'react';
import { serverapi } from './serverapi.js';
import MetronomeModel from './MetronomeModel.js';
import { VisSettings, MetronomeCore } from './MetronomeCore.js';

import AudioFiles from './AudioFiles.js';

class Editor extends Component {
  constructor(props) {
    super(props);
    //        this.state = {...};
    //        self = this;
    this.state = { compasArray: [] };

    this.soundsPath = './res/audio/';
    let sounds = ['Low_Bongo.wav', 'Clap_bright.wav',];
    const metroSoundListener = {
      setTempo: (t) => VisSettings.tempoBpm = t,
      setStartTime: (t) => VisSettings.startTime = t
    };
    this.metroCore = new MetronomeCore(metroSoundListener);

    console.log('this.props.isUnitTest:', this.props.isUnitTest);
    if (true == this.props.isUnitTest) {
    } else {
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const urls = sounds.map(name => this.soundsPath + name);
      console.log('urls: ', urls);
      let soundFiles = new AudioFiles(audioContext, urls);
      this.metroCore.setAudioContext(audioContext, soundFiles);
    }

    this.theModel = new MetronomeModel();
    this.theModel.setCore(this.metroCore);

    this.state = { isToggleOn: true };

    this.loadCompas();

    // for 'this' could be used in callback, we have to bind it here.
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.loadCompas = this.loadCompas.bind(this);
    this.saveCompas = this.saveCompas.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handlePlayHere = this.handlePlayHere.bind(this);
  }

  createTable(datas) {
    for (let element of datas) {
    }
  }
  async loadCompas() {
    await this.theModel.loadJson().then(datas => {
      this.theModel.setDatas(datas);
      this.setState({ compasArray: this.theModel.getDatas() });
      // console.log('loadCompas: ', datas);
      // console.log('this.states: ', this.states);
    });
  }

  saveCompas() {
    this.theEditor.saveJson();
  }

  handleAdd = function (e) {
    const idx = e.target.getAttribute("data-index");
    this.theModel.insertCompas(idx);
    this.setState({ compasArray: this.theModel.getDatas() });
  };


  handleDel = function (e) {
    console.log('delete: ', e.target.getAttribute("data-index")); //will log the index of the clicked item
  };

  handlePlayHere = function (e) {
    console.log('delete: ', e.target.getAttribute("data-index")); //will log the index of the clicked item
  };

  handlePlayPause() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    this.metroCore.startStop();
  }
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
  }

  componentDidMount() {
    serverapi.get('compas.json')
      .then(response => {
        console.log('response: ', response);
        this.setState({ ingredients: response.data });
      })
      .catch(error => {
        this.setState({ error: true });
      });
  }

  render() {
    // const data = [{ "name": "test1" }, { "name": "test2" }];
    // const listItems = data.map((d) =>
    //   <li key={d.name}>{d.name}</li>
    // );
    let listItems = [];
    let header = [];
    if (undefined != this.state.compasArray) {
      header = (<tr>
        <td></td>
        <td>*</td>
        <td>Palo</td>
        <td>Speed</td>
        <td>SType</td>
      </tr>);
      listItems = this.state.compasArray.map((compas, index) =>
        <tr key={index}>
          <td></td>
          <td>{compas.no}</td>
          <td>{compas.Palo}</td>
          <td>{compas.Speed}</td>
          <td>{compas.SType}</td>
          <td><Button id="" data-index={index + 1} onClick={this.handleAdd} variant="warning">
            ins</Button></td>
          <td><Button id="" data-index={index + 1} onClick={this.handleDel} variant="warning">
            del</Button></td>
          <td><Button id="" data-index={index + 1} onClick={this.handlePlayHere} variant="warning">
            play</Button></td>
        </tr >
      );
    };
    // self.metroWorker = new MetronomeCore(soundsPath, sounds, metroSoundListener);
    return (
      <div>
        <h1>Flamenco Metronome Editor</h1>
        <Button variant="primary" onClick={this.loadCompas}>Load</Button>{' '}
        <Button variant="success" onClick={this.saveCompas}>Save</Button>{' '}
        <Button variant="warning" onClick={this.handlePlayPause}>
          {this.state.isToggleOn ? 'Play' : 'Stop'}
        </Button>
        <div>Compas table ====
        </div>
        <div>
          <Table striped bordered hover>
            <thead>
              {header}
            </thead>
            <tbody>
              {listItems}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default Editor;
//export default withErrorHandler(Editor, axios );
