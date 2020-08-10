import MetronomeModel from '../containers/Editor/MetronomeModel.js';

// https://stackoverflow.com/questions/42535270/regeneratorruntime-is-not-defined-when-running-jest-test
import 'regenerator-runtime/runtime';
import Enzyme, { shallow } from 'enzyme'
import EnzymeAdapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new EnzymeAdapter()
})



describe('test model', () => {
  test('test model add compas', () => {
    let theModel = new MetronomeModel();
    theModel.insertCompas(0);
    const len = theModel.getDatas().length;
    let testData = theModel.getDataByIdx(0);
    console.log('len: ', len, ', testData:', testData);

    expect(theModel.getDatas().length).toBe(1);
    expect(testData).not.toBe(undefined);
  });

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

