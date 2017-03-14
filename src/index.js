import zip from 'lodash.zip';
import resolveSelectors from './resolveSelectors';
import bindActionCreators from './recursiveBindActionCreators';

export const combineConnectors = connectors => (connectors.reduce((combined, connector) => {
  return Object.assign({}, connector, combined);
}, {}))

export const makeMapStateToProps = combinedSelectors => {
  return function mapStateToProps(state) {
    return resolveSelectors(combinedSelectors, state);
  }
}

export const makeMapDispatchToProps = combinedActionCreators => {
  return function mapDispatchToProps(dispatch) {
    return bindActionCreators(combinedActionCreators, dispatch)
  }
}

export const makeMergeProps = (propMergers) => {
  return function mergeProps(stateProps, dispatchProps, ownProps) {
    return Object.assign({}, ownProps, dispatchProps, stateProps,
      propMergers.reduce((mergers, merger) => {
        return Object.assign({}, merger(stateProps, dispatchProps), mergers);
      }, {})
    );
  }
}

const mappers = [
  selectors => makeMapStateToProps(combineConnectors(selectors)),
  actionCreators => makeMapDispatchToProps(combineConnectors(actionCreators)),
  propMergers => makeMergeProps(propMergers)
]

export function makeConnectArgs(...connectors) {
  return zip(...connectors).map((connectors, index) => {
    return mappers[index](connectors)
  })
}

export const createConstants = constants => {
  const states = [
    'START',
    'COMPLETED',
    'FAILED'
  ];
  return constants.reduce((constantsToExport, constant) => {
    const stateConstants = states.reduce((stateConstants, state) => {
      const constantWithState = `${constant}_${state}`;
      stateConstants[constantWithState] = constantWithState;
      return stateConstants;
    }, {
      [constant]: constant
    });
    return Object.assign(constantsToExport, stateConstants);
  }, {});
}