import $ from 'jquery';
import {serverapi, postCompas, getCompas} from './serverapi.js';

// import axios from 'axios';
// import MetronomeWorker from './MetronomeWorker.js';
// import {postCompas, getCompas} from './server-api.js';
// const SpeedType = 'subida';
const MetronomeCore = require('./MetronomeCore.js');

let self = null;
let arrayPalo = ["Alegrias", "Tangos", "Soleares", "Bulerias"];
let arraySpeedType = ["Constant", "Inc. by Beat", "Inc. by Compas", "Dec. by Beat", "Dec. by Compas"];


function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function inputClickHandler(e) {
    e = e || window.event;
    var tdElm = e.target || e.srcElement;
    if(tdElm.style.backgroundColor == 'rgb(255, 0, 0)'){
        tdElm.style.backgroundColor = '#fff';
    } else {
        tdElm.style.backgroundColor = '#f00';
    }
}

//export default class MetronomeEditor {
class MetronomeEditor {
    /**
     * Creates a MetronomeEditor.
     * @param soundsPath the path used to fetch the sound files
     * @param sounds an array of sound file names
     * @param visSettings settings for the visualizer
     * @param soundSelectId the ID of the HTML select control for the sounds
     * @param visTypeSelectId the ID of the HTML select control for the visualization types
     * @param startStopId the ID of the HTML button to start and stop the metronome
     */
    constructor(soundsPath, sounds, visSettings, soundSelectId, 
        visTypeSelectId, startStopId) {
        // console.log('constructor: ' );
        self = this;
        // mimicing private variables: https://stackoverflow.com/a/28165599/720276
        let _datas = [];
        self.setDatas = function(datas) { _datas = datas; }
        self.getDatas = function() { return _datas; }
        self.getDataByIdx = function(idx) { return _datas[idx]; }
        self.insertDatas = function(idx, aCompas) { 
            _datas.splice(idx, 0, aCompas); 
        }

        self.visSettings = visSettings;
        self.soundSelectId = soundSelectId || 'soundSelect';
//        console.log('this.soundSelectId: ', this.soundSelectId);
        self.visTypeSelectId = visTypeSelectId || 'visType';
        self.startStopId = startStopId || 'metronome';
        const metroSoundListener = {
            setTempo: (t) => visSettings.tempoBpm = t,
            setStartTime: (t) => visSettings.startTime = t
        };
        self.metroWorker = new MetronomeCore(soundsPath, sounds, metroSoundListener);

        self.createButtons();
        self.loadJson();


        if (null == visSettings) {
            return;
        }
        var btnplaymetronome = document.getElementById('playmetronome');
        btnplaymetronome.addEventListener("click", function() {
            self.startStop();
        });
        visSettings.getTime = () => self.metroWorker.audioContext.currentTime;
        
    }

    // start of stop the beating.
    startStop() {
        self.metroWorker.startStop();
        $('#' + self.startStopID).val(self.metroWorker.running ? 'Stop' : 'Start')
    }

    createButtons() {
        let mainCon, iBtn, iDiv;
//        mainCon = document.getElementById('main-container');
        mainCon = document.getElementById('div1');
//        mainCon = document.body;

        // iDiv = document.createElement('div');
        // iDiv.className = 'col-md-4'; 

        // iBtn = document.createElement("button");
        // iBtn.className = "btn btn-success";
        // iBtn.textContent = 'Load';
        // iBtn.id = 'btn-load';
        // mainCon.appendChild(iBtn);

        // iBtn = document.createElement("button");
        // iBtn.className = "btn btn-warning";
        // iBtn.textContent = 'Save';
        // iBtn.id = 'btn-save';
        // mainCon.appendChild(iBtn);
//        mainCon.appendChild(iDiv);

        iBtn = document.getElementById('btn-load');
        if (null == iBtn) {
            console.log('iBtn null');
            return;
        }
        iBtn.addEventListener("click", function() {
            self.loadJson();
        });

        iBtn = document.getElementById('btn-save');
        iBtn.addEventListener("click", function() {
            self.saveJson();
        });

    }

    setAudioContext(audio) {
        self.metroWorker.setAudioContext(audio);
    }

