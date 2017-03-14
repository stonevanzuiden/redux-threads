import React from 'react';
import { createStore } from 'redux';
import { connect } from 'react-redux';
import { mount } from 'enzyme';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import { makeConnectArgs } from '../src';

chai.use(chaiEnzyme())

class TestComponent extends React.Component {
  render() {
    return <div>Test Component</div>;
  }
}

import util from 'util';
const deepLog = obj => {
  console.log(util.inspect(obj, { depth: null }))
}

describe('makeConnectArgs', () => {
  context('passed a number of arrays of [selectors, actionCreators, propMergers]', () => {
    it('should return args for react-redux connect bindings', () => {

      const thread1 = [
        {
          selector1: state => state.one,
          selector2: state => state.two
        },
        {
          action1: (stateOne) => ({
            type: 'ACTION1',
            payload: stateOne
          }),
          action2: () => ({
            type: 'ACTION2'
          })
        },
        (stateProps, dispatchProps) => ({
          boundAction1: dispatchProps.action1.bind(null, stateProps.selector1)
        })
      ];

      const thread2 = [
        {
          selector3: state => state.three,
          selector4: state => state.four
        },
        {
          action3: (stateThree) => ({
            type: 'ACTION3',
            payload: stateThree
          }),
          action4: () => ({
            type: 'ACTION4'
          })
        },
        (stateProps, dispatchProps) => ({
          boundAction3: dispatchProps.action3.bind(null, stateProps.selector3)
        })
      ];

      const connectArgs = makeConnectArgs(thread1, thread2);

      const store = createStore((state, action) => state, {
        one: 1,
        two: 2,
        three: 3,
        four: 4
      });

      const TestContainer = connect(...connectArgs, { withRef: true })(TestComponent);

      const testContainer = mount(<TestContainer store={store} />);

      const props = testContainer.instance().getWrappedInstance().props;

      expect(testContainer.find(TestComponent)).to.have.props({
        selector1: 1,
        selector2: 2,
        selector3: 3,
        selector4: 4
      })
    })
  })
})