import mapValues from 'lodash.mapvalues';

export default function resolveSelectors(selectors, state) {
  return mapValues(selectors, selector => {
    if (typeof selector === 'function') {
      return selector(state)
    }
    return resolveSelectors(selector, state)
  })
}