    SetupSelection() {
        // Setting up selection of HTML.
        // CompasPattern: AsPalo, OnBeat.
        const Palo = $('#' + 'Palo');
        Palo.append(`<option>AsPalo</option>`);
        Palo.append(`<option>OnBeat</option>`);

        console.log('cnt: ', this.getDatas().length)
        for (let element of this.getDatas() ) {
            const soundSelect = $('#' + this.soundSelectId + element["no"]);
            console.log('soundSelect: ', soundSelect);
            // for (const name of sounds) {
            //     const fileExtension = /\..*/;
            //     const optionText = name.replace('_', ' ').replace(fileExtension, '');
            //     console.log('optionText: ', optionText);
            //     soundSelect.append(`<option>${optionText}</option>`);
            // }
            // soundSelect.append(`<option>${optionText}</option>`);
        }
    }

    async localJson() {
        const getJson = async () => {
            return fetch("res/compas-table.json")
            .then(response => response.json())
            .then(json => {
                console.log('local json');

                self.setDatas(json);
                self.metroWorker.setCompasTable(json);
//                self.tableCreate();
                console.log('json: ', json)
                // console.log('this.datas: ', this.datas)

                // self.addHeader();
                // self.CreateRow(self.getDatas() );
            });
        }
        await getJson();
        this.SetupSelection();
    }

