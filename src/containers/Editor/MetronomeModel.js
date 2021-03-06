import { postCompas, getCompas } from './serverapi.js';

let PalosArray = ['Alegrias', 'Seguiriyas', 'Tangos', 'Bulerias'];

let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
  1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0];
// let beatAlegriasTraditional = [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
//         1.0, 1.0, 1.0, 1.0, 1.0, 1.0];

let beatTangos = [1.0, 0.5, 0.5, 1.0, 1.0];

let beatSeguiriyas = [1.0, 0.5, 0.5, 1.0, 1.0];


let self = null;
// store the non-UI, re-usable parts: compas-list, logic.
class MetronomeModel {

  constructor() {
    self = this;
    // mimicing private variables: https://stackoverflow.com/a/28165599/720276
    this._datas = [];
    self.setDatas = function (datas) {
      this._datas = datas;
      console.log('in setData, _datas: ', this._datas, ', length: ', this._datas.length);
      // for (let iter = 0; iter < this._datas.length; iter++) {
      //   // _datas[iter]['no'] = (iter + 1).toString();
      // }
    }
    self.getDatas = function () { return this._datas; }
    self.getDataByIdx = function (idx) { return this._datas[idx]; }
    self.insertDatas = function (idx, aCompas) {
      this._datas.splice(idx, 0, aCompas);
      // for (let iter = 0; iter < this._datas.length; iter++) {
      //   // _datas[iter]['no'] = (iter + 1).toString();
      // }
      // // console.log('in setData: ', _datas);
    }
    self.deleteDatas = function (idx) {
      this._datas.splice(idx, 1);
      // for (let iter = 0; iter < this._datas.length; iter++) {
      //   // _datas[iter]['no'] = (iter + 1).toString();
      // }
    }

    this.PalosArray = PalosArray;
    this.paloidx = 0;

  }

  // reorderData(datas) {
  //   let newDatas = datas;
  //   console.log('in reorderData: ', newDatas);

  //   return newDatas;
  // }

  startStop() {
    if (false === this.metroCore.playing) {
      this.metroCore.startPlaying();
    } else {
      this.metroCore.pausePlaying();
    }
  }

  handlePlayHere(idx) {
    console.log('play here idx: ', idx);
    this.metroCore.compasNo = parseInt(idx - 1, 10);
    this.metroCore.startPlaying();
  };

  setPalo(paloIdx) {
    this.paloidx = paloIdx;
    if (paloIdx === 0) {
      this.metroCore.curPattern = beatAlegriasTraditional;
    }
    if (paloIdx === 1) {
      this.metroCore.curPattern = beatSeguiriyas;
    }
    if (paloIdx === 2) {
      this.metroCore.curPattern = beatTangos;
    }

    console.log('this.metroCore.curPattern: ', this.metroCore.curPattern);
  }

  async localJson() {
    const getJson = async () => {
      return fetch("compas-table.json")
        .then(response => response.json())
        .then(response => {
          let json = response;
          console.log('localJson: ', json);

          self.setDatas(json);
          self.metroCore.setCompasTable(json);
          //                self.tableCreate();
          console.log('json: ', json)
          // console.log('this.datas: ', this.datas)

          // self.addHeader();
          // self.CreateRow(self.getDatas() );
        });
    }
    await getJson();
    //this.SetupSelection();
  }

  loadJson() {
    return self.localJson();
    return getCompas()
      .then(response => response)
      .then(response => {
        console.log('from server: ', (response.data),
          ', json.length: ', response.data.length);

        if (response.data.length > 0) {
          // let json = JSON.stringify(res.data);
          // console.log('from server, ', json);
          self.setDatas(response.data);
          self.metroCore.setCompasTable(response.data);
        } else {
          // go on load from local.
          self.localJson();
        }
        return response.data;
      });
  }

  setCore(core) {
    this.metroCore = core;
  }

  saveJson() {
    postCompas(self.getDatas());

    // let jsonData = JSON.stringify(self.getDatas());
    // var blob = new Blob([jsonData], {type: "application/json"});
    // var saveAs = window.saveAs;
    // saveAs(blob, "my_outfile.json");
    // console.log('jsonData: ', jsonData);
    // download(jsonData, 'json.txt', 'text/plain');
  }

  deleteCompas(compasIdx) {
    let actualIdx = compasIdx - 1;
    console.log('_datas:', this.getDataByIdx(compasIdx), ', compasIdx: ', compasIdx);
    this.deleteDatas(actualIdx);
  }

  insertCompas(compasIdx) {
    let actualIdx = compasIdx - 1;
    console.log('_datas:', this.getDataByIdx(compasIdx), ', compasIdx: ', compasIdx);
    let aCompas = this.getDataByIdx(actualIdx);

    this.insertDatas(actualIdx, aCompas);
    //        self.tableCreate();
  }

}

export default MetronomeModel;

