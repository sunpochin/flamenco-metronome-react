import { Button, Table } from 'react-bootstrap';
import React, { Component } from 'react';
import { serverapi } from './serverapi.js';
import MetronomeEditor from './MetronomeEditor.js';
import { VisSettings } from './MetronomeCore.js';

class Editor extends Component {
  constructor(props) {
    super(props);
    //        this.state = {...};
    //        self = this;
    this.state = { compasArray: [] };
    this.theEditor = new MetronomeEditor('./res/audio/',
      ['Low_Bongo.wav', 'Clap_bright.wav',],
      VisSettings);
    this.theEditor.setAudioContext(new (window.AudioContext || window.webkitAudioContext)());

    this.state = { isToggleOn: true };

    // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
    this.handlePlayPause = this.handlePlayPause.bind(this);
    this.loadCompas = this.loadCompas.bind(this);
    this.saveCompas = this.saveCompas.bind(this);
    //    this.compasArray = {};


    this.loadCompas();
  }

  createTable(datas) {
    for (let element of datas) {
    }
  }
  async loadCompas() {
    await this.theEditor.loadJson().then(datas => {
      //      this.compasArray = datas;
      this.setState({ compasArray: datas });
      console.log('loadCompas: ', datas);
      console.log('this.states: ', this.states);

    });
  }

  saveCompas() {
    this.theEditor.saveJson();
  }

  handlePlayPause() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
    this.theEditor.startStop();
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
      const data = [{ "name": "test1" }, { "name": "test2" }];
      header = (<tr>
        <td>*</td>
        <td>Speed</td>
      </tr>);
      listItems = this.state.compasArray.map((compas, index) =>
        <tr key={index}>
          <td>{compas.no}</td>
          <td>{compas.Speed}</td>
        </tr >
      );


      this.state.compasArray.map((rowvalue, index) => {
        return (
          <tr key={index}>
            <td>{rowvalue.Palo}</td>
            <td>{rowvalue.no}</td>
            <td>{rowvalue.Speed}</td>
          </tr>
        )
      })
    }
    // self.metroWorker = new MetronomeCore(soundsPath, sounds, metroSoundListener);
    return (
      <div>
        <h1>Flamenco Metronome Editor</h1>
        <Button variant="primary" onClick={this.loadCompas}>Load</Button>{' '}
        <Button variant="success" onClick={this.saveCompas}>Save</Button>{' '}
        <Button variant="warning" onClick={this.handlePlayPause}>
          {this.state.isToggleOn ? 'Play' : 'Stop'}
        </Button>
        <div>
          <Table striped bordered hover>
            <thead>
              {header}
              <tr>
              </tr>
            </thead>
            <tbody>
              {listItems}
              <tr>
                <td>1</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>2</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
              <tr>
                <td>3</td>
                {Array.from({ length: 12 }).map((_, index) => (
                  <td key={index}>Table cell {index}</td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>
      </div>
    )
  }
}

export default Editor;
//export default withErrorHandler(Editor, axios );