    loadJson() {
        getCompas()
            .then(response => response)
            .then(response => {
                console.log('from server: ', (response.data), 
                    ', json.length: ', response.data.length );

                if (response.data.length > 0) {
                    // let json = JSON.stringify(res.data);
                    // console.log('from server, ', json);
        
                    self.setDatas(response.data);
                    self.metroWorker.setCompasTable(response.data);
//                    self.tableCreate();
                    return;
                } else {
                    // go on load from local.
                    self.localJson();
                }
            });
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

    // https://stackoverflow.com/questions/14643617/create-table-using-javascript
    // https://www.valentinog.com/blog/html-table/
    generateTableHead(table, data) {
        if (null == table) {
            return;
        }
        let thead = table.createTHead();
        let row = thead.insertRow();
        let th = document.createElement("th");
        let text = document.createTextNode('Here:');
        th.appendChild(text);
        row.appendChild(th);
        for (let key of data) {
            let th = document.createElement("th");
            let text = document.createTextNode(key );
            th.appendChild(text);
            row.appendChild(th);
        }
        // th = document.createElement("th");
        // text = document.createTextNode("+");
        // th.appendChild(text);
        // row.appendChild(th);

        var iBtn = document.createElement('button');
        let colID = "add_" + 0;
        iBtn.setAttribute("id", colID);
        iBtn.className = "btn-info";
        iBtn.textContent = "+ compas"
        iBtn.addEventListener("click", function() {
            self.addCompas(this);
        });
        let cell = row.insertCell();
        cell.appendChild(iBtn);
    }
    
    generateTable(table, data) {
        if (null == table) {
            return;
        }
        let tbody = document.createElement('tbody');
        table.appendChild(tbody);

        for (let element of data) {
            let row = tbody.insertRow();
            let cell = row.insertCell();
            let item = null, colID = null, iSelect = null, option = null;
            // adding No.
            cell = row.insertCell();
            item = document.createElement('button');
            colID = "no_" + element["no"];
            item.setAttribute("id", colID);
            item.className = "btn btn-lg btn-primary disabled";
            item.textContent = colID;
            item.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });
            cell.appendChild(item);

            // adding select.
            iSelect = document.createElement('select');
            colID = "Palo_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });
            for (var i = 0; i < arrayPalo.length; i++) {
                option = document.createElement("option");
                option.value = arrayPalo[i];
                option.text = arrayPalo[i];
                iSelect.appendChild(option);
            }
            cell = row.insertCell();
            cell.appendChild(iSelect);

            // Speed
            var iInput = document.createElement('input');
            colID = "Speed_" + element["no"];
            iInput.value = element["Speed"];
            iInput.setAttribute("id", colID);
            iInput.setAttribute("type", "text");
            iInput.width = 1000;
            iInput.height = 1000;
//            iInput.setAttribute("class", "form-control");
            cell = row.insertCell();
            cell.appendChild(iInput);

            // Subida
            iSelect = document.createElement('select');
            colID = "soundSelect_" + element["no"];
            iSelect.setAttribute("id", colID);
            iSelect.setAttribute("class", "form-control-sm");
            iSelect.addEventListener("change", function() {
                self.setSound(this.selectedIndex + 1);
            });
            for (var i = 0; i < arrayPalo.length; i++) {
                option = document.createElement("option");
                option.value = arraySpeedType[i];
                option.text = arraySpeedType[i];
                iSelect.appendChild(option);
            }
            cell = row.insertCell();
            cell.appendChild(iSelect);

            var iBtn = document.createElement('button');
            colID = "add_" + element["no"];
            iBtn.setAttribute("id", colID);
            iBtn.className = "btn-info";
            iBtn.textContent = "+ compas"
            iBtn.addEventListener("click", function() {
                self.addCompas(this);
            });
            cell = row.insertCell();
            cell.appendChild(iBtn);
        }
    }
    
    tableCreate() {
        // https://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
        let table = document.getElementById("compas-table");
        // delete rows.
        while(table.rows.length > 0) {
            table.deleteRow(0);
        }
        table.deleteTHead();

        let firstdata = self.getDataByIdx(0);
        let header = Object.keys(firstdata);
        console.log(' firstdata: ', firstdata);
        console.log(' header: ', header);
            // console.log('document: ', document, ', table: ', table, 
            // ', firstdata: ', firstdata, ', header: ', header )

        self.generateTableHead(table, header);
        self.generateTable(table, self.getDatas() );


        var all = document.getElementsByTagName("td");
        for (var i=0;i<all.length;i++) {
            all[i].onclick = inputClickHandler;       
        }        
    }


    //https://stackoverflow.com/questions/17001961/how-to-add-drop-down-list-select-programmatically
    //https://stackoverflow.com/questions/14643617/create-table-using-javascript
    AddToRow(iEle, iRow) {
        iEle.className = "btn btn-primary btn-lg";
        var iCol = document.createElement('div');
        iCol.className = "col-md-2";
        iCol.appendChild(iEle);
        iRow.appendChild(iCol);
    }

    CreateAddCompasBtn(rowIdx) {
        let rowID = "add_" + rowIdx;
        console.log('rowID: ', rowID);
        let iBtn = document.createElement('button');
        iBtn.setAttribute("id", rowID);
        iBtn.className = "btn-info";
        iBtn.textContent = "+ compas"
        iBtn.addEventListener("click", function() {
            self.addCompas(this);
        });
//            iBtn.setAttribute("class", "form-control");
        return iBtn;
    }

    /**
     * Sets the tempo.
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        this.metroWorker.setTempo(bpm);
    }

    /**
     * Setting palo pattern.
     * @param bpm tempo in beats per minute
     */
    setPalo(type) {
        this.metroWorker.setPalo(type);
    }

    addCompas(element) {
        console.log('addCompas element: ', element);
        const toStr = (element.id).toString();

        const compasIdx = parseInt(toStr.replace('add_', '') );
        console.log('addCompas, compasNo: ', element.id, 
            ', toStr: ', toStr, ', compasIdx: ', compasIdx);
        let aJson = {
            'no': '0',
            'Palo': 'Alegrias',
            'Speed': 300, 
            'SType': 'Constant'
        };
        aJson['no'] = compasIdx.toString() ;
    
        self.insertDatas(compasIdx, aJson);
        for (let idx = compasIdx + 1; idx < self.getDatas().length; idx++ ) {
            console.log('idx: ', idx, ', self.getDataByIdx(idx): ', 
                self.getDataByIdx(idx) );
            let oldNo = parseInt(self.getDataByIdx(idx)['no'], 10);
            self.getDataByIdx(idx)['no'] = oldNo + 1;
        }
//        self.tableCreate();
    }

    /**
     * Sets the metronome sound.
     * @param number the one-based sound index
     */
    setSound(number) {
        this.metroWorker.setSound(number);
    }

    /**
     * Sets the visualization type.
     * @param index a 0-based number specifying the visualization to use
     */
    setVisualization(index) {
        this.visSettings.visualizationType = index;
    }

}

export default MetronomeEditor;
