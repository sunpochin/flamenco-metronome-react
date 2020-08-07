import { postCompas, getCompas } from './serverapi.js';

let self = null;
// store the non-UI, re-usable parts: compas-list, logic.
class MetronomeModel {

  constructor() {
    self = this;
    // mimicing private variables: https://stackoverflow.com/a/28165599/720276
    let _datas = [];
    self.setDatas = function (datas) {
      _datas = datas;
      console.log('in setData: ', _datas);
    }
    self.getDatas = function () { return _datas; }
    self.getDataByIdx = function (idx) { return _datas[idx]; }
    self.insertDatas = function (idx, aCompas) {
      _datas.splice(idx, 0, aCompas);
    }
    self.deleteDatas = function (idx) {
      _datas.splice(idx, 1);
    }

  }

  loadJson() {
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

