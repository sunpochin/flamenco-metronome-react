import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import Editor from './containers/Editor/Editor';
import MetronomeModel from './containers/Editor/MetronomeModel.js';

// https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test
import 'regenerator-runtime/runtime';

import { shallow } from 'enzyme';


test('renders learn react link', () => {
  const isUnitTest = true;
  //  const welcome = shallow(<Editor isUnitTest={isUnitTest} />);
  const welcome = shallow(<Editors />);
  expect(welcome).toContain('Flamenco Metronome Editor');


  // const { getByText } = render(
  //   // <BrowserRouter>
  //   //    shallow(<Editor isUnitTest={isUnitTest} />)
  //   // </BrowserRouter>
  //   // <BrowserRouter>
  //   //   <Editor isUnitTest={isUnitTest} />
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

