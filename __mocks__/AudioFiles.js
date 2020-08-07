//import clapsound from "./Clap_bright.wav";
//let clapsound = "./Clap_bright.wav";
//https://github.com/FormidableLabs/react-music/issues/56


class AudioFiles {
  constructor(context, urlList) {
    // console.log('context: ', context);
    // console.log('urlList: ', urlList);
    //    console.log('clapsound: ', clapsound);
    console.log('Mock SoundPlayer: constructor was called');

    const self = this;
    self.buffers = [];

    urlList.forEach((url, index) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.onload = () => context.decodeAudioData(xhr.response,
        (buffer) => self.buffers[index] = buffer,
        (error) => console.error('decode Audio Data error', error));

      //            xhr.open("GET", url);
      // xhr.open("GET", clapsound);
      // xhr.send();
    });
  }
}

export default AudioFiles;
