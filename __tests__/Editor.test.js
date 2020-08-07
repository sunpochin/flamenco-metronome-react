// https://github.com/facebook/jest/issues/2663#issuecomment-485017143
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Editor from '../src/containers/Editor/Editor';
import AudioFiles from '../src/containers/Editor/AudioFiles';
import MetronomeModel from '../src/containers/Editor/MetronomeModel.js';
import MetronomeCore from '../src/containers/Editor/MetronomeCore.js';

// https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test
import 'regenerator-runtime/runtime';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new EnzymeAdapter()
})

test('MetronomeCore test', () => {
  let soundsPath = './res/audio/';
  let sounds = ['Low_Bongo.wav', 'Clap_bright.wav',];
  const metroSoundListener = {
    setTempo: (t) => VisSettings.tempoBpm = t,
    setStartTime: (t) => VisSettings.startTime = t
  };
  // https://stackoverflow.com/a/46185630/720276
  const testCore = new MetronomeCore(metroSoundListener);
  // const testCore = new MetronomeCore(soundsPath, sounds,
  //   metroSoundListener);
  // audioContext = new (window.AudioContext || window.webkitAudioContext)();
  // const urls = this.sounds.map(name => this.soundsPath + name);
  // soundFiles = new AudioFiles(this.audioContext, urls);
  let audioContext = null;
  let soundFiles = null;
  testCore.setAudioContext(audioContext, soundFiles);
  console.log('testCore: ', testCore);
});

test('renders of Editor', () => {
  const isUnitTest = true;
  const wrapper = shallow(<Editor isUnitTest={isUnitTest} />);
  //  const wrapper = shallow(<Editor />);
  console.log(wrapper.debug());
  expect(wrapper.debug()).toContain('Flamenco Metronome Editor');

  // const { getByText } = render(
  //   // <BrowserRouter>
  //   //    shallow(<Editor isUnitTest={isUnitTest} />)
  //   // </BrowserRouter>
  // );
  // const linkElement = getByText(/Flamenco Metronome Editor/i);
  // expect(linkElement).toBeInTheDocument();
});


test('test model', () => {
  let theModel = new MetronomeModel();

  function callback(data) {
    try {
      //      expect(data).toBe('peanut butter');
      const len = theModel.getDatas().length;
      console.log('len: ', len);

      expect(len).toBeGreaterThan(0);
      done();
    } catch (error) {
      done(error);
    }
  };

  const ret = theModel.loadJson();
  console.log('ret:', ret);

  //  theModel.getDatas(callback);
  //  console.log('theModel.getDatas();:');
  // expect(linkElement).toBeInTheDocument();
});


describe('test model', () => {
  test('test load data 2', () => {
    let theModel = new MetronomeModel();
    theModel.loadJson().then(data => {
      const len = theModel.getDatas().length;
      console.log('len: ', len);
      expect(len).toBeGreaterThan(0);
    });
  });

  test('test load data 3', () => {
    console.log('data 3: ');
    let theModel = new MetronomeModel();
    theModel.loadJson().then(data => {
      const len = theModel.getDatas().length;
      console.log('len: ', len);
      expect(len).toBeGreaterThan(0);
    });

  });

});

