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
    this.handleAdd = this.handleAdd.bind(this);
    this.handleDel = this.handleDel.bind(this);

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

  handleAdd = function (e) {
    const idx = e.target.getAttribute("data-index");
    let newArray = this.state.compasArray.slice();
    let newItem = newArray[idx - 1];
    console.log('add: ', idx); //will log the index of the clicked item
    console.log('newArray: ', newArray, 'type: ', typeof (newArray));
    console.log('newItem: ', newItem);
    newArray.splice(idx, 0, newItem);
    console.log('newArray: ', newArray);
    this.setState({ compasArray: newArray });
  };


  handleDel = function (e) {
    console.log('delete: ', e.target.getAttribute("data-index")); //will log the index of the clicked item
  };

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
          <td><Button id="" data-index={index + 1} onClick={this.handleAdd} variant="warning">ins</Button></td>
          <td><Button id="" data-index={index + 1} onClick={this.handleDel} variant="warning">del</Button></td>
        </tr >
      );
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
    )
  }
}

export default Editor;
//export default withErrorHandler(Editor, axios );
