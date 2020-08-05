
import sound from "./Clap_bright.wav"
let endtime = new Date().getTime();
// let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
//     1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0 ];
let beatAlegriasTraditional = [1.5, 0.5, 1, 1.5, 0.5, 1,
    1.0, 0.5, 0.5, 1.0, 0.5, 0.5, 1.0, 1.0 ];
// let beatAlegriasTraditional = [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0,
//         1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
    
let beatTangos = [0, 1.0, 0.5, 0.5, 1.0, 1.0];

let self = null;

const VisSettings = {
    tempoBpm: 0,
    startTime: 0,
    getTime: undefined,
    visualizationType: 1,
    names: ['Spinning Circle', 'Circle']
};


//export default class MetronomeCore {
class MetronomeCore {
    constructor(soundsPath, sounds, listener) {
        self = this;
        this.soundsPath = soundsPath;
        const dummyListener = { setTempo: (t) => {}, setStartTime: (t) => {} };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 140;
        this.soundNum = 1;
        this.sounds = sounds;
        this.compasNo = 0;
    }

    /**
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        console.log('in setTempo');
        this.tempoBpm = bpm;
    }


    setAudioContext(audioContext) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const urls = this.sounds.map(name => this.soundsPath + name);
        this.soundFiles = new AudioFiles(this.audioContext, urls);
    }

    /**
     * @param number the one-based sound index
     */
    setSound(number) {
        this.soundNum = number;
    }

    setPalo(paloType) {
        this.paloType = paloType;
    }

    updateCompasIndicator() {
        // let compasTable = document.getElementById('compas-table');
        // console.log('updateCompasIndicator: ', this.compasNo, ', compasTable: ', compasTable);
        // let cell = compasTable.rows[self.compasNo + 1].cells[0];
        // cell.innerHTML = "==>";
    }


    setCompasTable(compasJson) {
        self.compasJson = compasJson;
    }

    playMetronome() {
        const self = this;
        let beatCounter = 0;    //
        self.updateCompasIndicator();

        // An array to represent the beating pattern of different palos.
        var beatPattern = beatAlegriasTraditional;
        let nextStart = self.audioContext.currentTime;
        function schedule() {
            // update the indicator when start beating.
            self.updateCompasIndicator();

            const speed = self.compasJson[self.compasNo]['Speed'];
            // console.log('typeof', typeof(self.compasNo), ' ,compas no: ', self.compasNo, ', speed: ', speed);
            // console.log('speed: ', speed)
            if (undefined !== speed ) {
                // change speed only when it's a valid Map.get() result.
                self.tempoBpm = speed;
            }
            // console.log('self.compasNo', self.compasNo, ' ,speed: ', speed, ' ,self.tempoBpm: ', self.tempoBpm);
            if (!self.running) {
                return;
            }

            self.listener.setStartTime(nextStart);
            self.listener.setTempo(self.tempoBpm);
            let soundIdx = 1; // non-heavy beat sound.
            if (soundIdx >= self.soundFiles.buffers.length) {
                alert('Sound files are not yet loaded')
            } else if (self.tempoBpm) {
                console.log('beatCounter: ', beatCounter, 
                    ' ,soundIdx: ', soundIdx);
                if (beatCounter == 0 ) {
                    soundIdx = 0;
                }

                // if (beatCounter == 2 || beatCounter == 5 || beatCounter == 8 
                //     || 11 == beatCounter || 14 == beatCounter
                //     // || 0 == beatCounter
                // //     ) {
                //     // if (beatCounter == 1 || beatCounter == 4 || beatCounter == 7 
                //     //     || 10 == beatCounter || 13 == beatCounter

                self.source = self.audioContext.createBufferSource();
                self.source.buffer = self.soundFiles.buffers[soundIdx];
                self.source.connect(self.audioContext.destination);
                self.source.onended = schedule;
                // start play a sound now
                self.source.start(nextStart);
                // then plan next sound time.
                nextStart += (60 / self.tempoBpm) * beatPattern[beatCounter];

                beatCounter++;
                // change compas
                if (beatPattern.length == beatCounter) {
                    beatCounter = beatCounter % beatPattern.length;
                    self.compasNo += 1;
                    console.log('beatCounter: ', beatCounter, ', self.compasNo:', self.compasNo);
                }

                // debugging.
                let diff = new Date().getTime() - endtime;
                endtime = new Date().getTime();
//                console.log('endtime: ', endtime, ', diff: ', diff);
            }
        }
        schedule();
    }

    startStop() {
        const ms = this;

        if (this.running = !this.running) {
            this.playMetronome();
        } else {
            this.listener.setTempo(0);
            if (this.source) {
                this.source.disconnect();
                this.source = undefined;
            }
            self.compasNo = 0;
        }
    }
}

class AudioFiles {
    constructor(context, urlList) {
        // console.log('context: ', context);
        // console.log('urlList: ', urlList);
        console.log('sound: ', sound);

        const self = this;
        self.buffers = [];

        urlList.forEach((url, index) => {
            const xhr = new XMLHttpRequest();
            xhr.responseType = "arraybuffer";
            xhr.onload = () => context.decodeAudioData(xhr.response,
                (buffer) => self.buffers[index] = buffer,
                (error) => console.error('decode Audio Data error', error));

//            xhr.open("GET", url);
            xhr.open("GET", sound);
            xhr.send();
        });
    }
}

//let compasTempoPair = [(1, 140), (4, 180), (7, 140), (8, 70) ];
// var compasTempoMap = new Map([
// //    [1, 140], [2, 180], [7, 140], [8, 70]] );
// //    [1, 5140], [2, 5180], [7, 5140], [8, 570]] );
//     [1, 70], [5, 80], [7, 90], [11, 100],
//     [13, 120], [15, 120], [17, 120],
//     [29, 140], [30, 160], [31, 180], [32, 200],
//     [33, 200],
// ] );



// module.exports = {
//     MetronomeCore
// }

// modules.exports = {
//     MetronomeCore
// }

//exports MetronomeCore;
//module export MetronomeCore;
export {MetronomeCore, VisSettings};
