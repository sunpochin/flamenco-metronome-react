let endtime = new Date().getTime();


let self = null;

const VisSettings = {
    tempoBpm: 0,
    startTime: 0,
    getTime: undefined,
    visualizationType: 1,
    names: ['Spinning Circle', 'Circle']
};

export default class MetronomeCore {
    constructor(listener) {
        self = this;
        const dummyListener = { setTempo: (t) => { }, setStartTime: (t) => { } };
        this.listener = listener || dummyListener;
        this.running = false;
        this.tempoBpm = 140;
        this.soundNum = 1;
        this.compasNo = 0;
        this.curPattern = [];
    }

    /**
     * @param bpm tempo in beats per minute
     */
    setTempo(bpm) {
        console.log('in setTempo');
        this.tempoBpm = bpm;
    }

    setNotifyChange(RenderView) {
        this.RenderView = RenderView;
    }

    setAudioContext(audioContext, soundFiles) {
        this.audioContext = audioContext;
        this.soundFiles = soundFiles;
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
        this.RenderView();
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
        var beatPattern = this.curPattern;
        console.log('this.curPattern: ', this.curPattern)
        let nextStart = self.audioContext.currentTime;
        function schedule() {
            // update the indicator when start beating.
            self.updateCompasIndicator();


            if (0 === self.compasJson.length) {
                alert('compas table empty!');
                return;
            }
            const speed = self.compasJson[self.compasNo]['Speed'];
            // console.log('typeof', typeof(self.compasNo), ' ,compas no: ', self.compasNo, ', speed: ', speed);
            // console.log('speed: ', speed)
            if (undefined !== speed) {
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
                if (0 === beatCounter) {
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
                if (beatPattern.length === beatCounter) {
                    beatCounter = beatCounter % beatPattern.length;
                    self.compasNo += 1;
                    console.log('beatCounter: ', beatCounter, ', self.compasNo:', self.compasNo);
                }

                // debugging.
                // let diff = new Date().getTime() - endtime;
                // endtime = new Date().getTime();
                // console.log('endtime: ', endtime, ', diff: ', diff);
            }
        }
        schedule();
    }

    startStop() {
        //        const ms = this;

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


//let compasTempoPair = [(1, 140), (4, 180), (7, 140), (8, 70) ];
// var compasTempoMap = new Map([
// //    [1, 140], [2, 180], [7, 140], [8, 70]] );
// //    [1, 5140], [2, 5180], [7, 5140], [8, 570]] );
//     [1, 70], [5, 80], [7, 90], [11, 100],
//     [13, 120], [15, 120], [17, 120],
//     [29, 140], [30, 160], [31, 180], [32, 200],
//     [33, 200],
// ] );



export { MetronomeCore, VisSettings };
