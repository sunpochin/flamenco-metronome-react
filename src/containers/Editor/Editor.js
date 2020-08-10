import './Editor.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Button, Table } from 'react-bootstrap';
import React, { Component } from 'react';
import MetronomeModel from './MetronomeModel.js';
import { VisSettings, MetronomeCore } from './MetronomeCore.js';

import AudioFiles from './AudioFiles.js';

class Editor extends Component {
  constructor(props) {
    super(props);
    this.init();

    this.state = {
      compasArray: [],
      palosArr: this.theModel.PalosArray,
      curPalo: 'default palo',
    };

    console.log('palosArr: ', this.state.palosArr, ', curPalo: ', this.state.curPalo);
    this.state = { isToggleOn: true };
  }

  init() {
    this.soundsPath = './res/audio/';
    let sounds = ['Low_Bongo.wav', 'Clap_bright.wav',];
    const metroSoundListener = {
      setTempo: (t) => VisSettings.tempoBpm = t,
      setStartTime: (t) => VisSettings.startTime = t
    };
    this.metroCore = new MetronomeCore(metroSoundListener);
    this.theModel = new MetronomeModel();
    this.theModel.setCore(this.metroCore);
    this.theModel.setPalo(0);

    console.log('theModel:', this.theModel, 'metroCore: ', this.metroCore);


    console.log('this.props.isUnitTest:', this.props.isUnitTest);
    if (true === this.props.isUnitTest) {
    } else {
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const urls = sounds.map(name => this.soundsPath + name);
      console.log('urls: ', urls);
      let soundFiles = new AudioFiles(audioContext, urls);
      this.metroCore.setAudioContext(audioContext, soundFiles);
    }
    this.loadCompas();

    // for 'this' could be used in callback, we have to bind it here.
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.loadCompas = this.loadCompas.bind(this);
    this.saveCompas = this.saveCompas.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);
    this.handlePlayHere = this.handlePlayHere.bind(this);
    this.onSelectPalo = this.onSelectPalo.bind(this);
    this.RenderView = this.RenderView.bind(this);
    this.metroCore.setNotifyChange(this.RenderView);

  }

  RenderView() {
    console.log('Editor.js, render view, this: ', this);
    this.setState(this.state);
  }

  async loadCompas() {
    await this.theModel.loadJson().then(datas => {
      this.theModel.setDatas(datas);
      this.setState(state => ({
        compasArray: this.theModel.getDatas()
      }));
      // console.log('loadCompas: ', datas);
      // console.log('this.states: ', this.states);
    });
  }

  saveCompas() {
    this.theModel.saveJson();
  }

  handleDropdownSelected = function (e) {
    const idx = e.target.getAttribute("data-index");
    console.log('handleDel: ', e.target.getAttribute("data-index"));
    let curPalo = this.state.palosArr[idx];
    console.log('curPalo: ', curPalo);
  }

  handleAdd = function (e) {
    const idx = e.target.getAttribute("data-index");
    this.theModel.insertCompas(idx);
    this.setState(state => ({
      compasArray: this.theModel.getDatas()
    }));
  };


  handleDel = function (e) {
    console.log('handleDel: ', e.target.getAttribute("data-index"));
    const idx = e.target.getAttribute("data-index");
    this.theModel.deleteCompas(idx);
    this.setState(state => ({
      compasArray: this.theModel.getDatas()
    }));
  };
  // play here.
  handlePlayHere = function (e) {
    const idx = e.target.getAttribute("data-index");
    // console.log('play here idx: ', idx);

    // this.theModel.metroCore.compasNo = idx;
    this.setState(this.state);
    this.theModel.handlePlayHere(idx);
    // this.metroCore.startPlaying();
  };

  handlePlayPause() {
    this.theModel.startStop();
    let newPlayState = this.metroCore.running;
    this.setState(state => ({
      isToggleOn: newPlayState
    }));
  }


  componentDidMount() {
  }

  onSelectPalo = function (e) {
    console.log('onSelectPalo:  e.value', e.value);
    for (let idx = 0; idx < this.theModel.PalosArray.length; idx++) {
      console.log('onSelectPalo:  e.value', e.value);
      if (this.theModel.PalosArray[idx] === e.value) {
        this.theModel.setPalo(idx);
      }
    }
  }

  render() {
    const compasNo = this.theModel.metroCore.compasNo;
    console.log('render, compasNo: ', compasNo);

    let listItems = [];
    let header = [];
    header = (<tr>
      <td></td>
      <td>*</td>
      <td>Speed</td>
      <td>SType</td>
      <td><Button id="" data-index={0} onClick={this.handleAdd} variant="warning">
        ins</Button></td>
      <td></td>
    </tr>);
    listItems = this.theModel.getDatas().map((compas, index) =>
      <tr key={index}
        className={index === compasNo ? "rowSelected" : ""}>
        <td><Button id="" data-index={index + 1}
          onClick={this.handlePlayHere} variant="warning">
          play</Button></td>
        <td>{compas.no}</td>
        <td>{compas.Speed}</td>
        <td>{compas.SType}</td>
        <td><Button id="" data-index={index + 1} onClick={this.handleAdd} variant="warning">
          ins</Button></td>
        <td><Button id="" data-index={index + 1} onClick={this.handleDel} variant="warning">
          del</Button></td>
      </tr >
    );
    let defaultOption = this.theModel.PalosArray[this.theModel.paloidx];
    return (
      <div>
        <h1>Flamenco Metronome Editor</h1>
        <Button variant="primary" onClick={this.loadCompas}>Load</Button>{' '}
        <Button variant="success" onClick={this.saveCompas}>Save</Button>{' '}
        <Button variant="warning" onClick={this.handlePlayPause}>
          {this.state.isToggleOn ? 'Play' : 'Stop'}
        </Button>
        <div>
          <br />
          ==== Select the Palo ====
          <Dropdown options={this.theModel.PalosArray}
            onChange={this.onSelectPalo} value={defaultOption} placeholder="Select the Palo" />
        </div>
        <div>
          <br />
          ==== Compas table ====
          <Table bordered hover table-primary='true'>
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
